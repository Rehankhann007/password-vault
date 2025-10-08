"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/signin"); // Root pe direct signin page open hoga
  }, [router]);

  return null; 
}
