const { loadBusinessTypes, loadBusinesses } = require("../../lib/loadBusinesses");

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const types = loadBusinessTypes();
  const businesses = loadBusinesses();

  const withCounts = types.map((t) => ({
    ...t,
    business_count: businesses.filter(
      (b) => b.spec.industry && b.spec.industry.type === t.slug
    ).length,
  }));

  res.status(200).json({
    count: withCounts.length,
    results: withCounts,
  });
}
