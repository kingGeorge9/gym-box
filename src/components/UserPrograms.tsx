"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  AppleIcon,
  ShieldIcon,
  TrendingUpIcon,
  PlayIcon,
} from "lucide-react";
import { USER_PROGRAMS } from "@/constants";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAnonymousUser } from "@/lib/useAnonymousUser";
import LoadingSpinner from "./LoadingSpinner";

const UserPrograms = () => {
  // const { user } = useUser();
  // const userId = user?.id || "";
  // Using anonymous UUID for user identification
  const { userId } = useAnonymousUser();
  const userPlans = useQuery(
    api.plans.getUserPlans,
    userId ? { userId } : "skip"
  );
  const userProfile = useQuery(
    api.users.getUserProfile,
    userId ? { userId } : "skip"
  );
  // Delete functionality commented out for now
  // const deletePlan = useMutation(api.planManagement.deletePlan);
  // const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  // Get the active plan
  const activePlan = userPlans?.find((plan) => plan.isActive);

  // Fetch meal and workout plans for active plan
  const mealPlans = useQuery(
    api.planManagement.getMealPlans,
    activePlan ? { planId: activePlan._id } : "skip"
  );
  const workoutPlans = useQuery(
    api.planManagement.getWorkoutPlans,
    activePlan ? { planId: activePlan._id } : "skip"
  );

  /* Delete functionality - uncomment when needed
  const handleDeletePlan = async (planId: Id<"plans">) => {
    if (
      !confirm(
        "Are you sure you want to delete this program? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeletingPlanId(planId);
      await deletePlan({ planId, userId });
    } catch (error) {
      console.error("Failed to delete plan:", error);
      alert("Failed to delete program. Please try again.");
    } finally {
      setDeletingPlanId(null);
    }
  };
  */

  // Show loading state while fetching
  if (userPlans === undefined || userProfile === undefined) {
    return (
      <div className="w-full pb-24 pt-16 relative">
        <div className="container mx-auto max-w-6xl px-4 flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // If user has programs, show their programs
  if (userPlans && userPlans.length > 0 && activePlan) {
    // Get today's day of week
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = daysOfWeek[new Date().getDay()];
    const todayIndex = activePlan.weeklyStructure.findIndex(
      (day) => day.toLowerCase() === today
    );

    // Find next workout day
    let nextWorkoutDay = null;
    let daysUntilNext = 0;
    for (let i = 1; i <= 7; i++) {
      const checkIndex = (todayIndex + i) % 7;
      const dayName = daysOfWeek[checkIndex];
      const scheduledWorkout = activePlan.weeklyStructure[checkIndex];
      if (scheduledWorkout && scheduledWorkout.toLowerCase() !== "rest") {
        nextWorkoutDay = dayName;
        daysUntilNext = i;
        break;
      }
    }

    // Get today's workout plan
    const todaysWorkout = workoutPlans?.find(
      (wp) => wp.dayOfWeek.toLowerCase() === today
    );

    // Get today's meals
    const todaysMeals = mealPlans?.filter(
      (mp) => mp.dayOfWeek.toLowerCase() === today
    );

    return (
      <div className="w-full pb-24 pt-16 relative">
        <div className="container mx-auto max-w-6xl px-4">
          {/* HEADER */}
          <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-16">
            {/* HEADER BAR */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-sm text-primary font-medium">
                  Active Program
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {activePlan.name}
              </div>
            </div>

            {/* HEADER CONTENT */}
            <div className="p-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-foreground">Your </span>
                <span className="text-primary">Fitness Dashboard</span>
              </h2>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Track your workout progress and nutrition plan at a glance
              </p>
            </div>
          </div>

          {/* Three distinct cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CARD 1: Workout Overview */}
            <Card className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm text-primary">WORKOUT</span>
                </div>
                <Dumbbell className="h-4 w-4 text-primary" />
              </div>

              <CardHeader className="pt-6 px-5">
                <CardTitle className="text-xl text-foreground mb-2">
                  Today&apos;s Training
                </CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {today}
                </p>
              </CardHeader>

              <CardContent className="px-5">
                {todaysWorkout && todaysWorkout.workout !== "rest" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <h3 className="font-bold text-primary text-lg mb-2">
                        {todaysWorkout.workout}
                      </h3>
                      <div className="space-y-2 text-sm">
                        {todaysWorkout.exercises
                          ?.slice(0, 3)
                          .map((exercise: { name: string }, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span>{exercise.name}</span>
                            </div>
                          ))}
                        {(todaysWorkout.exercises?.length || 0) > 3 && (
                          <div className="text-xs text-primary">
                            +{(todaysWorkout.exercises?.length || 0) - 3} more
                            exercises
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground font-medium">
                        {userProfile?.preferredTimePerSession || 60} min
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                      <ShieldIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Rest Day</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Recovery is essential for progress
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-5 py-4 border-t border-border">
                <Link href="/profile" className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    View Full Plan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 2: Diet Overview */}
            <Card className="bg-card/90 backdrop-blur-sm border border-border hover:border-secondary/50 transition-colors overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                  <span className="text-sm text-secondary">NUTRITION</span>
                </div>
                <AppleIcon className="h-4 w-4 text-secondary" />
              </div>

              <CardHeader className="pt-6 px-5">
                <CardTitle className="text-xl text-foreground mb-2">
                  Today&apos;s Meals
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Target: {activePlan.targetCalories} kcal
                </p>
              </CardHeader>

              <CardContent className="px-5">
                <div className="space-y-3">
                  {todaysMeals && todaysMeals.length > 0 ? (
                    <>
                      {todaysMeals.slice(0, 1).map((meal) => (
                        <div key={meal._id} className="space-y-3">
                          {meal.breakfast && (
                            <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs uppercase tracking-wide text-secondary font-medium">
                                  Breakfast
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ~{meal.breakfast.calories.min} kcal
                                </span>
                              </div>
                              <p className="text-sm text-foreground">
                                {meal.breakfast.mealName}
                              </p>
                            </div>
                          )}
                          {meal.lunch && (
                            <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs uppercase tracking-wide text-secondary font-medium">
                                  Lunch
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ~{meal.lunch.calories.min} kcal
                                </span>
                              </div>
                              <p className="text-sm text-foreground">
                                {meal.lunch.mealName}
                              </p>
                            </div>
                          )}
                          {meal.dinner && (
                            <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs uppercase tracking-wide text-secondary font-medium">
                                  Dinner
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ~{meal.dinner.calories.min} kcal
                                </span>
                              </div>
                              <p className="text-sm text-foreground">
                                {meal.dinner.mealName}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground text-sm">
                        No meals planned for today
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="px-5 py-4 border-t border-border">
                <Link href="/profile" className="w-full">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    View Meal Plan
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* CARD 3: Next Workout Recommendation */}
            <Card className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-primary">UP NEXT</span>
                </div>
                <TrendingUpIcon className="h-4 w-4 text-primary" />
              </div>

              <CardHeader className="pt-6 px-5">
                <CardTitle className="text-xl text-foreground mb-2">
                  Next Workout
                </CardTitle>
                <p className="text-sm text-muted-foreground capitalize">
                  {nextWorkoutDay ? (
                    <>
                      {nextWorkoutDay} (
                      {daysUntilNext === 1
                        ? "Tomorrow"
                        : `In ${daysUntilNext} days`}
                      )
                    </>
                  ) : (
                    "No upcoming workouts"
                  )}
                </p>
              </CardHeader>

              <CardContent className="px-5">
                {nextWorkoutDay ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg border border-primary/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <PlayIcon className="h-6 w-6 text-primary fill-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            Get Ready!
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Prepare for your next session
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activePlan.selectionReasoning.workoutReason?.substring(
                          0,
                          100
                        )}
                        ...
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Weekly Progress
                        </span>
                        <span className="text-foreground font-medium">
                          {
                            activePlan.weeklyStructure.filter(
                              (d) => d !== "rest"
                            ).length
                          }{" "}
                          workouts/week
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Goal</span>
                        <span className="text-foreground font-medium capitalize">
                          {userProfile?.primaryGoal?.replace("_", " ") ||
                            "Custom"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      No upcoming workouts scheduled
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="px-5 py-4 border-t border-border">
                <Link href="/generate-program" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                  >
                    Adjust Program
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* CTA section */}
          <div className="mt-16 text-center">
            <Link href="/generate-program">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              >
                Generate New Program
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-muted-foreground mt-4">
              Create another personalized fitness program
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If no programs, show the static gallery
  return (
    <div className="w-full pb-24 pt-16 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER- PROGRAM GALLERY */}
        <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-16">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-sm text-primary font-medium">
                Program Gallery
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Featured Plans</div>
          </div>

          {/* HEADER CONTENT */}
          <div className="p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Generated </span>
              <span className="text-primary">Fitness Programs</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Checkout the fitness programs of some of our users generated by
              our AI fitness coach.
            </p>

            {/* STATS */}
            <div className="flex items-center justify-center gap-16 mt-10 font-mono">
              <div className="flex flex-col items-center">
                <p className="text-3xl text-primary">100+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  PROGRAMS
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-primary">2min</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  CREATION TIME
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-primary">100%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  PERSONALIZED
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {USER_PROGRAMS.map((program) => (
            <Card
              key={program.id}
              className="bg-card/90 backdrop-blur-sm border border-border hover:border-primary/50 transition-colors overflow-hidden"
            >
              {/* Card header with user info */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-primary">
                    USER.{program.id}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {program.fitness_level.toUpperCase()}
                </div>
              </div>

              <CardHeader className="pt-6 px-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border border-border">
                    <img
                      src={program.profilePic}
                      alt={`${program.first_name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">
                      {program.first_name}
                      <span className="text-primary"></span>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      {program.age}y • {program.workout_days}d/week
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="px-3 py-1 bg-primary/10 rounded border border-primary/20 text-sm text-primary flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {program.fitness_goal}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    v3.5
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-5">
                {/* Program details */}
                <div className="space-y-5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <Dumbbell className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground">
                          {program.workout_plan.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {program.equipment_access}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-secondary/10 text-secondary mt-0.5">
                      <AppleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground">
                          {program.diet_plan.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        System optimized nutrition
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      <ShieldIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-foreground">
                          AI Safety Protocols
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Protection systems enabled
                      </p>
                    </div>
                  </div>
                </div>

                {/* Program description */}
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="text-primary">&gt; </span>
                    {program.workout_plan.description.substring(0, 1000)}
                  </div>
                </div>
              </CardContent>

              {/* <CardFooter className="px-5 py-4 border-t border-border">
                <Link href={`/programs/${program.id}`} className="w-full">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    View Program Details
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter> */}
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <Link href="/generate-program">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
            >
              Generate Your Program
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4">
            Join 100+ users with personalized fitness programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPrograms;
