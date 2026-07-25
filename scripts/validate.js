#!/usr/bin/env node
/**
 * Validates every businesslibrary/**\/*.yaml record:
 *  - required fields are present (name, slug, spec.description)
 *  - slug matches filename
 *  - slug is unique across the whole library
 *  - spec.industry.type references an existing business-types/*.yaml slug
 *  - spec.relationships.parent / children / acquisitions reference known
 *    slugs (warning only -- the referenced record may not be added yet)
 *
 * Exit code 1 on any error, so this can be used as a CI check on PRs.
 */
const path = require("path");
const { loadBusinesses, loadBusinessTypes } = require("../lib/loadBusinesses");

function main() {
  const businesses = loadBusinesses();
  const types = loadBusinessTypes();
  const validTypeSlugs = new Set(types.map((t) => t.slug));
  const knownSlugs = new Set(businesses.map((b) => b.slug).filter(Boolean));

  const errors = [];
  const warnings = [];
  const slugsSeen = new Map();

  for (const b of businesses) {
    const source = b._source;

    if (!b.name) errors.push(`${source}: missing required field "name"`);
    if (!b.slug) errors.push(`${source}: missing required field "slug"`);
    if (!b.spec || !b.spec.description) {
      errors.push(`${source}: missing required field "spec.description"`);
    }
    if (!b.spec || !b.spec.industry || !b.spec.industry.sector) {
      errors.push(`${source}: missing required field "spec.industry.sector"`);
    }
    if (!b.spec || !b.spec.industry || !b.spec.industry.type) {
      errors.push(`${source}: missing required field "spec.industry.type"`);
    }

    if (b.slug) {
      const filenameSlug = path.basename(source, path.extname(source));
      if (b.slug !== filenameSlug) {
        errors.push(
          `${source}: slug "${b.slug}" does not match filename "${filenameSlug}"`
        );
      }
      if (slugsSeen.has(b.slug)) {
        errors.push(
          `${source}: duplicate slug "${b.slug}" (also used by ${slugsSeen.get(
            b.slug
          )})`
        );
      } else {
        slugsSeen.set(b.slug, source);
      }
    }

    const industryType = b.spec && b.spec.industry && b.spec.industry.type;
    if (industryType && !validTypeSlugs.has(industryType)) {
      errors.push(
        `${source}: spec.industry.type "${industryType}" does not match any file in business-types/`
      );
    }

    const rel = (b.spec && b.spec.relationships) || {};
    const refs = [
      ...(rel.parent ? [rel.parent] : []),
      ...(Array.isArray(rel.children) ? rel.children : []),
      ...(Array.isArray(rel.acquisitions) ? rel.acquisitions : []),
    ];
    for (const ref of refs) {
      if (!knownSlugs.has(ref)) {
        warnings.push(
          `${source}: spec.relationships references "${ref}", which has no matching record yet`
        );
      }
    }
  }

  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):\n`);
    warnings.forEach((w) => console.warn(" - " + w));
  }

  if (errors.length) {
    console.error(`\nFound ${errors.length} problem(s):\n`);
    errors.forEach((e) => console.error(" - " + e));
    process.exit(1);
  }

  console.log(
    `\nOK: validated ${businesses.length} business record(s), ${types.length} type(s).`
  );
}

main();
