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
  day: {
    type: String,
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
  isUsed: {
    type: Boolean,
    required: true,
  },
  roomtype: {
    type: String,
    required: true,
  },
});

roomSchema.index({ userId: 1, name: 1, day: 1, period: 1 }, { unique: true });

export default mongoose.models.RoomCombination ||
  mongoose.model("RoomCombination", roomSchema);
