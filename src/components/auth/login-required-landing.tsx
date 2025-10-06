"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts/app";
import { useTranslations } from "next-intl";
import { LockKeyhole } from "lucide-react";

interface LoginRequiredLandingProps {
  titleKey: string;
  descriptionKey: string;
}

export default function LoginRequiredLanding({ 
  titleKey, 
  descriptionKey 
}: LoginRequiredLandingProps) {
  const t = useTranslations();
  const { setShowSignModal } = useAppContext();

  const handleSignIn = () => {
    setShowSignModal(true);
  };

  return (
    <div className="container flex items-center justify-center min-h-[60vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <LockKeyhole className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t(titleKey)}</CardTitle>
          <CardDescription className="text-base">
            {t(descriptionKey)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignIn} 
            className="w-full"
            size="lg"
          >
            {t("login_required.sign_in_button")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
