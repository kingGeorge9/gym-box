/**
 * Migration functions for cleaning up old data
 */

import { mutation } from "./_generated/server";

/**
 * Delete all legacy plans that have the old schema structure
 * (containing dietPlan and workoutPlan fields)
 */
export const deleteLegacyPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const allPlans = await ctx.db.query("plans").collect();
    
    let deletedCount = 0;
    
    for (const plan of allPlans) {
      // Check if this is a legacy plan (has dietPlan or workoutPlan fields)
      const planData = plan as any;
      if (planData.dietPlan || planData.workoutPlan) {
        await ctx.db.delete(plan._id);
        deletedCount++;
        console.log(`Deleted legacy plan: ${plan._id}`);
      }
    }
    
    return { 
      success: true, 
      deletedCount,
      message: `Deleted ${deletedCount} legacy plan(s)` 
    };
  },
});

/**
 * Delete all plans (use with caution!)
 */
export const deleteAllPlans = mutation({
  args: {},
  handler: async (ctx) => {
    const allPlans = await ctx.db.query("plans").collect();
    
    for (const plan of allPlans) {
      await ctx.db.delete(plan._id);
    }
    
    return { 
      success: true, 
      deletedCount: allPlans.length,
      message: `Deleted ${allPlans.length} plan(s)` 
    };
  },
});

/**
 * Delete all users and profiles
 */
export const deleteAllUsersAndProfiles = mutation({
  args: {},
  handler: async (ctx) => {
    const allUsers = await ctx.db.query("users").collect();
    const allProfiles = await ctx.db.query("userProfiles").collect();
    
    for (const user of allUsers) {
      await ctx.db.delete(user._id);
    }
    
    for (const profile of allProfiles) {
      await ctx.db.delete(profile._id);
    }
    
    return { 
      success: true, 
      deletedUsers: allUsers.length,
      deletedProfiles: allProfiles.length,
      message: `Deleted ${allUsers.length} user(s) and ${allProfiles.length} profile(s)` 
    };
  },
});
