# businesslibrary

Community-contributed business records, organized by location:

```
businesslibrary/
  <Region>/
    <Province>/
      <Municipality>/
        <business-slug>.yaml
```

For example:

```
businesslibrary/NCR/Metro-Manila/Taguig/globe-telecom.yaml
```

The folder path is the fallback source of truth for `spec.location.region`,
`province`, and `municipality` if those keys are omitted inside the file --
but an explicit value inside `spec.location` always wins, so you can be
precise (e.g. spelling out "National Capital Region" instead of the folder's
short "NCR").

## Record schema

```yaml
---
name: Globe Telecom                     # required
slug: globe-telecom                     # required, unique, kebab-case, matches filename
spec:
  description: >                        # required
    One or two sentence description of what the business does.
  headquarters: The Globe Tower, BGC, Taguig, Metro Manila   # optional
  founded: 1928                         # optional, year
  specialties:                          # optional, free-form list
    - Mobile network services
    - Enterprise connectivity
  location:
    country: Philippines                # optional, defaults to Philippines
    region: National Capital Region      # optional, falls back to folder name
    province: Metro Manila               # optional, falls back to folder name
    municipality: Taguig                 # optional, falls back to folder name
    address: Bonifacio Global City       # optional, street-level address
    coordinates:                         # optional
      latitude: 14.5547
      longitude: 121.0244
  contacts:                             # optional
    website: https://www.globe.com.ph
    email: hello@example.com
    phone: "+63-2-7730-1000"
  social:                                # optional
    linkedin: https://www.linkedin.com/company/globetelecom
    facebook: https://www.facebook.com/globeph
    twitter: https://twitter.com/globeph
    instagram: https://www.instagram.com/globeph
  industry:
    sector: Telecommunications           # required, human-readable label
    type: telecommunications             # required, must match a slug in /business-types
  employees:
    size: 8000                           # optional, integer headcount
  tags:                                  # optional, free-form
    - telecom
    - connectivity
  relationships:                        # optional
    parent: ayala-corporation            # slug of a parent company, if any
    children:                            # slugs of subsidiaries/branches
      - globe-business
      - gcash
    acquisitions:                        # slugs (or free text) of companies acquired
      - bayan-telecommunications
  comments: >                            # optional, sources / notes, links welcome
    Source: https://www.globe.com.ph/about
```

Only `name`, `slug`, `spec.description`, `spec.industry.sector`, and
`spec.industry.type` are strictly required. Everything else is optional --
add what you know, leave the rest out.

`relationships.parent` / `children` / `acquisitions` reference other
records by `slug`. It's fine to reference a slug that doesn't have its own
file yet (`npm run validate` will print a warning, not an error) -- add the
missing record in a follow-up PR.

## Contributing

1. Fork the repo.
2. Add or edit a single YAML file under the correct
   `Region/Province/Municipality` path (create folders if they don't exist).
3. Run `npm run validate` locally to make sure your file parses and has
   all required fields.
4. Open a pull request. One business per file, one file per PR is preferred
   to keep review simple -- exactly like devicetype-library.
