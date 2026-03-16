import { NextRequest, NextResponse } from "next/server";
import { getZonosToken, isPlaceholderToken } from "@/lib/zonos-token";

const ZONOS_API_URL =
  process.env.ZONOS_API_URL || "https://api.zonos.com/graphql";

const LANDED_COST_MUTATION = `
mutation CollectQuote(
  $parties: [PartyCreateWorkflowInput!]!
  $items: [ItemCreateWorkflowInput!]!
  $shipmentRating: ShipmentRatingCreateWorkflowInput!
  $landedCost: LandedCostWorkFlowInput!
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
    duties {
      amount
      currency
      description
      note
      type
      formula
      item {
        productId
      }
    }
    fees {
      amount
      currency
      description
      formula
      note
      type
    }
    taxes {
      amount
      currency
      description
      note
      type
      formula
      item {
        productId
      }
    }
    amountSubtotals {
      shipping
      fees
      discounts
      duties
      items
      landedCostTotal
      taxes
    }
  }
}
`;

const MOCK_RESPONSE = {
  data: {
    landedCostCalculateWorkflow: {
      id: "demo-lc",
      landedCostGuaranteeCode: "ZONOS_DEMO",
      duties: [
        { amount: 18.00, currency: "GBP", description: "Import duty", note: "MFN rate", type: "ITEM", formula: "12% of customs value", item: { productId: "demo-item-1" } },
        { amount: 4.50, currency: "GBP", description: "Additional duty", note: "Textile surcharge", type: "ITEM", formula: "3% of customs value", item: { productId: "demo-item-1" } },
      ],
      fees: [
        { amount: 8.75, currency: "GBP", description: "Customs processing fee", formula: "Flat fee", note: "Standard clearance", type: "PROCESSING" },
      ],
      taxes: [
        { amount: 30.00, currency: "GBP", description: "Value Added Tax (VAT)", note: "Standard rate", type: "ITEM", formula: "20% of (CIF + duty)", item: { productId: "demo-item-1" } },
      ],
      amountSubtotals: {
        shipping: 5.99,
        fees: 8.75,
        discounts: 0,
        duties: 22.50,
        items: 149.99,
        landedCostTotal: 217.23,
        taxes: 30.00,
      },
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

    const response = await fetch(ZONOS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        credentialToken: token!,
      },
      body: JSON.stringify({
        query: LANDED_COST_MUTATION,
        variables: {
          parties,
          items,
          shipmentRating: {
            ...shipmentRating,
            serviceLevelCode: "postal_deminimis_us",
          },
          landedCost,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Zonos landed-cost error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: `Zonos API error: ${response.status}`, details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to calculate landed cost: ${message}` },
      { status: 500 }
    );
  }
}
