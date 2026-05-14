import { SignIn } from "@clerk/nextjs";
import React from "react";
import AuthWrapper from "../../AuthWrapper";
import { cyberClerkAppearance } from "@/lib/clerkTheme";

const page = () => {
  return (
    <AuthWrapper>
      <SignIn appearance={cyberClerkAppearance} />
    </AuthWrapper>
  );
};

export default page;
