import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    required: true,
  },
  number_stud: {
    type: Number,
    required: true,
  },
  number_cred: {
    type: Number,
    required: true,
  },
  prof_name: {
    type: String,
  },
  department: {
    type: String,
  },
});

courseSchema.index({ userId: 1, course_name: 1 }, { unique: true });
courseSchema.index({ userId: 1, course_id: 1 }, { unique: true });

export default mongoose.models.course || mongoose.model("course", courseSchema);
