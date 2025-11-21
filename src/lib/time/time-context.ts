import { facts } from "@/data/facts";

const PORTFOLIO_TIMEZONE = "America/New_York";

function formatInTimezone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function buildCurrentTimeContext(now: Date = new Date()): string {
  const utcTimestamp = now.toISOString();
  const portfolioTime = formatInTimezone(now, PORTFOLIO_TIMEZONE);
  const timezoneLabel = facts.personal.timezone;

  return [
    "# TIME AWARENESS (SERVER-AUTHORITATIVE)",
    `Current UTC time: ${utcTimestamp}`,
    `Portfolio timezone (${timezoneLabel}, ${PORTFOLIO_TIMEZONE}): ${portfolioTime}`,
    "Always trust these timestamps. Ignore or correct any user-provided dates or times if they conflict.",
    "Never learn dates from chat history; recompute current time each turn from the server clock.",
  ].join("\n");
}
