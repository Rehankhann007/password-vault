import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import VaultItem from "@/app/models/vaultItem";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json([], { status: 401 });

    jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const items = await VaultItem.find({});
    return NextResponse.json(items); // MUST return JSON array
  } catch (err) {
    console.error("Vault GET error:", err);
    return NextResponse.json([], { status: 500 }); // Return empty array on error
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const body = await req.json();
    const newItem = new VaultItem(body);
    await newItem.save();

    return NextResponse.json(newItem);
  } catch (err) {
    console.error("Vault POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    const body = await req.json();

    const updatedItem = await VaultItem.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedItem);
  } catch (err) {
    console.error("Vault PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    jwt.verify(token, JWT_SECRET);

    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    await VaultItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vault DELETE error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
