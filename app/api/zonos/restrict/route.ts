import { NextRequest, NextResponse } from "next/server";
import { getZonosToken, isPlaceholderToken } from "@/lib/zonos-token";

const ZONOS_API_URL =
  process.env.ZONOS_API_URL || "https://api.zonos.com/graphql";

const RESTRICTION_MUTATION = `
mutation RestrictionApply($input: RestrictionApplyInput!) {
  restrictionApply(input: $input) {
    items {
      restrictions {
        confidence
        hsCode
        id
        imposingCountryCode
        measureDirection
        summary
      }
    }
  }
}
`;

const MOCK_RESPONSE = {
  data: {
    restrictionApply: {
      items: [
        {
          restrictions: [
            {
              confidence: 0.95,
              hsCode: "8542.31",
              imposingCountryCode: "US",
              id: "demo-restriction-1",
              measureDirection: "IMPORT",
              summary:
                "Subject to Export Administration Regulations (EAR). Dual-use electronic components require validated end-user certification. Commerce Control List (CCL) Category 3.",
            },
            {
              confidence: 0.82,
              hsCode: "8542.31",
              imposingCountryCode: "EU",
              id: "demo-restriction-2",
              measureDirection: "IMPORT",
              summary:
                "EU Dual-Use Regulation (EU 2021/821). Authorization required for export to certain destinations. Check Annex I for specific control parameters.",
            },
          ],
        },
      ],
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

    const response = await fetch(ZONOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentialToken: token!,
      },
      body: JSON.stringify({
        query: RESTRICTION_MUTATION,
        variables: body,
      }),
    });

    const data = await response.json();

    // GraphQL errors come back as 200 with errors array
    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0]?.message || "GraphQL error", details: data.errors },
        { status: 400 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Zonos API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to check restrictions: ${message}` },
      { status: 500 }
    );
  }
}
