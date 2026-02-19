const AIRTABLE_BASE_ID = "app8MiB9XxERjKDqC";
const FAQ_TABLE_NAME = "FAQ";

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
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${FAQ_TABLE_NAME}`,
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

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Airtable FAQ:", error);
    return res.status(500).json({ error: "Failed to fetch FAQ" });
  }
}
