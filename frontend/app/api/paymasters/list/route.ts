import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { request, gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { PaymasterCreated } from "@/types";

const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/68882/fuzion/version/latest";

const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    // Check if the user is signed in
    if (!session) {
      return NextResponse.json(
        {
          message: "You must be signed in to get the list of paymasters.",
        },
        { status: 401 }
      );
    }

    const userAddress = session.user?.name;
    if (!userAddress) {
      return NextResponse.json(
        {
          message: "User address not found.",
        },
        { status: 400 }
      );
    }

    // Get the url parameter
    const url = new URL(req.url);
    const page = url.searchParams.get("page") || "1";

    // Prepare the query
    let pageNum = parseInt(page) - 1;
    if (pageNum < 0) {
      pageNum = 0;
    }

    const query = `
    {
      paymasterCreateds(
        first: 10
        where: {owner: "${userAddress}"}
        orderBy: blockTimestamp
        orderDirection: desc
        skip: ${pageNum * 10}
      ) {
        id
        name
        owner
        paymaster
        paymasterFactory
        blockTimestamp
      }
    }
  `;

    const response = await request<PaymasterCreated[]>(SUBGRAPH_URL, query);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
};

export { GET };
