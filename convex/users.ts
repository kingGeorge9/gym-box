import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    userId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", args);
  },
});

export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    userId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!existingUser) return;

    return await ctx.db.patch(existingUser._id, args);
  },
});

// Create or update user profile
export const upsertUserProfile = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    age: v.number(),
    gender: v.string(),
    height: v.number(),
    weight: v.number(),
    bodyFat: v.optional(v.number()),
    fitnessLevel: v.string(),
    primaryGoal: v.string(),
    additionalGoals: v.array(v.string()),
    activityLevel: v.string(),
    workoutLocation: v.string(),
    availableEquipment: v.array(v.string()),
    workoutDays: v.number(),
    preferredTimePerSession: v.number(),
    injuries: v.optional(v.string()),
    workoutPreferences: v.optional(v.object({
      avoidExercises: v.array(v.string()),
      favoriteExercises: v.array(v.string()),
      intensityPreference: v.string(),
    })),
    dietaryStyle: v.string(),
    culturalPreference: v.string(),
    allergies: v.optional(v.string()),
    foodDislikes: v.optional(v.array(v.string())),
    mealsPerDay: v.number(),
    targetCalories: v.optional(v.number()),
    healthConditions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        ...args,
        updatedAt: now,
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Get user profile
export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get user data (name, email, etc.)
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
  },
});