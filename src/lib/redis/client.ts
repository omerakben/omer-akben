import { Redis } from "@upstash/redis";

const DEFAULT_ENCODING_HEADER = "base64";

export type CommandArgument =
  | string
  | number
  | boolean
  | Uint8Array
  | null
  | undefined;

export interface FtSchemaDefinition {
  [path: string]: {
    type: string;
    AS?: string;
    WEIGHT?: number;
  };
}

export interface FtSearchOptions {
  LIMIT?: { from: number; size: number };
  SORTBY?: { BY: string; DIRECTION: "ASC" | "DESC" };
  RETURN?: string[];
  PARAMS?: Array<string | number>;
}

export interface FtSearchDocument {
  id: string;
  value: Record<string, unknown>;
}

export interface FtSearchResult {
  total: number;
  documents: FtSearchDocument[];
}

export interface RedisStackExtensions {
  call: (command: string, ...args: CommandArgument[]) => Promise<unknown>;
  ft: {
    create: (
      index: string,
      schema: FtSchemaDefinition,
      options?: { ON?: string; PREFIX?: string | string[] }
    ) => Promise<unknown>;
    info: (index: string) => Promise<unknown>;
    search: (index: string, query: string, options?: FtSearchOptions) => Promise<FtSearchResult>;
  };
}

export type RedisStackClient = Redis & RedisStackExtensions;

let cachedClient: RedisStackClient | null = null;

function assertEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`[RedisClient] Missing environment variable ${key}`);
  }
  return value;
}

function serializeArgument(arg: CommandArgument): string {
  if (arg === null || typeof arg === "undefined") {
    return "";
  }

  if (typeof arg === "string") {
    return arg;
  }

  if (typeof arg === "number" || typeof arg === "boolean") {
    return String(arg);
  }

  if (arg instanceof Uint8Array) {
    return Buffer.from(arg).toString("base64");
  }

  if (Array.isArray(arg)) {
    return JSON.stringify(arg);
  }

  if (typeof arg === "object") {
    return JSON.stringify(arg);
  }

  return String(arg);
}

async function executeCommand(
  baseUrl: string,
  token: string,
  command: string,
  args: CommandArgument[]
): Promise<unknown> {
  const payload = [command, ...args.map(serializeArgument)];
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Upstash-Encoding": DEFAULT_ENCODING_HEADER,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`[RedisClient] ${command} request failed with status ${response.status}`);
  }

  const data = (await response.json()) as { result?: unknown; error?: string };
  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

function buildFtCreateArguments(
  index: string,
  schema: FtSchemaDefinition,
  options?: { ON?: string; PREFIX?: string | string[] }
): CommandArgument[] {
  const args: CommandArgument[] = [index];

  const onValue = options?.ON ?? "JSON";
  args.push("ON", onValue);

  if (options?.PREFIX) {
    const prefixes = Array.isArray(options.PREFIX) ? options.PREFIX : [options.PREFIX];
    args.push("PREFIX", String(prefixes.length), ...prefixes);
  }

  args.push("SCHEMA");

  for (const [path, definition] of Object.entries(schema)) {
    args.push(path);
    if (definition.AS) {
      args.push("AS", definition.AS);
    }
    args.push(definition.type);
    if (typeof definition.WEIGHT === "number") {
      args.push("WEIGHT", String(definition.WEIGHT));
    }
  }

  return args;
}

function buildFtSearchArguments(
  index: string,
  query: string,
  options?: FtSearchOptions
): CommandArgument[] {
  const args: CommandArgument[] = [index, query];

  if (options?.RETURN?.length) {
    args.push("RETURN", String(options.RETURN.length), ...options.RETURN);
  }

  if (options?.LIMIT) {
    args.push("LIMIT", String(options.LIMIT.from), String(options.LIMIT.size));
  }

  if (options?.SORTBY) {
    args.push("SORTBY", options.SORTBY.BY, options.SORTBY.DIRECTION);
  }

  if (options?.PARAMS?.length) {
    const params = options.PARAMS.map((param) => serializeArgument(param));
    args.push("PARAMS", String(params.length));
    args.push(...params);
  }

  return args;
}

function parseSearchResult(result: unknown): FtSearchResult {
  if (!Array.isArray(result)) {
    return { total: 0, documents: [] };
  }

  const [total, ...rest] = result;
  const parsedTotal = typeof total === "number" ? total : Number(total ?? 0);
  const documents: FtSearchDocument[] = [];

  for (let index = 0; index < rest.length; index += 2) {
    const id = rest[index];
    const value = rest[index + 1];
    if (typeof id !== "string") {
      continue;
    }

    if (Array.isArray(value)) {
      const flattened: Record<string, unknown> = {};
      for (let i = 0; i < value.length; i += 2) {
        const key = value[i];
        const fieldValue = value[i + 1];
        if (typeof key === "string") {
          flattened[key] = fieldValue;
        }
      }
      documents.push({ id, value: flattened });
    } else if (typeof value === "object" && value !== null) {
      documents.push({ id, value: value as Record<string, unknown> });
    }
  }

  return { total: Number.isNaN(parsedTotal) ? 0 : parsedTotal, documents };
}

function extendWithStackCommands(client: Redis, baseUrl: string, token: string): RedisStackClient {
  const augmented = client as RedisStackClient;
  if (typeof augmented.call === "function") {
    return augmented;
  }

  augmented.call = (command: string, ...args: CommandArgument[]) =>
    executeCommand(baseUrl, token, command, args);

  augmented.ft = {
    create: async (index, schema, options) => {
      const args = buildFtCreateArguments(index, schema, options);
      return executeCommand(baseUrl, token, "FT.CREATE", args);
    },
    info: async (index) => executeCommand(baseUrl, token, "FT.INFO", [index]),
    search: async (index, query, options) => {
      const args = buildFtSearchArguments(index, query, options);
      const result = await executeCommand(baseUrl, token, "FT.SEARCH", args);
      return parseSearchResult(result);
    },
  };

  return augmented;
}

export function getRedisClient(): RedisStackClient {
  if (cachedClient) {
    return cachedClient;
  }

  const url = assertEnv(process.env.UPSTASH_REDIS_REST_URL, "UPSTASH_REDIS_REST_URL");
  const token = assertEnv(process.env.UPSTASH_REDIS_REST_TOKEN, "UPSTASH_REDIS_REST_TOKEN");

  const baseClient = new Redis({ url, token });
  cachedClient = extendWithStackCommands(baseClient, url, token);
  return cachedClient;
}

export function __resetRedisClientForTesting(): void {
  cachedClient = null;
}
