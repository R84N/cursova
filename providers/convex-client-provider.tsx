"use client";

// Провайдер для бд і авторизації

// Імпортуємо залежності

import { ClerkProvider, SignIn, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  AuthLoading,
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import Loading from "@/components/auth/loading";

// Типізуємо пропси 
interface ConvexClientProviderProps {
  children: React.ReactNode;
}

// Посилання на Convex

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

// Змінна, яку треба передати в ConvexProviderWithClerk

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider publishableKey="pk_test_bW9kZXJuLWJvYS00NC5jbGVyay5hY2NvdW50cy5kZXYk">
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
        <Unauthenticated>
          <SignIn />
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
