/**
 * Plan Management Functions
 * 
 * Functions for creating, updating, and managing fitness plans
 */

import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { DIET_DATABASE } from "../src/constants/dietDatabase";

// Create new plan
export const createPlan = internalMutation({
  args: {
    userId: v.string(),
    profileId: v.id("userProfiles"),
    selectedDietId: v.string(),
    targetCalories: v.number(),
    weeklyStructure: v.array(v.string()),
    dietReasoning: v.string(),
    workoutReasoning: v.string(),
    calorieReasoning: v.string(),
  },
  handler: async (ctx, args) => {
    // Deactivate existing active plans
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_active", (q) => q.eq("isActive", true).eq("userId", args.userId))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    // Create new plan
    const now = Date.now();
    const planId = await ctx.db.insert("plans", {
      userId: args.userId,
      profileId: args.profileId,
      name: `Fitness Plan - ${new Date(now).toLocaleDateString()}`,
      planType: "combined",
      selectedDietId: args.selectedDietId,
      targetCalories: args.targetCalories,
      weeklyStructure: args.weeklyStructure,
      isActive: true,
      startDate: now,
      generatedAt: now,
      selectionReasoning: {
        dietReason: args.dietReasoning,
        workoutReason: args.workoutReasoning,
        calorieReason: args.calorieReasoning,
      },
    });

    return planId;
  },
});

// Create meal plan for a day
export const createMealPlan = internalMutation({
  args: {
    planId: v.id("plans"),
    userId: v.string(),
    dayOfWeek: v.string(),
    breakfast: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(),
    }),
    lunch: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(),
    }),
    dinner: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(),
    }),
    snacks: v.array(v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      source: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    // Calculate total calories
    const totalMin = args.breakfast.calories.min + args.lunch.calories.min + args.dinner.calories.min +
      args.snacks.reduce((sum, s) => sum + s.calories.min, 0);
    const totalMax = args.breakfast.calories.max + args.lunch.calories.max + args.dinner.calories.max +
      args.snacks.reduce((sum, s) => sum + s.calories.max, 0);

    return await ctx.db.insert("mealPlan", {
      planId: args.planId,
      userId: args.userId,
      dayOfWeek: args.dayOfWeek,
      breakfast: args.breakfast,
      lunch: args.lunch,
      dinner: args.dinner,
      snacks: args.snacks,
      totalCalories: { min: totalMin, max: totalMax },
      isCustomized: false,
    });
  },
});

// Create workout plan for a day
export const createWorkoutPlan = internalMutation({
  args: {
    planId: v.id("plans"),
    userId: v.string(),
    dayOfWeek: v.string(),
    dayNumber: v.number(),
    workoutType: v.string(),
    estimatedDuration: v.number(),
    difficultyLevel: v.string(),
    exercises: v.array(v.object({
      exerciseId: v.string(),
      exerciseName: v.string(),
      category: v.string(),
      sets: v.number(),
      reps: v.optional(v.number()),
      duration: v.optional(v.number()),
      restSeconds: v.number(),
      equipment: v.string(),
      notes: v.optional(v.string()),
      primaryMuscles: v.array(v.string()),
    })),
    weekNumber: v.number(),
    progressionNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workoutPlan", {
      planId: args.planId,
      userId: args.userId,
      dayOfWeek: args.dayOfWeek,
      dayNumber: args.dayNumber,
      workoutType: args.workoutType,
      estimatedDuration: args.estimatedDuration,
      difficultyLevel: args.difficultyLevel,
      exercises: args.exercises,
      weekNumber: args.weekNumber,
      progressionNotes: args.progressionNotes,
      isCustomized: false,
    });
  },
});

// Update meal for a specific day and meal type
export const updateMeal = mutation({
  args: {
    mealPlanId: v.id("mealPlan"),
    mealType: v.string(), // "breakfast", "lunch", "dinner"
    newMeal: v.object({
      mealName: v.string(),
      calories: v.object({ min: v.number(), max: v.number() }),
      protein: v.optional(v.object({ min: v.number(), max: v.number() })),
      carbs: v.optional(v.object({ min: v.number(), max: v.number() })),
      fat: v.optional(v.object({ min: v.number(), max: v.number() })),
      source: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const mealPlan = await ctx.db.get(args.mealPlanId);
    if (!mealPlan) throw new Error("Meal plan not found");

    const updates: any = {
      isCustomized: true,
    };

    if (args.mealType === "breakfast") {
      updates.breakfast = args.newMeal;
    } else if (args.mealType === "lunch") {
      updates.lunch = args.newMeal;
    } else if (args.mealType === "dinner") {
      updates.dinner = args.newMeal;
    }

    // Recalculate total calories
    const updatedPlan = { ...mealPlan, ...updates };
    const totalMin = updatedPlan.breakfast.calories.min + updatedPlan.lunch.calories.min + 
      updatedPlan.dinner.calories.min + updatedPlan.snacks.reduce((sum: number, s: any) => sum + s.calories.min, 0);
    const totalMax = updatedPlan.breakfast.calories.max + updatedPlan.lunch.calories.max + 
      updatedPlan.dinner.calories.max + updatedPlan.snacks.reduce((sum: number, s: any) => sum + s.calories.max, 0);

    updates.totalCalories = { min: totalMin, max: totalMax };

    await ctx.db.patch(args.mealPlanId, updates);
    return updatedPlan;
  },
});

// Replace exercise in workout
export const replaceExercise = mutation({
  args: {
    workoutPlanId: v.id("workoutPlan"),
    exerciseIndex: v.number(),
    newExercise: v.object({
      exerciseId: v.string(),
      exerciseName: v.string(),
      category: v.string(),
      sets: v.number(),
      reps: v.optional(v.number()),
      duration: v.optional(v.number()),
      restSeconds: v.number(),
      equipment: v.string(),
      notes: v.optional(v.string()),
      primaryMuscles: v.array(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const workout = await ctx.db.get(args.workoutPlanId);
    if (!workout) throw new Error("Workout plan not found");

    const exercises = [...workout.exercises];
    exercises[args.exerciseIndex] = args.newExercise;

    await ctx.db.patch(args.workoutPlanId, {
      exercises,
      isCustomized: true,
    });

    return workout;
  },
});

// Get all plans for user
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

// Deactivate plan
export const deactivatePlan = mutation({
  args: { planId: v.id("plans") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, { isActive: false });
  },
});

// Activate plan
export const activatePlan = mutation({
  args: { planId: v.id("plans"), userId: v.string() },
  handler: async (ctx, args) => {
    // Deactivate all other plans
    const activePlans = await ctx.db
      .query("plans")
      .withIndex("by_active", (q) => q.eq("isActive", true).eq("userId", args.userId))
      .collect();

    for (const plan of activePlans) {
      await ctx.db.patch(plan._id, { isActive: false });
    }

    // Activate selected plan
    await ctx.db.patch(args.planId, { isActive: true });
  },
});

// Get meal plans for a specific plan
export const getMealPlans = query({
  args: { planId: v.id("plans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mealPlan")
      .withIndex("by_plan_id", (q) => q.eq("planId", args.planId))
      .collect();
  },
});

// Get workout plans for a specific plan
export const getWorkoutPlans = query({
  args: { planId: v.id("plans") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workoutPlan")
      .withIndex("by_plan_id", (q) => q.eq("planId", args.planId))
      .collect();
  },
});

// Get available meal alternatives for swapping
export const getMealAlternatives = query({
  args: {
    planId: v.id("plans"),
    mealType: v.string(), // "breakfast", "lunch", "dinner"
  },
  handler: async (ctx, args) => {
    // Get the plan to find the selected diet
    const plan = await ctx.db.get(args.planId);
    if (!plan || !plan.selectedDietId) return [];

    // Find the diet
    const diet = DIET_DATABASE.find(d => d.id === plan.selectedDietId);
    if (!diet) return [];

    // Return appropriate meal options
    if (args.mealType === "breakfast") {
      return diet.breakfastOptions;
    } else if (args.mealType === "lunch") {
      return diet.lunchOptions;
    } else if (args.mealType === "dinner") {
      return diet.dinnerOptions;
    }

    return [];
  },
});

// Delete a fitness plan and all associated data
export const deletePlan = mutation({
  args: {
    planId: v.id("plans"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the plan belongs to the user
    const plan = await ctx.db.get(args.planId);
    if (!plan || plan.userId !== args.userId) {
      throw new Error("Plan not found or unauthorized");
    }

    // Delete all meal plans associated with this plan
    const mealPlans = await ctx.db
      .query("mealPlan")
      .filter((q) => q.eq(q.field("planId"), args.planId))
      .collect();
    
    for (const mealPlan of mealPlans) {
      await ctx.db.delete(mealPlan._id);
    }

    // Delete all workout plans associated with this plan
    const workoutPlans = await ctx.db
      .query("workoutPlan")
      .filter((q) => q.eq(q.field("planId"), args.planId))
      .collect();
    
    for (const workoutPlan of workoutPlans) {
      await ctx.db.delete(workoutPlan._id);
    }

    // Delete the plan itself
    await ctx.db.delete(args.planId);

    return { success: true };
  },
});