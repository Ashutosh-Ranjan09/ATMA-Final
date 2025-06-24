import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  roomtype: {
    type: String,
    required: true,
  },
});

roomSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.room || mongoose.model("room", roomSchema);
