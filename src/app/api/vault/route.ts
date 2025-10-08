import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import VaultItem from "@/app/models/vaultItem";
import jwt from "jsonwebtoken";

// GET: Get all vault items for logged-in user
export async function GET(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json([], { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    await connectToDatabase();
    const items = await VaultItem.find({ userId }); // fetch only user's items

    return NextResponse.json(items);
  } catch (err) {
    console.error("Vault GET error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Add a new vault item
export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    const body = await req.json();
    const { title, username, password, url, notes } = body;

    await connectToDatabase();
    const item = await VaultItem.create({
      title,
      username,
      password,
      url,
      notes,
      userId, // must include userId
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error("Vault POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: Delete a vault item
export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await connectToDatabase();
    const item = await VaultItem.findById(id);

    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    // Ensure user can only delete their own items
    if (item.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await VaultItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("Vault DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
