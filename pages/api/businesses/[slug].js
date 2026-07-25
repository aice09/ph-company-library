const { loadBusinesses } = require("../../../lib/loadBusinesses");

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug } = req.query;
  const businesses = loadBusinesses();
  const business = businesses.find((c) => c.slug === slug);

  if (!business) {
    return res.status(404).json({ error: `Business "${slug}" not found` });
  }

  res.status(200).json(business);
}
