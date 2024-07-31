import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    console.log("session", session);

    if (session) {
      return NextResponse.json(
        {
          message: "This is a protected route. You are signed in.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "You must be signed in to access this route.",
      },
      { status: 401 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
};

export { GET };
