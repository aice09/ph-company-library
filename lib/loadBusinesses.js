const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const LIBRARY_ROOT = path.join(process.cwd(), "businesslibrary");
const TYPES_ROOT = path.join(process.cwd(), "business-types");

/**
 * Recursively walk a directory, returning absolute paths of all *.yaml / *.yml files.
 */
function walkYamlFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkYamlFiles(fullPath));
    } else if (/\.ya?ml$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Load every business-types/*.yaml file into an array of type definitions.
 */
function loadBusinessTypes() {
  const files = fs
    .readdirSync(TYPES_ROOT)
    .filter((f) => /\.ya?ml$/i.test(f));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(TYPES_ROOT, file), "utf8");
    const doc = yaml.load(raw) || {};
    return doc;
  });
}

/**
 * Load every businesslibrary/**\/*.yaml file into an array of business records.
 *
 * Each record has the shape:
 *   { name, slug, spec: { description, headquarters, founded, specialties,
 *     location, contacts, social, industry, employees, tags,
 *     relationships, comments }, _source }
 *
 * region / province / municipality are derived from the folder path
 * (relative to businesslibrary/) as a fallback if `spec.location` doesn't
 * already set them -- the folder path is the source of truth for filing,
 * but an explicit spec.location value in the YAML wins.
 */
function loadBusinesses() {
  const files = walkYamlFiles(LIBRARY_ROOT);

  const businesses = files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const doc = yaml.load(raw) || {};

    const relative = path.relative(LIBRARY_ROOT, filePath);
    const parts = relative.split(path.sep); // [region, province, municipality, file.yaml]
    const [folderRegion, folderProvince, folderMunicipality] = parts;

    const spec = doc.spec || {};
    const location = spec.location || {};

    return {
      name: doc.name,
      slug: doc.slug,
      spec: {
        ...spec,
        location: {
          country: location.country || "Philippines",
          region: location.region || folderRegion,
          province: location.province || folderProvince,
          municipality: location.municipality || folderMunicipality,
          address: location.address,
          coordinates: location.coordinates,
        },
      },
      _source: relative.replace(/\\/g, "/"),
    };
  });

  // Basic sanity: warn (don't throw) on duplicate slugs at build/runtime.
  const seen = new Set();
  for (const b of businesses) {
    if (b.slug) {
      if (seen.has(b.slug)) {
        console.warn(`[businessfinder] Duplicate slug detected: ${b.slug}`);
      }
      seen.add(b.slug);
    }
  }

  return businesses;
}

module.exports = { loadBusinesses, loadBusinessTypes, walkYamlFiles };
