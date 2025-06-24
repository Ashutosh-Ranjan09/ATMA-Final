import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

departmentSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.models.department || mongoose.model("department", departmentSchema);
