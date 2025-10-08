import mongoose from "mongoose";

const VaultItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  username: { type: String },
  password: { type: String, required: true }, // encrypted password
  url: { type: String },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.VaultItem || mongoose.model("VaultItem", VaultItemSchema);
