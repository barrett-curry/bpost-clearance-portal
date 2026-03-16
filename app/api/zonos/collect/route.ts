import { NextRequest, NextResponse } from "next/server";
import { getZonosToken, isPlaceholderToken } from "@/lib/zonos-token";

const ZONOS_API_URL =
  process.env.ZONOS_API_URL || "https://api.zonos.com/graphql";

const COLLECT_MUTATION = `
mutation CollectQuote(
  $parties: [PartyCreateWorkflowInput!]!
  $items: [ItemCreateWorkflowInput!]!
  $shipmentRating: ShipmentRatingCreateWorkflowInput!
  $landedCost: LandedCostCalculateWorkflowInput!
) {
  partyCreateWorkflow(input: $parties) {
    type
    id
    organization
  }
  itemCreateWorkflow(input: $items) {
    id
    amount
    quantity
    description
  }
  cartonizeWorkflow {
    id
  }
  shipmentRatingCreateWorkflow(input: $shipmentRating) {
    id
    amount
  }
  landedCostCalculateWorkflow(input: $landedCost) {
    id
    landedCostGuaranteeCode
    links {
      key
      url
    }
    amountSubtotals {
      duties
      fees
      taxes
      landedCostTotal
    }
    fees {
      amount
      currency
      type
      item {
        productId
      }
    }
  }
}
`;

const MOCK_RESPONSE = {
  data: {
    landedCostCalculateWorkflow: {
      id: "demo-lc",
      landedCostGuaranteeCode: "ZONOS_DEMO",
      amountSubtotals: {
        duties: 22.5,
        fees: 8.75,
        taxes: 30.0,
        landedCostTotal: 61.25,
      },
      fees: [
        { amount: 22.5, currency: "GBP", type: "DUTY" },
        { amount: 30.0, currency: "GBP", type: "TAX" },
        { amount: 8.75, currency: "GBP", type: "FEE" },
      ],
      links: [{ key: "CHECKOUT", url: "https://checkout.zonos.com/demo" }],
    },
    partyCreateWorkflow: [
      { type: "ORIGIN", id: "demo-origin" },
      { type: "DESTINATION", id: "demo-dest" },
    ],
    itemCreateWorkflow: [
      { id: "demo-item", amount: 149.99, quantity: 2, description: "Demo Item" },
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

    const { parties, items, shipmentRating, landedCost } = body;

    const variables: Record<string, unknown> = {
      parties,
      items,
      shipmentRating,
      landedCost: {
        ...landedCost,
        quoteType: landedCost?.quoteType || "COLLECT",
      },
    };

    const response = await fetch(ZONOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentialToken: token!,
      },
      body: JSON.stringify({
        query: COLLECT_MUTATION,
        variables,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Zonos API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create collect quote: ${message}` },
      { status: 500 }
    );
  }
}
