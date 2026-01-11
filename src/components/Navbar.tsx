"use client";

import {
  DumbbellIcon,
  HomeIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  // All users have access - no authentication required
  const isSignedIn = true;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-primary/10 rounded">
            <ZapIcon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono">
            jere<span className="text-primary">.ai</span> |
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-5">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </Link>

          {isSignedIn && (
            <>
              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>
            </>
          )}

          {/* Authentication UI disabled */}
          {/* {isSignedIn ? (
            <div className="flex items-center gap-3 ml-2">
              {user?.imageUrl && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/50">
                  <img
                    src={user.imageUrl}
                    alt={user.firstName || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <SignOutButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <LogOutIcon size={14} className="mr-1.5" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          ) : (
            <SignInButton mode="redirect">
              <Button
                variant="outline"
                className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                Get Started
              </Button>
            </SignInButton>
          )} */}
        </nav>
      </div>
    </header>
  );
};
export default Navbar;
