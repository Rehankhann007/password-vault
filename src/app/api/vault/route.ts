import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import VaultItem from "@/app/models/vaultItem";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json([], { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET as string);

    await connectToDatabase();
    const items = await VaultItem.find({});
    return NextResponse.json(items); // JSON array hi return hona chahiye
  } catch (err: unknown) {
    console.error("Vault GET error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET as string);

    const body = await req.json();
    const { title, username, password, url, notes } = body;

    await connectToDatabase();
    const item = await VaultItem.create({ title, username, password, url, notes, userId: "dummy" }); 
    // TODO: Replace "dummy" with actual userId from token payload
    return NextResponse.json(item);
  } catch (err: unknown) {
    console.error("Vault POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, process.env.JWT_SECRET as string);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectToDatabase();
    await VaultItem.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (err: unknown) {
    console.error("Vault DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
