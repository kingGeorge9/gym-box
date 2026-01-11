/**
 * Intelligent Workout Selection Engine
 * 
 * This engine selects exercises from the workout database based on user profile.
 * NO AI generation - purely database-driven with intelligent scoring and filtering.
 */

import { workoutDatabase } from "../src/constants/workoutDatabase";

type Exercise = typeof workoutDatabase.exercises[number];

export interface WorkoutProfile {
  fitnessLevel: string; // Beginner, Intermediate, Advanced
  primaryGoal: string; // fat_loss, muscle_gain, strength, health
  workoutLocation: string; // home, gym, both
  availableEquipment: string[];
  workoutDays: number; // 1-7
  timePerSession: number; // minutes
  injuries?: string;
  avoidExercises?: string[];
}

export interface ExerciseSelection {
  exercise: Exercise;
  sets: number;
  reps?: number;
  duration?: number;
  restSeconds: number;
  score: number;
  reasoning: string;
}

export interface DayWorkout {
  day: string;
  dayNumber: number;
  workoutType: string;
  exercises: ExerciseSelection[];
  estimatedDuration: number;
  reasoning: string;
}

export interface WeeklyWorkoutPlan {
  workouts: DayWorkout[];
  restDays: string[];
  reasoning: string;
}

/**
 * Score an exercise based on user profile
 */
function scoreExercise(
  exercise: Exercise,
  profile: WorkoutProfile,
  targetMuscles: string[],
  avoidEquipment: string[] = []
): number {
  let score = 0;
  
  // 1. Difficulty match (25 points max)
  const difficultyMap: Record<string, string[]> = {
    Beginner: ["Beginner"],
    Intermediate: ["Beginner", "Intermediate"],
    Advanced: ["Intermediate", "Advanced"],
  };
  
  if (difficultyMap[profile.fitnessLevel]?.includes(exercise.difficulty)) {
    score += 25;
  } else {
    score -= 20; // Penalty for mismatch
  }
  
  // 2. Equipment availability (30 points max)
  if (profile.workoutLocation === "home") {
    if (exercise.equipment === "None" || exercise.equipment === "Mat") {
      score += 30;
    } else if (profile.availableEquipment.includes(exercise.equipment)) {
      score += 20;
    } else {
      return 0; // Can't do this exercise
    }
  } else if (profile.workoutLocation === "gym") {
    score += 30; // All equipment available
  } else {
    // Both - prefer versatile exercises
    score += profile.availableEquipment.includes(exercise.equipment) || exercise.equipment === "None" ? 25 : 15;
  }
  
  // 3. Muscle group targeting (30 points max)
  let muscleScore = 0;
  for (const targetMuscle of targetMuscles) {
    if ((exercise.primaryMuscles as readonly string[]).includes(targetMuscle)) {
      muscleScore += 20;
    } else if ('secondaryMuscles' in exercise && exercise.secondaryMuscles && (exercise.secondaryMuscles as readonly string[]).includes(targetMuscle)) {
      muscleScore += 10;
    }
  }
  score += Math.min(muscleScore, 30);
  
  // 4. Goal alignment (15 points max)
  if (profile.primaryGoal === "fat_loss" && exercise.category === "Cardio") {
    score += 15;
  } else if (profile.primaryGoal === "muscle_gain" && 
             (exercise.category === "Upper Body" || exercise.category === "Lower Body")) {
    score += 15;
  } else if (profile.primaryGoal === "strength" && exercise.equipment !== "None") {
    score += 15;
  } else {
    score += 5; // General fitness benefit
  }
  
  // Penalties
  if (profile.avoidExercises?.some(avoid => exercise.name.toLowerCase().includes(avoid.toLowerCase()))) {
    score -= 50;
  }
  
  if (avoidEquipment.includes(exercise.equipment)) {
    score -= 30;
  }
  
  return Math.max(0, score);
}

/**
 * Generate weekly workout split based on workout days
 */
function generateWorkoutSplit(workoutDays: number, goal: string): {
  splits: { type: string; muscles: string[] }[];
  schedule: string[];
} {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  if (workoutDays === 3) {
    return {
      splits: [
        { type: "Full Body A", muscles: ["Quadriceps", "Chest", "Back", "Core"] },
        { type: "Full Body B", muscles: ["Glutes", "Hamstrings", "Shoulders", "Arms", "Core"] },
        { type: "Full Body C", muscles: ["Quadriceps", "Glutes", "Back", "Chest", "Core"] },
      ],
      schedule: ["Monday", "Rest", "Wednesday", "Rest", "Friday", "Rest", "Rest"],
    };
  } else if (workoutDays === 4) {
    return {
      splits: [
        { type: "Upper Body", muscles: ["Chest", "Back", "Shoulders", "Arms"] },
        { type: "Lower Body", muscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"] },
        { type: "Upper Body", muscles: ["Chest", "Back", "Shoulders", "Arms"] },
        { type: "Lower Body + Core", muscles: ["Quadriceps", "Glutes", "Core"] },
      ],
      schedule: ["Monday", "Tuesday", "Rest", "Thursday", "Friday", "Rest", "Rest"],
    };
  } else if (workoutDays === 5) {
    return {
      splits: [
        { type: "Chest + Triceps", muscles: ["Chest", "Triceps"] },
        { type: "Back + Biceps", muscles: ["Back", "Biceps"] },
        { type: "Legs", muscles: ["Quadriceps", "Glutes", "Hamstrings", "Calves"] },
        { type: "Shoulders + Core", muscles: ["Shoulders", "Core"] },
        { type: "Full Body", muscles: ["Chest", "Back", "Quadriceps", "Core"] },
      ],
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Rest", "Rest"],
    };
  } else if (workoutDays === 6) {
    return {
      splits: [
        { type: "Push (Chest, Shoulders, Triceps)", muscles: ["Chest", "Shoulders", "Triceps"] },
        { type: "Pull (Back, Biceps)", muscles: ["Back", "Biceps"] },
        { type: "Legs", muscles: ["Quadriceps", "Glutes", "Hamstrings"] },
        { type: "Push", muscles: ["Chest", "Shoulders", "Triceps"] },
        { type: "Pull", muscles: ["Back", "Biceps"] },
        { type: "Legs + Core", muscles: ["Quadriceps", "Glutes", "Core"] },
      ],
      schedule: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Rest"],
    };
  } else {
    // Default to 3 days for other cases
    return {
      splits: [
        { type: "Full Body", muscles: ["Quadriceps", "Chest", "Back", "Core"] },
        { type: "Full Body", muscles: ["Glutes", "Shoulders", "Arms", "Core"] },
        { type: "Full Body", muscles: ["Quadriceps", "Back", "Chest", "Core"] },
      ],
      schedule: ["Monday", "Rest", "Wednesday", "Rest", "Friday", "Rest", "Rest"],
    };
  }
}

/**
 * Select exercises for a workout day
 */
function selectExercisesForDay(
  targetMuscles: string[],
  profile: WorkoutProfile,
  exerciseCount: number = 6
): ExerciseSelection[] {
  const exercises = workoutDatabase.exercises;
  
  // Score all exercises
  const scoredExercises = exercises.map(exercise => ({
    exercise,
    score: scoreExercise(exercise, profile, targetMuscles),
  })).filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score);
  
  // Select top exercises ensuring variety
  const selected: ExerciseSelection[] = [];
  const usedMuscles = new Set<string>();
  const usedCategories = new Set<string>();
  
  for (const { exercise, score } of scoredExercises) {
    if (selected.length >= exerciseCount) break;
    
    // Ensure variety - don't overwork same muscles
    const primaryUsed = exercise.primaryMuscles.some(m => usedMuscles.has(m));
    if (primaryUsed && selected.length > 0 && usedMuscles.size < 4) {
      continue; // Skip if we already worked these muscles recently
    }
    
    // Add exercise
    exercise.primaryMuscles.forEach(m => usedMuscles.add(m));
    usedCategories.add(exercise.category);
    
    // Calculate sets and reps based on goal and fitness level
    let sets: number = exercise.defaultSets || 3;
    let reps: number | undefined = ('defaultReps' in exercise && exercise.defaultReps) ? exercise.defaultReps : 12;
    let duration: number | undefined = ('defaultDurationSeconds' in exercise && exercise.defaultDurationSeconds) ? exercise.defaultDurationSeconds : undefined;
    
    if (profile.primaryGoal === "strength") {
      sets = profile.fitnessLevel === "Advanced" ? 5 : 4;
      if (duration) {
        reps = undefined;
      } else {
        reps = 6;
      }
    } else if (profile.primaryGoal === "muscle_gain") {
      sets = profile.fitnessLevel === "Advanced" ? 4 : 3;
      if (duration) {
        reps = undefined;
      } else {
        reps = 10;
      }
    } else if (profile.primaryGoal === "fat_loss") {
      sets = 3;
      if (duration) {
        reps = undefined;
      } else {
        reps = 15;
      }
    }
    
    selected.push({
      exercise,
      sets,
      reps: reps,
      duration: duration,
      restSeconds: exercise.restSeconds || 60,
      score,
      reasoning: `Targets ${exercise.primaryMuscles.join(", ")} with ${exercise.equipment}`,
    });
  }
  
  return selected;
}

/**
 * Generate complete weekly workout plan
 */
export function generateWeeklyWorkoutPlan(profile: WorkoutProfile): WeeklyWorkoutPlan {
  const { splits, schedule } = generateWorkoutSplit(profile.workoutDays, profile.primaryGoal);
  
  const workouts: DayWorkout[] = [];
  const restDays: string[] = [];
  
  let workoutIndex = 0;
  
  for (let i = 0; i < schedule.length; i++) {
    const dayName = schedule[i];
    
    if (dayName === "Rest") {
      restDays.push(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][i]);
      continue;
    }
    
    const split = splits[workoutIndex % splits.length];
    const exercisesPerWorkout = Math.min(
      Math.floor(profile.timePerSession / 8), // ~8 min per exercise
      8
    );
    
    const exercises = selectExercisesForDay(split.muscles, profile, exercisesPerWorkout);
    
    // Calculate estimated duration
    const estimatedDuration = exercises.reduce((total, ex) => {
      const timePerSet = ex.duration ? ex.duration : (ex.reps || 12) * 3;
      return total + (ex.sets * (timePerSet + ex.restSeconds)) / 60; // rough estimate
    }, 0);
    
    workouts.push({
      day: dayName,
      dayNumber: i + 1,
      workoutType: split.type,
      exercises,
      estimatedDuration: Math.round(estimatedDuration),
      reasoning: `${split.type} workout targeting ${split.muscles.slice(0, 3).join(", ")}`,
    });
    
    workoutIndex++;
  }
  
  const reasoningParts: string[] = [];
  
  if (profile.workoutDays === 3) {
    reasoningParts.push("3-day full body split for balanced muscle development");
  } else if (profile.workoutDays === 4) {
    reasoningParts.push("4-day upper/lower split for optimal recovery");
  } else if (profile.workoutDays >= 5) {
    reasoningParts.push(`${profile.workoutDays}-day split for advanced training volume`);
  }
  
  if (profile.primaryGoal === "muscle_gain") {
    reasoningParts.push("focused on hypertrophy rep ranges (8-12 reps)");
  } else if (profile.primaryGoal === "strength") {
    reasoningParts.push("emphasizing strength development (4-6 reps)");
  } else if (profile.primaryGoal === "fat_loss") {
    reasoningParts.push("incorporating higher reps (12-15) for calorie burn");
  }
  
  if (profile.workoutLocation === "home") {
    reasoningParts.push("adapted for home training with minimal equipment");
  }
  
  return {
    workouts,
    restDays,
    reasoning: reasoningParts.join(", ") + ".",
  };
}

/**
 * Get alternative exercises for exercise swapping
 */
export function getAlternativeExercises(
  currentExercise: Exercise,
  profile: WorkoutProfile,
  count: number = 5
): ExerciseSelection[] {
  const exercises = workoutDatabase.exercises;
  
  // Find exercises targeting same muscle groups
  const alternatives = exercises
    .filter(ex => 
      ex.id !== currentExercise.id &&
      (ex.primaryMuscles as readonly string[]).some(m => (currentExercise.primaryMuscles as readonly string[]).includes(m))
    )
    .map(exercise => ({
      exercise,
      score: scoreExercise(exercise, profile, [...currentExercise.primaryMuscles]),
    }))
    .filter(e => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
  
  return alternatives.map(({ exercise, score }) => ({
    exercise,
    sets: currentExercise.defaultSets || 3,
    reps: ('defaultReps' in exercise && exercise.defaultReps) ? exercise.defaultReps : 12,
    restSeconds: exercise.restSeconds || 60,
    score,
    reasoning: `Alternative targeting ${exercise.primaryMuscles.join(", ")}`,
  }));
}

/**
 * Progressive overload calculator
 */
export function calculateProgressiveOverload(
  weekNumber: number,
  baseWeight: number,
  baseSets: number,
  baseReps: number,
  goal: string
): { sets: number; reps: number; weight: number; notes: string } {
  let sets = baseSets;
  let reps = baseReps;
  let weight = baseWeight;
  let notes = "";
  
  if (goal === "strength") {
    // Every 2 weeks, increase weight by 2.5-5%
    if (weekNumber % 2 === 0) {
      weight = baseWeight * (1 + 0.025 * Math.floor(weekNumber / 2));
      notes = `Increased weight by ${Math.floor((weight - baseWeight) / baseWeight * 100)}%`;
    }
  } else if (goal === "muscle_gain") {
    // Every 3 weeks, add a set or increase reps
    const cycle = Math.floor(weekNumber / 3);
    if (cycle % 2 === 0) {
      reps = baseReps + 2;
      notes = "Added 2 reps for progressive overload";
    } else {
      sets = baseSets + 1;
      notes = "Added 1 set for increased volume";
    }
  } else {
    // Every 4 weeks, increase reps
    reps = baseReps + Math.floor(weekNumber / 4) * 2;
    notes = weekNumber % 4 === 0 ? "Increased reps for endurance" : "";
  }
  
  return { sets, reps, weight: Math.round(weight * 10) / 10, notes };
}
