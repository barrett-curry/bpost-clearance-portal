import { NextRequest, NextResponse } from "next/server";
import { getZonosToken, isPlaceholderToken } from "@/lib/zonos-token";

const ZONOS_API_URL =
  process.env.ZONOS_API_URL || "https://api.zonos.com/graphql";

const CLASSIFY_MUTATION = `
mutation ClassificationsCalculate($inputs: [ClassificationCalculateInput!]!) {
  classificationsCalculate(input: $inputs) {
    id
    confidenceScore
    customsDescription
    hsCode {
      code
      description {
        friendly
      }
      fragments {
        code
        description
      }
    }
    configuration {
      shipToCountry
    }
    alternates {
      subheadingAlternate {
        code
        fragments {
          code
          description
        }
      }
      probabilityMass
      tariffAlternates {
        code
      }
    }
  }
}
`;

const MOCK_RESPONSE = {
  data: {
    classificationsCalculate: [
      {
        id: "demo-classification",
        confidenceScore: 94.2,
        customsDescription: "Cotton knitted t-shirt for children, casual wear",
        hsCode: {
          code: "6109.10",
          description: {
            friendly: "T-shirts, singlets and other vests, knitted or crocheted, of cotton",
          },
          fragments: [
            { code: "61", description: "Articles of apparel and clothing accessories, knitted or crocheted" },
            { code: "6109", description: "T-shirts, singlets and other vests, knitted or crocheted" },
            { code: "6109.10", description: "Of cotton" },
          ],
        },
        configuration: {
          shipToCountry: "US",
        },
        alternates: [
          {
            subheadingAlternate: {
              code: "6109.90",
              fragments: [
                { code: "6109.90", description: "Of other textile materials" },
              ],
            },
            probabilityMass: 0.12,
            tariffAlternates: [{ code: "6109.90.1067" }],
          },
          {
            subheadingAlternate: {
              code: "6110.20",
              fragments: [
                { code: "6110.20", description: "Of cotton (pullovers, cardigans)" },
              ],
            },
            probabilityMass: 0.08,
            tariffAlternates: [{ code: "6110.20.2079" }],
          },
        ],
      },
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await getZonosToken();

    if (isPlaceholderToken(token)) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    const { name, categories, shipToCountry } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const inputs = [
      {
        name,
        ...(categories ? { categories } : {}),
        configuration: {
          shipToCountries: shipToCountry || "US",
        },
      },
    ];

    const response = await fetch(ZONOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentialToken: token!,
      },
      body: JSON.stringify({
        query: CLASSIFY_MUTATION,
        variables: { inputs },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0]?.message || "GraphQL error", details: data.errors },
        { status: 400 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Zonos API error: ${response.status} ${response.statusText}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to classify item: ${message}` },
      { status: 500 }
    );
  }
}
