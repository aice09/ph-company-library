import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

export default function Home() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [types, setTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/industries")
      .then((r) => r.json())
      .then((data) => setTypes(data.results || []));
  }, []);

  const search = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);

    fetch(`/api/businesses?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setCount(data.count || 0);
      })
      .finally(() => setLoading(false));
  }, [q, type]);

  useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.page}>
      <Head>
        <title>BusinessFinder</title>
      </Head>

      <header style={styles.header}>
        <h1 style={styles.h1}>BusinessFinder</h1>
        <p style={styles.subtitle}>
          A community-contributed business directory, organized by region,
          province, and municipality. <a href="/docs">API docs &rarr;</a>
        </p>
      </header>

      <div style={styles.searchBar}>
        <input
          style={styles.input}
          placeholder="Search by name or description…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <select
          style={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All industries</option>
          {types.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name} ({t.business_count})
            </option>
          ))}
        </select>
        <button style={styles.button} onClick={search}>
          Search
        </button>
      </div>

      <p style={styles.count}>
        {loading ? "Searching…" : `${count} business${count === 1 ? "" : "es"} found`}
      </p>

      <div style={styles.grid}>
        {results.map((b) => {
          const spec = b.spec || {};
          const loc = spec.location || {};
          const industry = spec.industry || {};
          const employees = spec.employees || {};
          const social = spec.social || {};

          return (
            <div key={b.slug} style={styles.card}>
              <h3 style={styles.cardTitle}>{b.name}</h3>
              <p style={styles.cardMeta}>
                {[loc.municipality, loc.province].filter(Boolean).join(", ")}
                {industry.sector ? ` · ${industry.sector}` : ""}
              </p>
              <p style={styles.cardDesc}>{spec.description}</p>

              <dl style={styles.dl}>
                {spec.headquarters && (
                  <>
                    <dt style={styles.dt}>Headquarters</dt>
                    <dd style={styles.dd}>{spec.headquarters}</dd>
                  </>
                )}
                {spec.founded && (
                  <>
                    <dt style={styles.dt}>Founded</dt>
                    <dd style={styles.dd}>{spec.founded}</dd>
                  </>
                )}
                {employees.size && (
                  <>
                    <dt style={styles.dt}>Employees</dt>
                    <dd style={styles.dd}>{employees.size.toLocaleString()}</dd>
                  </>
                )}
              </dl>

              {Array.isArray(spec.specialties) && spec.specialties.length > 0 && (
                <p style={styles.tags}>
                  {spec.specialties.map((s) => (
                    <span key={s} style={styles.tagPill}>
                      {s}
                    </span>
                  ))}
                </p>
              )}

              <div style={styles.links}>
                {spec.contacts && spec.contacts.website && (
                  <a href={spec.contacts.website} target="_blank" rel="noreferrer">
                    Website
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: 960,
    margin: "0 auto",
    padding: "40px 20px",
    color: "#1a1a1a",
  },
  header: { marginBottom: 32 },
  h1: { fontSize: 32, margin: 0 },
  subtitle: { color: "#555", marginTop: 8 },
  searchBar: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  input: {
    flex: 1,
    minWidth: 220,
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
    background: "#111",
    color: "#fff",
    fontSize: 14,
    cursor: "pointer",
  },
  count: { color: "#777", fontSize: 13, marginBottom: 20 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  card: {
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    padding: 16,
  },
  cardTitle: { margin: "0 0 4px 0", fontSize: 17 },
  cardMeta: { color: "#888", fontSize: 12, margin: "0 0 8px 0" },
  cardDesc: { fontSize: 14, color: "#333", marginBottom: 10 },
  dl: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 8,
    rowGap: 2,
    fontSize: 12,
    margin: "0 0 10px 0",
  },
  dt: { color: "#999", fontWeight: 600 },
  dd: { margin: 0, color: "#333" },
  tags: { marginBottom: 10 },
  tagPill: {
    display: "inline-block",
    background: "#f2f2f2",
    borderRadius: 999,
    padding: "2px 10px",
    fontSize: 11,
    marginRight: 6,
    marginBottom: 4,
    color: "#444",
  },
  links: { display: "flex", gap: 12, fontSize: 13 },
};
