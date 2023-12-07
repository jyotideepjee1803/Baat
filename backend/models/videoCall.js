import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const videoCallSchema = new mongoose.Schema({
    participants: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    from: {
      type: ObjectId,
      ref: "User",
    },
    to: {
      type: ObjectId,
      ref: "User",
    },
    verdict: {
      type: String,
      enum: ["Accepted", "Denied", "Missed", "Busy"],
    },
    status: {
      type: String,
      enum: ["Ongoing", "Ended"],
    },
    startedAt: {
      type: Date,
      default: Date.now(),
    },
    endedAt: {
      type: Date,
    },
  });

export default mongoose.model("VideoCall", videoCallSchema);
