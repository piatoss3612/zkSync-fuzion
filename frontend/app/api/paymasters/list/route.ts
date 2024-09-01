import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { request, gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { PaymasterCreateds } from "@/types";

const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/68882/fuzion/v0.0.6";

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
    const limit = url.searchParams.get("limit") || "10";

    // Prepare the query
    let pageNum = parseInt(page) - 1;
    if (pageNum < 0) {
      pageNum = 0;
    }

    let limitNum = parseInt(limit);
    if (limitNum < 1) {
      limitNum = 10;
    }

    const query = gql`
    {
      paymasterCreateds(
        first: ${limitNum}
        where: {owner: "${userAddress}"}
        orderBy: blockTimestamp
        orderDirection: desc
        skip: ${pageNum * limitNum}
      ) {
        id
        name
        owner
        paymaster
        blockTimestamp
      }
    }
  `;

    const response = await request<PaymasterCreateds>(SUBGRAPH_URL, query);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
};

export { GET };
