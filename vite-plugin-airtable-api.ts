import type { Plugin } from "vite";
import { loadEnv } from "vite";

const BASE_ID = "app8MiB9XxERjKDqC";
const EVENTS_TABLE = "tblsZMV8hbA285Lay";
const TEAM_TABLE = "tblRtMfdCG6kRbsux";
const FAQ_TABLE = "FAQ";
const LEADERBOARD_TABLE = "tbllhjVqoNereN2Jq";

function escapeAirtableFormulaString(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\\/g, "\\\\");
}

async function readBody(req: import("http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
  });
}

function jsonRes(res: import("http").ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

export function airtableApiPlugin(): Plugin {
  return {
    name: "vite-plugin-airtable-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      const apiKey = env.AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY;

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/airtable/")) return next();

        const path = req.url.replace(/[#?].*$/, "");
        const route = path.replace("/api/airtable/", "");

        const headers = {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };

        if (!apiKey) {
          jsonRes(res, 500, { error: "AIRTABLE_API_KEY is not configured. Add it to .env" });
          return;
        }

        try {
          if (route === "events" && req.method === "GET") {
            const r = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${EVENTS_TABLE}`, { headers });
            const data = await r.json();
            jsonRes(res, r.status, data);
            return;
          }
          if (route === "team" && req.method === "GET") {
            const r = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TEAM_TABLE}?sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=asc`, { headers });
            const data = await r.json();
            jsonRes(res, r.status, data);
            return;
          }
          if (route === "faq" && req.method === "GET") {
            const r = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${FAQ_TABLE}`, { headers });
            const data = await r.json();
            jsonRes(res, r.status, data);
            return;
          }
          if (route === "leaderboard") {
            if (req.method === "GET") {
              const r = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${LEADERBOARD_TABLE}?sort%5B0%5D%5Bfield%5D=score&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=5`, { headers });
              const data = await r.json();
              jsonRes(res, r.status, data);
              return;
            }
            if (req.method === "POST") {
              const body = (await readBody(req)) as { firstName?: string; lastName?: string; email?: string; score?: number };
              const { firstName, lastName, email, score } = body;
              if (typeof firstName !== "string" || typeof lastName !== "string" || typeof email !== "string" || typeof score !== "number") {
                jsonRes(res, 400, { error: "firstName, lastName, email, and score are required" });
                return;
              }
              const fullName = `${firstName.trim()} ${lastName.trim()}`;
              const playerEmail = email.trim();
              if (!fullName.trim() || !playerEmail) {
                jsonRes(res, 400, { error: "Valid name and email are required" });
                return;
              }
              const escapedName = escapeAirtableFormulaString(fullName);
              const escapedEmail = escapeAirtableFormulaString(playerEmail);
              const existing = await fetch(
                `https://api.airtable.com/v0/${BASE_ID}/${LEADERBOARD_TABLE}?filterByFormula=AND({name}='${escapedName}',{email}='${escapedEmail}')`,
                { headers }
              );
              const existingData = await existing.json();
              if (existingData.records?.length > 0) {
                const rec = existingData.records[0];
                const oldScore = rec.fields?.score ?? 0;
                if (score > oldScore) {
                  const patch = await fetch(
                    `https://api.airtable.com/v0/${BASE_ID}/${LEADERBOARD_TABLE}/${rec.id}`,
                    { method: "PATCH", headers, body: JSON.stringify({ fields: { score } }) }
                  );
                  if (!patch.ok) {
                    jsonRes(res, patch.status, await patch.json());
                    return;
                  }
                }
              } else {
                const create = await fetch(
                  `https://api.airtable.com/v0/${BASE_ID}/${LEADERBOARD_TABLE}`,
                  {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ records: [{ fields: { name: fullName, email: playerEmail, score } }] }),
                  }
                );
                if (!create.ok) {
                  jsonRes(res, create.status, await create.json());
                  return;
                }
              }
              jsonRes(res, 200, { success: true });
              return;
            }
          }
        } catch (err) {
          console.error("[airtable-api]", err);
          jsonRes(res, 500, { error: "Internal server error" });
          return;
        }
        next();
      });
    },
  };
}
