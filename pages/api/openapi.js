export default function handler(req, res) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const baseUrl = `${proto}://${host}`;

  const spec = {
    openapi: "3.0.3",
    info: {
      title: "BusinessFinder API",
      description:
        "A community-contributed business directory, organized by region / province / municipality, in the spirit of the NetBox Device Type Library.",
      version: "1.1.0",
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/api/businesses": {
        get: {
          summary: "Search / list businesses",
          parameters: [
            { name: "q", in: "query", schema: { type: "string" }, description: "Free-text search across name and spec.description" },
            { name: "sector", in: "query", schema: { type: "string" }, description: "Filter by spec.industry.sector" },
            { name: "type", in: "query", schema: { type: "string" }, description: "Filter by spec.industry.type (business-types slug)" },
            { name: "region", in: "query", schema: { type: "string" } },
            { name: "province", in: "query", schema: { type: "string" } },
            { name: "municipality", in: "query", schema: { type: "string" } },
            { name: "tag", in: "query", schema: { type: "string" } },
            { name: "parent", in: "query", schema: { type: "string" }, description: "Filter for children/branches of a given parent slug" },
          ],
          responses: {
            200: {
              description: "A list of matching businesses",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      count: { type: "integer" },
                      results: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Business" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/businesses/{slug}": {
        get: {
          summary: "Get a single business by slug",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "The business record",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Business" },
                },
              },
            },
            404: { description: "Business not found" },
          },
        },
      },
      "/api/industries": {
        get: {
          summary: "List all business types (industries)",
          responses: {
            200: {
              description: "A list of business types with business counts",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      count: { type: "integer" },
                      results: {
                        type: "array",
                        items: { $ref: "#/components/schemas/BusinessType" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Coordinates: {
          type: "object",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" },
          },
        },
        Location: {
          type: "object",
          properties: {
            country: { type: "string" },
            region: { type: "string" },
            province: { type: "string" },
            municipality: { type: "string" },
            address: { type: "string" },
            coordinates: { $ref: "#/components/schemas/Coordinates" },
          },
        },
        Contacts: {
          type: "object",
          properties: {
            website: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
          },
        },
        Social: {
          type: "object",
          properties: {
            linkedin: { type: "string" },
            facebook: { type: "string" },
            twitter: { type: "string" },
            instagram: { type: "string" },
          },
        },
        Industry: {
          type: "object",
          properties: {
            sector: { type: "string" },
            type: { type: "string" },
          },
        },
        Employees: {
          type: "object",
          properties: {
            size: { type: "integer" },
          },
        },
        Relationships: {
          type: "object",
          properties: {
            parent: { type: "string", nullable: true },
            children: { type: "array", items: { type: "string" } },
            acquisitions: { type: "array", items: { type: "string" } },
          },
        },
        BusinessSpec: {
          type: "object",
          properties: {
            description: { type: "string" },
            headquarters: { type: "string" },
            founded: { type: "integer" },
            specialties: { type: "array", items: { type: "string" } },
            location: { $ref: "#/components/schemas/Location" },
            contacts: { $ref: "#/components/schemas/Contacts" },
            social: { $ref: "#/components/schemas/Social" },
            industry: { $ref: "#/components/schemas/Industry" },
            employees: { $ref: "#/components/schemas/Employees" },
            tags: { type: "array", items: { type: "string" } },
            relationships: { $ref: "#/components/schemas/Relationships" },
            comments: { type: "string" },
          },
        },
        Business: {
          type: "object",
          properties: {
            name: { type: "string" },
            slug: { type: "string" },
            spec: { $ref: "#/components/schemas/BusinessSpec" },
          },
        },
        BusinessType: {
          type: "object",
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            suggested_tags: { type: "array", items: { type: "string" } },
            business_count: { type: "integer" },
          },
        },
      },
    },
  };

  res.status(200).json(spec);
}
