// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   sender: mongoose.Schema.Types.ObjectId,
//   receiver: mongoose.Schema.Types.ObjectId,
//   message: String,
// }, { timestamps: true });

// export default mongoose.model("Message", messageSchema);


// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   sender: String,
//   receiver: String,
//   message: String,

//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: 86400 // 🔥 24 HOURS AUTO DELETE
//   }

// });

// export default mongoose.model("Message", messageSchema);

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },

  receiver: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  matchId: {
    type: String,
    required: true,
  },

  // 🔥 self-destruct field
  expiresAt: {
    type: Date,
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 TTL index ONLY on expiresAt
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Message", messageSchema);