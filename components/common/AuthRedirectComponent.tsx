"use client";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function AuthRedirectComponent() {
  useAuthRedirect();
  return null; // This component doesn't render anything visible
}
