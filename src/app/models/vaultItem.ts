import mongoose, { Schema, model, models } from "mongoose";

const VaultItemSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
});

const VaultItem = models.VaultItem || model("VaultItem", VaultItemSchema);
export default VaultItem;
