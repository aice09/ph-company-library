# BusinessFinder Library

A Vercel-ready business directory inspired by the [NetBox Device Type
Library](https://github.com/netbox-community/devicetype-library) pattern:
community-contributed records live in a versioned, human-readable YAML
library and are exposed through a website plus a documented, Swagger-enabled
API.

## How it maps to devicetype-library

| devicetype-library                          | BusinessFinder                                              |
|----------------------------------------------|--------------------------------------------------------------|
| `device-types/<Manufacturer>/*.yaml`          | `business-types/*.yaml` — controlled vocabulary of industries |
| `elevation-images/<Manufacturer>/`            | *(not used — no images needed for business records)*          |
| one YAML file per device model                | `businesslibrary/<Region>/<Province>/<Municipality>/*.yaml` — one YAML file per business |

## Directory structure

```
business-types/                     # controlled vocabulary of industries
  technology.yaml
  manufacturing.yaml
  retail.yaml

businesslibrary/                    # the actual business records
  NCR/
    Metro-Manila/
      Manila/
        acme-technologies.yaml
      Quezon-City/
        qc-manufacturing-co.yaml
  CALABARZON/
    Cavite/
      Imus/
        imus-retail-group.yaml
```

See `business-types/README.md` and `businesslibrary/README.md` for the full
schema and contribution rules for each.

## Features

- Searchable business catalog landing page (`/`).
- YAML-backed business records, read straight from `/businesslibrary` — no
  separate build/compile step needed, so a merged PR is live immediately.
- API routes for business search, business detail, and industries.
- Full OpenAPI 3.0 spec at `/api/openapi`, rendered with Swagger UI at `/docs`.
- `npm run validate` — schema + referential-integrity checker, wired up as a
  GitHub Actions check on every PR that touches `businesslibrary/` or
  `business-types/`.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000> for the website or <http://localhost:3000/docs>
for Swagger UI.

## API endpoints

- `GET /api/businesses?q=&sector=&type=&region=&province=&municipality=&tag=&parent=`
- `GET /api/businesses/{slug}`
- `GET /api/industries`
- `GET /api/openapi`

Each business record is nested under a `spec:` block -- description,
headquarters, founded year, specialties, location (with lat/lng), contacts,
social links, industry (sector + type), employee count, tags, and
parent/child/acquisition relationships. See `businesslibrary/README.md` for
the full field-by-field schema.

## Contributing a business

1. Fork the repo.
2. Add `businesslibrary/<Region>/<Province>/<Municipality>/<your-business-slug>.yaml`
   (create the folders if they don't exist yet).
3. Make sure `spec.industry.type` matches one of the slugs in
   `business-types/`. Propose a new type there first if the right one
   doesn't exist.
4. `npm run validate`
5. Open a pull request — one business per file/PR, same as devicetype-library.

## Deploy to Vercel

Import this repository in Vercel. The default Next.js build command
(`next build`) and output handling work out of the box — no extra
configuration needed.
