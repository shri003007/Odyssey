"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";
import { toast } from "sonner";
import { createOrUpdateUser } from "../app/lib/user";
import type { Profile } from "../app/lib/profiles";

interface AuthContextType {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  profileId: number | null;
  setProfileId: (id: number | null) => void;
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ALLOWED_DOMAIN = "surveysparrow.com";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const router = useRouter();

  const handleUserData = async (user: User) => {
    try {
      console.log("Attempting to create/update user:", user.uid);
      const userData = await createOrUpdateUser({
        email: user.email!,
        google_id: user.uid,
        name: user.displayName || "",
        profile_image: user.photoURL || undefined,
      });
      console.log("User data received:", userData);
      if (userData && userData.id) {
        setUserId(userData.id.toString());
      } else {
        console.error("User data is missing id:", userData);
        toast.error("Failed to retrieve user information");
      }
    } catch (error) {
      console.error("Error creating/updating user:", error);
      toast.error("Failed to update user information");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      try {
        if (user) {
          console.log("User authenticated:", user.uid);
          if (!user.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
            await signOut(auth);
            deleteCookie("auth-token");
            setUser(null);
            setUserId(null);
            router.replace("/login");
            toast.error(
              `Access restricted to @${ALLOWED_DOMAIN} email addresses only.`
            );
            return;
          }

          setUser(user);
          setCookie("auth-token", await user.getIdToken(), {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });

          await handleUserData(user);

          router.replace("/");
          toast.success("Successfully signed in!");
        } else {
          console.log("No authenticated user");
          setUser(null);
          setUserId(null);
          deleteCookie("auth-token");
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        toast.error("An error occurred during authentication");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      if (result.user) {
        if (!result.user.email?.endsWith(`@${ALLOWED_DOMAIN}`)) {
          await signOut(auth);
          throw new Error(
            `Access restricted to @${ALLOWED_DOMAIN} email addresses only.`
          );
        }

        setCookie("auth-token", await result.user.getIdToken(), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        await handleUserData(result.user);

        router.replace("/");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to sign in with Google"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      deleteCookie("auth-token");
      setUserId(null);
      router.replace("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userId,
        isLoading,
        logout,
        signInWithGoogle,
        profileId,
        setProfileId,
        profiles,
        setProfiles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
