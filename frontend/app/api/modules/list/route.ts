import { request, gql } from "graphql-request";
import { NextRequest, NextResponse } from "next/server";
import { ModuleRegistereds } from "@/types";

const SUBGRAPH_URL =
  "https://api.studio.thegraph.com/query/68882/fuzion/version/latest";

const GET = async (req: NextRequest) => {
  try {
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
      moduleRegistereds(
        first: ${limitNum}
        orderBy: blockTimestamp
        orderDirection: desc
        skip: ${pageNum * limitNum}
      ) {
        id
        module
        moduleType
        name
        blockTimestamp
      }
    }
  `;

    const response = await request<ModuleRegistereds>(SUBGRAPH_URL, query);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
};

export { GET };
