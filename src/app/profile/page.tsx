"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
// CLERK AUTHENTICATION DISABLED - Keeping imports for future use
// import { useUser } from "@clerk/nextjs";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon, Edit2Icon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LoadingSpinner from "@/components/LoadingSpinner";
import MealEditorDialog from "@/components/MealEditorDialog";
import { Id } from "../../../convex/_generated/dataModel";
import { useAnonymousUser } from "@/lib/useAnonymousUser";

const ProfilePage = () => {
  // const { user } = useUser();
  // const userId = user?.id || "";
  // Using anonymous UUID for user identification
  const { userId, isLoading: userLoading } = useAnonymousUser();

  const allPlans = useQuery(
    api.plans.getUserPlans,
    userId ? { userId } : "skip"
  );
  const userProfile = useQuery(api.users.getUserProfile, { userId });
  const userData = useQuery(api.users.getUser, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);
  const [mealEditorOpen, setMealEditorOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{
    mealPlanId: Id<"mealPlan">;
    planId: Id<"plans">;
    mealType: "breakfast" | "lunch" | "dinner";
    currentMealName: string;
  } | null>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  // Fetch meal and workout plans for the current plan
  const mealPlans = useQuery(
    api.planManagement.getMealPlans,
    currentPlan ? { planId: currentPlan._id } : "skip"
  );

  const workoutPlans = useQuery(
    api.planManagement.getWorkoutPlans,
    currentPlan ? { planId: currentPlan._id } : "skip"
  );

  // Show loading spinner when data is being fetched
  if (
    allPlans === undefined ||
    userProfile === undefined ||
    userData === undefined ||
    (currentPlan && (mealPlans === undefined || workoutPlans === undefined))
  ) {
    return <LoadingSpinner />;
  }

  const userDisplayData = userProfile
    ? {
        name: userProfile.name || userData?.name || "User",
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
      }
    : null;

  return (
    <section className="relative z-10 pt-12 pb-32 grow container mx-auto px-4">
      <ProfileHeader user={userDisplayData} />

      {allPlans && allPlans?.length > 0 ? (
        <div className="space-y-8">
          {/* PLAN SELECTOR */}
          <div className="relative backdrop-blur-sm border border-border p-6">
            <CornerElements />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>{" "}
                <span className="text-foreground">Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs text-muted-foreground">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allPlans.map((plan) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`text-foreground border hover:text-white ${
                    selectedPlanId === plan._id
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-transparent border-border hover:border-primary/50"
                  }`}
                >
                  {plan.name}
                  {plan.isActive && (
                    <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* PLAN DETAILS */}

          {currentPlan && (
            <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
              <CornerElements />

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-lg font-bold">
                  PLAN: <span className="text-primary">{currentPlan.name}</span>
                </h3>
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                  <TabsTrigger
                    value="workout"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <DumbbellIcon className="mr-2 size-4" />
                    Workout Plan
                  </TabsTrigger>

                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <AppleIcon className="mr-2 h-4 w-4" />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout">
                  <div className="space-y-4">
                    {workoutPlans && workoutPlans.length > 0 ? (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm text-muted-foreground">
                            SCHEDULE: {currentPlan.weeklyStructure.join(", ")}
                          </span>
                        </div>

                        <Accordion type="multiple" className="space-y-4">
                          {workoutPlans.map((dayPlan, index) => (
                            <AccordionItem
                              key={index}
                              value={dayPlan.dayOfWeek}
                              className="border rounded-lg overflow-hidden"
                            >
                              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                                <div className="flex justify-between w-full items-center">
                                  <span className="text-primary">
                                    {dayPlan.dayOfWeek}
                                  </span>
                                  <div className="text-xs text-muted-foreground">
                                    {dayPlan.exercises.length} EXERCISES •{" "}
                                    {dayPlan.estimatedDuration} MIN
                                  </div>
                                </div>
                              </AccordionTrigger>

                              <AccordionContent className="pb-4 px-4">
                                <div className="space-y-3 mt-2">
                                  {dayPlan.exercises.map(
                                    (exercise, exerciseIndex) => (
                                      <div
                                        key={exerciseIndex}
                                        className="border border-border rounded p-3 bg-background/50"
                                      >
                                        <div className="flex justify-between items-start mb-2">
                                          <div className="flex-1">
                                            <h4 className="font-semibold text-foreground mb-1">
                                              {exercise.exerciseName}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                {exercise.equipment}
                                              </span>
                                              <span>
                                                {exercise.primaryMuscles.join(
                                                  ", "
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                              {exercise.sets} SETS
                                            </div>
                                            {exercise.reps && (
                                              <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                                {exercise.reps} REPS
                                              </div>
                                            )}
                                            {exercise.duration && (
                                              <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                                {exercise.duration}s
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        {exercise.notes && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {exercise.notes}
                                          </p>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No workout plan available
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="diet">
                  <div className="space-y-4">
                    {mealPlans && mealPlans.length > 0 ? (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-mono text-sm text-muted-foreground">
                            DAILY CALORIE TARGET
                          </span>
                          <div className="font-mono text-xl text-primary">
                            {currentPlan.targetCalories} KCAL
                          </div>
                        </div>

                        <div className="h-px w-full bg-border my-4"></div>

                        <Accordion type="multiple" className="space-y-4">
                          {mealPlans.map((dayMeal, index) => (
                            <AccordionItem
                              key={index}
                              value={dayMeal.dayOfWeek}
                              className="border rounded-lg overflow-hidden"
                            >
                              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                                <div className="flex justify-between w-full items-center">
                                  <span className="text-primary">
                                    {dayMeal.dayOfWeek}
                                  </span>
                                  <div className="text-xs text-muted-foreground">
                                    {dayMeal.totalCalories.min}-
                                    {dayMeal.totalCalories.max} KCAL
                                  </div>
                                </div>
                              </AccordionTrigger>

                              <AccordionContent className="pb-4 px-4">
                                <div className="space-y-4 mt-2">
                                  {/* Breakfast */}
                                  <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <h4 className="font-mono text-primary">
                                          Breakfast
                                        </h4>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                          {dayMeal.breakfast.calories.min}-
                                          {dayMeal.breakfast.calories.max} kcal
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                          onClick={() => {
                                            setEditingMeal({
                                              mealPlanId: dayMeal._id,
                                              planId: currentPlan._id,
                                              mealType: "breakfast",
                                              currentMealName:
                                                dayMeal.breakfast.mealName,
                                            });
                                            setMealEditorOpen(true);
                                          }}
                                        >
                                          <Edit2Icon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-foreground">
                                      {dayMeal.breakfast.mealName}
                                    </p>
                                  </div>

                                  {/* Lunch */}
                                  <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <h4 className="font-mono text-primary">
                                          Lunch
                                        </h4>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                          {dayMeal.lunch.calories.min}-
                                          {dayMeal.lunch.calories.max} kcal
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                          onClick={() => {
                                            setEditingMeal({
                                              mealPlanId: dayMeal._id,
                                              planId: currentPlan._id,
                                              mealType: "lunch",
                                              currentMealName:
                                                dayMeal.lunch.mealName,
                                            });
                                            setMealEditorOpen(true);
                                          }}
                                        >
                                          <Edit2Icon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-foreground">
                                      {dayMeal.lunch.mealName}
                                    </p>
                                  </div>

                                  {/* Dinner */}
                                  <div className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <h4 className="font-mono text-primary">
                                          Dinner
                                        </h4>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                          {dayMeal.dinner.calories.min}-
                                          {dayMeal.dinner.calories.max} kcal
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-7 w-7 p-0 text-primary hover:text-primary hover:bg-primary/10"
                                          onClick={() => {
                                            setEditingMeal({
                                              mealPlanId: dayMeal._id,
                                              planId: currentPlan._id,
                                              mealType: "dinner",
                                              currentMealName:
                                                dayMeal.dinner.mealName,
                                            });
                                            setMealEditorOpen(true);
                                          }}
                                        >
                                          <Edit2Icon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-foreground">
                                      {dayMeal.dinner.mealName}
                                    </p>
                                  </div>

                                  {/* Snacks */}
                                  {dayMeal.snacks.length > 0 && (
                                    <div className="border border-border rounded-lg p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        <h4 className="font-mono text-primary">
                                          Snacks
                                        </h4>
                                      </div>
                                      <ul className="space-y-2">
                                        {dayMeal.snacks.map(
                                          (snack, snackIndex) => (
                                            <li
                                              key={snackIndex}
                                              className="text-sm text-foreground flex justify-between"
                                            >
                                              <span>{snack.mealName}</span>
                                              <span className="text-xs text-muted-foreground">
                                                {snack.calories.min}-
                                                {snack.calories.max} kcal
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        No meal plan available
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}

      {/* Meal Editor Dialog */}
      {editingMeal && (
        <MealEditorDialog
          open={mealEditorOpen}
          onOpenChange={setMealEditorOpen}
          mealPlanId={editingMeal.mealPlanId}
          planId={editingMeal.planId}
          mealType={editingMeal.mealType}
          currentMealName={editingMeal.currentMealName}
        />
      )}
    </section>
  );
};
export default ProfilePage;
