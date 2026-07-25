# business-types

This directory defines the controlled vocabulary of business **types**
(industry categories) that records in `/businesslibrary` may reference via
their `type` field.

Each file is a single YAML document:

```yaml
---
slug: technology          # required, unique, kebab-case, must match filename
name: Technology           # required, human-readable label
description: >             # required, short paragraph
  ...
suggested_tags:            # optional, free-form tag suggestions for this type
  - software
  - hardware
```

To add a new type:

1. Create `business-types/<slug>.yaml`.
2. `slug` must be unique and match the filename (without extension).
3. Open a pull request. CI (`npm run validate`) checks that every `type`
   referenced by a business record in `/businesslibrary` exists here.
