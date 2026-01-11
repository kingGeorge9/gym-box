"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-mono text-primary">
              AUTHENTICATION
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-foreground">Welcome </span>
            <span className="text-primary">Back</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your personalized fitness program
          </p>
        </div>

        {/* Clerk Sign In Component */}
        <div className="backdrop-blur-sm bg-card/50 rounded-lg border border-border p-8 shadow-2xl">
          <SignIn
            appearance={{
              baseTheme: dark,
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-background/50 border border-border hover:bg-primary/10 hover:border-primary/50 text-foreground transition-all",
                socialButtonsBlockButtonText: "font-medium",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                footerActionLink: "text-primary hover:text-primary/80",
                identityPreviewText: "text-foreground",
                identityPreviewEditButton: "text-primary hover:text-primary/80",
                formFieldLabel: "text-foreground",
                formFieldInput:
                  "bg-background/50 border-border text-foreground focus:border-primary",
                dividerLine: "bg-border",
                dividerText: "text-muted-foreground",
                otpCodeFieldInput:
                  "bg-background/50 border-border text-foreground",
                formResendCodeLink: "text-primary hover:text-primary/80",
              },
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorBackground: "hsl(var(--background))",
                colorText: "hsl(var(--foreground))",
                colorInputBackground: "hsl(var(--background))",
                colorInputText: "hsl(var(--foreground))",
              },
            }}
            signUpUrl="/sign-up"
            routing="path"
            afterSignInUrl="/generate-program"
          />
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
