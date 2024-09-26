"use client"
import React from 'react';
import { Heart } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Health Risk Assistance</span>
            </div>
          </div>
          <div className="flex items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="mr-2">Sign In</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button>Sign Up</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;