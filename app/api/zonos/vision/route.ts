import { NextRequest, NextResponse } from "next/server";
import { getZonosToken, isPlaceholderToken } from "@/lib/zonos-token";

const ZONOS_API_URL =
  process.env.ZONOS_API_URL || "https://api.zonos.com/graphql";

const VISION_MUTATION = `
mutation ItemsExtract($input: ItemsExtractInput!) {
  itemsExtract(input: $input) {
    classification {
      auditTrail
      categories
      confidenceScore
      countryOfOrigin
      customsDescription
      hsCode {
        code
        description {
          friendly
          full
        }
      }
      name
    }
    countryOfOriginInference {
      confidenceScore
      countryOfOrigin
      description
    }
    valueEstimation {
      currency
      description
      name
      value
      valueEstimateRange {
        low
        high
        width
      }
    }
  }
}
`;

const MOCK_RESPONSE = {
  data: {
    itemsExtract: {
      classification: {
        confidenceScore: 91.5,
        hsCode: {
          code: "6109.10.00",
          description: {
            friendly: "T-shirts, singlets and other vests, knitted or crocheted, of cotton",
            full: "T-shirts, singlets and other vests, knitted or crocheted, of cotton",
          },
        },
        categories: ["Apparel", "T-Shirts", "Cotton"],
        customsDescription: "Cotton knitted t-shirt for casual wear",
        countryOfOrigin: "CN",
        name: "Cotton T-Shirt",
        auditTrail:
          "Product identified as cotton t-shirt from image analysis. HS heading 61.09 covers T-shirts and vests, knitted or crocheted. Subheading .10 specifies cotton.",
      },
      countryOfOriginInference: {
        confidenceScore: 87.5,
        countryOfOrigin: "CN",
        description: "Based on product category and common manufacturing patterns",
      },
      valueEstimation: {
        currency: "USD",
        name: "Cotton T-Shirt",
        value: 24.99,
        description: "Estimated retail value based on product category",
        valueEstimateRange: { low: 15.0, high: 45.0, width: 30.0 },
      },
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await getZonosToken();

    if (isPlaceholderToken(token)) {
      return NextResponse.json(MOCK_RESPONSE);
    }

    if (!body.imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    const input = {
      configuration: {
        classify: "ENABLED",
        estimateValue: "ENABLED",
        inferCountryOfOrigin: "ENABLED",
      },
      imageBase64: body.imageBase64,
    };

    const response = await fetch(ZONOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentialToken: token!,
      },
      body: JSON.stringify({
        query: VISION_MUTATION,
        variables: { input },
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
      { error: `Failed to analyze image: ${message}` },
      { status: 500 }
    );
  }
}
