const AIRTABLE_BASE_ID = "app8MiB9XxERjKDqC";
const TEAM_TABLE_ID = "tblRtMfdCG6kRbsux";

export default async function handler(
  req: { method?: string },
  res: { status: (code: number) => { json: (body: unknown) => void }; setHeader: (name: string, value: string) => void }
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "AIRTABLE_API_KEY is not configured" });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TEAM_TABLE_ID}?sort%5B0%5D%5Bfield%5D=ID&sort%5B0%5D%5Bdirection%5D=asc`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Airtable team:", error);
    return res.status(500).json({ error: "Failed to fetch team" });
  }
}
