import { connectDB } from "@/lib/mongoDB";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { generateJWT } from "@/lib/jwt";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: RegisterBody = await req.json();

    const { name, email, password, phone } = body;
    if (!name || !email || !password)
      return NextResponse.json<ApiResponse>(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );

    const isExisted = await UserModel.findOne({ email });
    console.log(isExisted);
    if (isExisted) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Account already exists please login" },
        { status: 409 },
      );
    }
    const newUser = await UserModel.create({ name, email, password, phone });
    const token = generateJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User created successfully",
        data: { name: newUser.name, email: newUser.email },
      },
      { status: 201 },
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });
    return response;
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal serve r error",
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
