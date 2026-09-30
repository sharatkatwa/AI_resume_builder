import { connectDB } from "@/lib/mongoDB";
import { LoginBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { generateJWT } from "@/lib/jwt";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body: LoginBody = await req.json();

    const { email, password } = body;
    if (!email || !password)
      return NextResponse.json<ApiResponse>(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User no exists" },
        { status: 404 },
      );
    }
    const comparePass = await user.comparePassword(password);
    if(!comparePass){
          return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid credentials" },
        { status: 400 },
      );
    }
    const token = generateJWT({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Login successful",
        data: { name: user.name, email: user.email },
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
        message: "Internal server error",
        error: {
          message: error instanceof Error ? error.message : String(error),
        },
      },
      { status: 500 },
    );
  }
}
