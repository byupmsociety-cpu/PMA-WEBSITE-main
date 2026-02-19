const AIRTABLE_BASE_ID = "app8MiB9XxERjKDqC";
const LEADERBOARD_TABLE_ID = "tbllhjVqoNereN2Jq";

function escapeAirtableFormulaString(str: string): string {
  return str.replace(/'/g, "\\'").replace(/\\/g, "\\\\");
}

export default async function handler(
  req: { method?: string; body?: { firstName?: string; lastName?: string; email?: string; score?: number } },
  res: { status: (code: number) => { json: (body: unknown) => void }; setHeader: (name: string, value: string) => void }
) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "AIRTABLE_API_KEY is not configured" });
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  if (req.method === "GET") {
    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${LEADERBOARD_TABLE_ID}?sort%5B0%5D%5Bfield%5D=score&sort%5B0%5D%5Bdirection%5D=desc&maxRecords=5`,
        { headers }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching Airtable leaderboard:", error);
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }

  if (req.method === "POST") {
    const { firstName, lastName, email, score } = req.body ?? {};

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof score !== "number"
    ) {
      return res.status(400).json({ error: "firstName, lastName, email, and score are required" });
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const playerEmail = email.trim();

    if (!fullName.trim() || !playerEmail) {
      return res.status(400).json({ error: "Valid name and email are required" });
    }

    try {
      const escapedName = escapeAirtableFormulaString(fullName);
      const escapedEmail = escapeAirtableFormulaString(playerEmail);

      const existingResponse = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${LEADERBOARD_TABLE_ID}?filterByFormula=AND({name}='${escapedName}',{email}='${escapedEmail}')`,
        { headers }
      );

      if (!existingResponse.ok) {
        const errData = await existingResponse.json();
        return res.status(existingResponse.status).json(errData);
      }

      const existingData = await existingResponse.json();

      if (existingData.records.length > 0) {
        const existingRecord = existingData.records[0];
        const existingScore = existingRecord.fields?.score ?? 0;

        if (score > existingScore) {
          const updateResponse = await fetch(
            `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${LEADERBOARD_TABLE_ID}/${existingRecord.id}`,
            {
              method: "PATCH",
              headers,
              body: JSON.stringify({
                fields: { score },
              }),
            }
          );

          if (!updateResponse.ok) {
            const errData = await updateResponse.json();
            return res.status(updateResponse.status).json(errData);
          }
        }
      } else {
        const createResponse = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${LEADERBOARD_TABLE_ID}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              records: [
                {
                  fields: {
                    name: fullName,
                    email: playerEmail,
                    score,
                  },
                },
              ],
            }),
          }
        );

        if (!createResponse.ok) {
          const errData = await createResponse.json();
          return res.status(createResponse.status).json(errData);
        }
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error submitting score to Airtable:", error);
      return res.status(500).json({ error: "Failed to submit score" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
