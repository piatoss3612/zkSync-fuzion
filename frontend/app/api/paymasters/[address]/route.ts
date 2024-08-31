import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { request, gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { PaymasterCreateds } from "@/types";

const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/68882/fuzion/version/latest";

const GET = async (
  req: Request,
  { params }: { params: { address: string } }
) => {
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

    if (!params.address) {
      return NextResponse.json(
        {
          message: "Paymaster address not found.",
        },
        { status: 400 }
      );
    }

    const query = gql`
    {
      paymasterCreateds(
        where: {owner: "${userAddress}", paymaster: "${params.address}"}
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
    if (response.paymasterCreateds.length === 0) {
      return NextResponse.json(
        {
          message: "Paymaster not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(response.paymasterCreateds[0], { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
};

export { GET };
