import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  TimeTableDep: {
    type: Array,
    required: true,
  },
});

timetableSchema.index({ userId: 1, department: 1 }, { unique: true });

export default mongoose.models.timetable ||
  mongoose.model("timetable", timetableSchema);
