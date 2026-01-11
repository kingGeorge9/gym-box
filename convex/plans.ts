
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Legacy plans file - keeping for backward compatibility
 * New code should use planGeneration.ts and planManagement.ts
 */

export const getActivePlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const plan = await ctx.db
      .query("plans")
      .withIndex("by_active", (q) => q.eq("isActive", true).eq("userId", args.userId))
      .first();

    return plan;
  },
});

export const getUserPlans = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("plans")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return plans;
  },
});
