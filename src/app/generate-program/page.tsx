"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import FitnessDataModal, {
  UserFitnessData,
} from "@/components/FitnessDataModal";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAnonymousUser } from "@/lib/useAnonymousUser";

const GenerateProgramPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const router = useRouter();
  
  // Using anonymous UUID for user identification
  const { userId } = useAnonymousUser();

  const handleGenerateProgram = async (data: UserFitnessData) => {
    setModalOpen(false); // Close modal immediately
    setIsGenerating(true);
    setGenerationStatus(null);

    try {
      const response = await fetch("/api/generate-program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          name: data.name,
          age: data.age,
          weight: data.weight,
          height: data.height,
          gender: data.gender,
          body_fat: data.bodyFat,
          fitness_level: data.fitnessLevel,
          fitness_goal: data.primaryGoal,
          additional_goals: data.additionalGoals,
          workout_location: data.workoutLocation,
          available_equipment: data.availableEquipment,
          workout_days: data.workoutDays,
          time_per_session: data.timePerSession,
          injuries: data.injuries,
          dietary_style: data.dietaryStyle,
          allergies: data.allergies,
          dietary_restrictions: data.dietaryRestrictions,
          cultural_preference: data.culturalPreference,
          meals_per_day: data.mealsPerDay,
          calorie_target: data.calorieTarget,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGenerationStatus({
          success: true,
          message:
            "Program generated successfully! Redirecting to your profile...",
        });

        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setGenerationStatus({
          success: false,
          message:
            result.error || "Failed to generate program. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error generating program:", error);
      setGenerationStatus({
        success: false,
        message: "An error occurred. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Full Screen Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner />
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                Generating Your Program
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This may take a moment...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
        <div className="container mx-auto px-4 h-full max-w-5xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-mono">
              <span>Generate Your </span>
              <span className="text-primary uppercase">
                Personalized Program
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete the form to create your personalized workout and diet
              plan
            </p>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Info Card */}
            <Card className="bg-card/90 backdrop-blur-sm border border-border p-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">
                      Personalized for You
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Our AI will create a custom workout and diet plan based on
                      your unique profile, goals, and preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Quick & Easy</h3>
                    <p className="text-muted-foreground text-sm">
                      Takes just a few minutes to complete. Answer simple
                      questions about yourself and your goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Science-Backed</h3>
                    <p className="text-muted-foreground text-sm">
                      Built on proven fitness and nutrition principles tailored
                      to your specific needs and limitations.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Status Messages */}
            {generationStatus && (
              <Card
                className={`p-4 ${
                  generationStatus.success
                    ? "bg-green-500/10 border-green-500"
                    : "bg-red-500/10 border-red-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  {generationStatus.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <p
                    className={
                      generationStatus.success
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {generationStatus.message}
                  </p>
                </div>
              </Card>
            )}

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={() => setModalOpen(true)}
                disabled={isGenerating}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Program...
                  </>
                ) : (
                  "Start Building Your Program"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <FitnessDataModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleGenerateProgram}
        userName=""
      />
    </>
  );
};

export default GenerateProgramPage;
