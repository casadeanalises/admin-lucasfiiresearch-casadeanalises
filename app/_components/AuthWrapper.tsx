"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoggedInHome } from "../(home)/LoggedInHome";

export function AuthWrapper() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.replace("/login");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return <div>Carregando...</div>;
  }

  if (!userId) {
    return null;
  }

  return <LoggedInHome />;
}
