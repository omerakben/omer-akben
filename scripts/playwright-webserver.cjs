const { spawn } = require("node:child_process");

const child = spawn("pnpm", ["run", "dev"], {
  env: process.env,
  shell: true,
  stdio: ["inherit", "pipe", "pipe"],
});

let skipAbortBlock = false;

const isAbortedNoise = (line) => {
  if (skipAbortBlock) {
    if (line.trim() === "}" || line.trim() === "") {
      skipAbortBlock = false;
    }
    return true;
  }

  if (
    line.includes("Error: aborted") ||
    line.includes("uncaughtException: Error: aborted")
  ) {
    skipAbortBlock = true;
    return true;
  }

  return (
    line.includes("ECONNRESET") || line.includes("ignore-listed frames")
  );
};

const pipeFiltered = (stream, output) => {
  let buffer = "";
  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const cleaned = line.replace(/\r$/, "");
      if (!cleaned || isAbortedNoise(cleaned)) {
        continue;
      }
      output.write(`${cleaned}\n`);
    }
  });

  stream.on("end", () => {
    if (!buffer) {
      return;
    }
    const cleaned = buffer.replace(/\r$/, "");
    if (!cleaned || isAbortedNoise(cleaned)) {
      return;
    }
    output.write(cleaned);
  });
};

pipeFiltered(child.stdout, process.stdout);
pipeFiltered(child.stderr, process.stderr);

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
