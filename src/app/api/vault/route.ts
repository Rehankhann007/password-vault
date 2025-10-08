import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import VaultItem from "@/app/models/vaultItem";
import jwt from "jsonwebtoken";

function getTokenFromReq(req: Request) {
  return req.headers.get("authorization")?.split(" ")[1] ?? null;
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json([], { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    await connectToDatabase();
    const items = await VaultItem.find({ userId });
    return NextResponse.json(items);
  } catch (err: unknown) {
    console.error("Vault GET error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const body = await req.json();
    const { title, username, password, url, notes } = body;

    await connectToDatabase();
    const item = await VaultItem.create({ title, username, password, url, notes, userId });
    return NextResponse.json(item);
  } catch (err: unknown) {
    console.error("Vault POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const body = await req.json();
    const { title, username, password, url, notes } = body;

    await connectToDatabase();
    const item = await VaultItem.findById(id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    if (item.userId.toString() !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const updated = await VaultItem.findByIdAndUpdate(id, { title, username, password, url, notes }, { new: true });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Vault PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const userId = decoded.userId;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await connectToDatabase();
    const item = await VaultItem.findById(id);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    if (item.userId.toString() !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await VaultItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err: unknown) {
    console.error("Vault DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
