import mongoose, { Schema, model, models } from "mongoose";

const BadgeSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  earnedAt: { type: String },
}); 

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
    },

    displayName: {
      type: String,
      default: "CyberAgent",
    },

    avatar: {
      type: String,
      default: "shield",
    },

    // 🎮 Gamification
    odisityPoints: {
      type: Number,
      default: 0,
    },

    completedChallenges: {
      type: [String],
      default: [],
    },

    challengeScores: {
      type: Map,
      of: Number,
      default: {},
    },

    streak: {
      type: Number,
      default: 0,
    },

    badges: {
      type: [BadgeSchema],
      default: [],
    },

    rank: {
      type: String,
      default: "Script Kiddie",
    },

    joinedAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
