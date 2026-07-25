const { loadBusinesses } = require("../../../lib/loadBusinesses");

function matches(value, query) {
  return (value || "").toLowerCase() === String(query).toLowerCase();
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    q,
    sector,
    type,
    region,
    province,
    municipality,
    tag,
    parent,
  } = req.query;

  let businesses = loadBusinesses();

  if (q) {
    const needle = String(q).toLowerCase();
    businesses = businesses.filter(
      (b) =>
        (b.name && b.name.toLowerCase().includes(needle)) ||
        (b.spec.description && b.spec.description.toLowerCase().includes(needle))
    );
  }
  if (sector) {
    businesses = businesses.filter((b) =>
      matches(b.spec.industry && b.spec.industry.sector, sector)
    );
  }
  if (type) {
    businesses = businesses.filter(
      (b) => b.spec.industry && b.spec.industry.type === type
    );
  }
  if (region) {
    businesses = businesses.filter((b) =>
      matches(b.spec.location && b.spec.location.region, region)
    );
  }
  if (province) {
    businesses = businesses.filter((b) =>
      matches(b.spec.location && b.spec.location.province, province)
    );
  }
  if (municipality) {
    businesses = businesses.filter((b) =>
      matches(b.spec.location && b.spec.location.municipality, municipality)
    );
  }
  if (tag) {
    businesses = businesses.filter(
      (b) => Array.isArray(b.spec.tags) && b.spec.tags.includes(tag)
    );
  }
  if (parent) {
    businesses = businesses.filter(
      (b) => b.spec.relationships && b.spec.relationships.parent === parent
    );
  }

  res.status(200).json({
    count: businesses.length,
    results: businesses,
  });
}
