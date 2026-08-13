"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Step = "interest" | "propertyType" | "propertyUse" | "refinance" | "homeLoan" | "done";

const INTEREST_OPTIONS = [
  { value: "buy", label: "Buy a home" },
  { value: "refinance", label: "Refinance" },
  { value: "homeLoan", label: "Home loan" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "singleFamily", label: "Single Family" },
  { value: "multifamily", label: "Multifamily" },
  { value: "condo", label: "Condo" },
  { value: "manufactured", label: "Manufactured" },
];

const PROPERTY_USE_OPTIONS = [
  { value: "primary", label: "Primary residence" },
  { value: "vacation", label: "Vacation home" },
  { value: "investment", label: "Investment property" },
];

function QuestionCard({
  prompt,
  options,
  value,
  onValueChange,
  onNext,
  onBack,
}: {
  prompt: string;
  options: { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{prompt}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <RadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <Label
              key={option.value}
              className="cursor-pointer rounded-lg border border-border p-4 transition-colors hover:bg-muted has-data-checked:border-primary has-data-checked:bg-muted"
            >
              <RadioGroupItem value={option.value} />
              {option.label}
            </Label>
          ))}
        </RadioGroup>
        <div className="flex items-center justify-between">
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          ) : (
            <span />
          )}
          <Button size="lg" disabled={!value} onClick={onNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("interest");
  const [interest, setInterest] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUse, setPropertyUse] = useState("");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-10 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Sullivan Home Loans
        </h1>

        {step === "interest" && (
          <QuestionCard
            prompt="What are you interested in?"
            options={INTEREST_OPTIONS}
            value={interest}
            onValueChange={setInterest}
            onNext={() =>
              setStep(
                interest === "buy"
                  ? "propertyType"
                  : interest === "refinance"
                    ? "refinance"
                    : "homeLoan"
              )
            }
          />
        )}

        {step === "propertyType" && (
          <QuestionCard
            prompt="What’s the property type?"
            options={PROPERTY_TYPE_OPTIONS}
            value={propertyType}
            onValueChange={setPropertyType}
            onNext={() => setStep("propertyUse")}
            onBack={() => setStep("interest")}
          />
        )}

        {step === "propertyUse" && (
          <QuestionCard
            prompt="How would you describe the property?"
            options={PROPERTY_USE_OPTIONS}
            value={propertyUse}
            onValueChange={setPropertyUse}
            onNext={() => setStep("done")}
            onBack={() => setStep("propertyType")}
          />
        )}

        {(step === "refinance" || step === "homeLoan") && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">
                {step === "refinance" ? "Refinance" : "Home loan"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <p className="text-muted-foreground">
                We’re putting the finishing touches on this experience. Check
                back soon.
              </p>
              <div className="flex justify-start">
                <Button variant="ghost" onClick={() => setStep("interest")}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "done" && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-xl">Thanks!</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <p className="text-muted-foreground">
                We’ve got what we need to get started on your home purchase.
              </p>
              <div className="flex justify-start">
                <Button variant="ghost" onClick={() => setStep("propertyUse")}>
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
