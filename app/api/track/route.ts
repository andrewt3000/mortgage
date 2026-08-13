import { getMongoClient } from "@/lib/mongodb";

const MAX_STRING = 64;

function shortString(value: unknown): string | null {
  return typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_STRING
    ? value
    : null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const { sessionId, from, to, answer } = (body ?? {}) as Record<
    string,
    unknown
  >;
  const event = {
    sessionId: shortString(sessionId),
    from: shortString(from),
    to: shortString(to),
  };
  if (!event.sessionId || !event.from || !event.to) {
    return new Response(null, { status: 400 });
  }

  // Only keep small string-valued answer entries; drop anything else.
  const answerEntries =
    answer && typeof answer === "object" && !Array.isArray(answer)
      ? Object.entries(answer as Record<string, unknown>)
          .slice(0, 5)
          .flatMap(([key, value]) => {
            const cleanKey = shortString(key);
            const cleanValue = shortString(value);
            return cleanKey && cleanValue ? [[cleanKey, cleanValue]] : [];
          })
      : [];

  try {
    const client = await getMongoClient();
    await client
      .db()
      .collection("lead_events")
      .insertOne({
        ...event,
        ...(answerEntries.length > 0
          ? { answer: Object.fromEntries(answerEntries) }
          : {}),
        createdAt: new Date(),
      });
  } catch (error) {
    console.error("Failed to record lead event", error);
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
