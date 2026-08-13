"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Step =
  | "interest"
  | "propertyType"
  | "propertyUse"
  | "buyingStage"
  | "purchasePrice"
  | "downPayment"
  | "creditProfile"
  | "latePayments"
  | "foreclosure"
  | "buyBankruptcy"
  | "secondMortgage"
  | "veteran"
  | "workStatus"
  | "bankruptcy"
  | "refinancePropertyType"
  | "refinanceReason"
  | "refinanceCreditProfile"
  | "homeValue"
  | "mortgageBalance"
  | "name"
  | "phone"
  | "email"
  | "address"
  | "summary";

const INTEREST_OPTIONS = [
  { value: "buy", label: "Buy a home" },
  { value: "refinance", label: "Refinance" },
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

const BUYING_STAGE_OPTIONS = [
  { value: "signedPurchaseAgreement", label: "Signed Purchase Agreement" },
  { value: "researching", label: "Researching" },
  { value: "lookingAtHomes", label: "Looking at homes and listings" },
  { value: "offerPending", label: "Offer pending / found a house" },
];

const CREDIT_PROFILE_OPTIONS = [
  { value: "720plus", label: "720 +" },
  { value: "660to719", label: "660-719" },
  { value: "620to659", label: "620-659" },
  { value: "580to619", label: "580-619" },
  { value: "579orBelow", label: "579 or below" },
];

const LATE_PAYMENT_OPTIONS = [
  { value: "none", label: "None" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const WORK_STATUS_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "selfEmployed", label: "Self-employed" },
  { value: "retired", label: "Retired" },
  { value: "notEmployed", label: "Not employed" },
];

const REFINANCE_REASON_OPTIONS = [
  { value: "cashOut", label: "Take cash out" },
  { value: "lowerPayment", label: "Lower my monthly payment" },
  { value: "compareRates", label: "Compare rate options" },
  { value: "payOffFaster", label: "Pay off loan faster" },
  { value: "armToFixed", label: "Change ARM to fixed" },
];

const CONFETTI_COLORS = [
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 80 }, (_, id) => ({
      id,
      color: CONFETTI_COLORS[id % CONFETTI_COLORS.length],
      tx: (Math.random() - 0.5) * 90,
      ty: -(5 + Math.random() * 30),
      rot: (Math.random() - 0.5) * 1080,
      delay: Math.random() * 0.15,
      duration: 2.2 + Math.random() * 1.3,
      width: 6 + Math.random() * 6,
      height: 4 + Math.random() * 4,
    }))
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={
            {
              backgroundColor: piece.color,
              width: piece.width,
              height: piece.height,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--tx": `${piece.tx}vw`,
              "--ty": `${piece.ty}vh`,
              "--rot": `${piece.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function labelFor(
  options: { value: string; label: string }[],
  value: string
) {
  return options.find((option) => option.value === value)?.label ?? "";
}

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

function InputCard({
  prompt,
  nextDisabled,
  onNext,
  onBack,
  children,
}: {
  prompt: string;
  nextDisabled: boolean;
  onNext: () => void;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{prompt}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {children}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button size="lg" disabled={nextDisabled} onClick={onNext}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AmountField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Label className="flex-col items-start gap-2">
      {label}
      <div className="relative w-full">
        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          className="pl-7"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </Label>
  );
}

function TextField({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.ComponentProps<typeof Input>, "value" | "onChange">) {
  return (
    <Label className="flex-col items-start gap-2">
      {label}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </Label>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>("interest");
  const [interest, setInterest] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUse, setPropertyUse] = useState("");
  const [buyingStage, setBuyingStage] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [creditProfile, setCreditProfile] = useState("");
  const [latePayments, setLatePayments] = useState("");
  const [foreclosure, setForeclosure] = useState("");
  const [secondMortgage, setSecondMortgage] = useState("");
  const [veteran, setVeteran] = useState("");
  const [workStatus, setWorkStatus] = useState("");
  const [bankruptcy, setBankruptcy] = useState("");
  const [refinanceReason, setRefinanceReason] = useState("");
  const [homeValue, setHomeValue] = useState("");
  const [mortgageBalance, setMortgageBalance] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const isBuy = interest === "buy";

  const summaryEntries: { label: string; value: string }[] = [
    { label: "Interested in", value: labelFor(INTEREST_OPTIONS, interest) },
    ...(isBuy
      ? [
          {
            label: "Property type",
            value: labelFor(PROPERTY_TYPE_OPTIONS, propertyType),
          },
          {
            label: "Property use",
            value: labelFor(PROPERTY_USE_OPTIONS, propertyUse),
          },
          {
            label: "Home buying stage",
            value: labelFor(BUYING_STAGE_OPTIONS, buyingStage),
          },
          { label: "Purchase price", value: `$${purchasePrice}` },
          { label: "Down payment", value: `$${downPayment}` },
          {
            label: "Credit profile",
            value: labelFor(CREDIT_PROFILE_OPTIONS, creditProfile),
          },
          {
            label: "Late mortgage payments (past 12 months)",
            value: labelFor(LATE_PAYMENT_OPTIONS, latePayments),
          },
          {
            label: "Foreclosure (past 3 years)",
            value: labelFor(YES_NO_OPTIONS, foreclosure),
          },
          {
            label: "Bankruptcies (past 3 years)",
            value: labelFor(YES_NO_OPTIONS, bankruptcy),
          },
        ]
      : [
          {
            label: "Second mortgage",
            value: labelFor(YES_NO_OPTIONS, secondMortgage),
          },
          {
            label: "Veteran or active duty U.S. military",
            value: labelFor(YES_NO_OPTIONS, veteran),
          },
          {
            label: "Work status",
            value: labelFor(WORK_STATUS_OPTIONS, workStatus),
          },
          {
            label: "Bankruptcies (past 3 years)",
            value: labelFor(YES_NO_OPTIONS, bankruptcy),
          },
          {
            label: "Property type",
            value: labelFor(PROPERTY_TYPE_OPTIONS, propertyType),
          },
          {
            label: "Refinance interest",
            value: labelFor(REFINANCE_REASON_OPTIONS, refinanceReason),
          },
          {
            label: "Credit profile",
            value: labelFor(CREDIT_PROFILE_OPTIONS, creditProfile),
          },
          { label: "Estimated home value", value: `$${homeValue}` },
          { label: "Remaining mortgage", value: `$${mortgageBalance}` },
        ]),
    { label: "Name", value: `${firstName} ${lastName}` },
    { label: "Phone", value: phone },
    { label: "Email", value: email },
    { label: "Mailing address", value: `${address}, ${city}, ${state} ${zip}` },
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center gap-10 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          Fido Home Loans Demo
        </h1>

        {step === "interest" && (
          <QuestionCard
            prompt="What are you interested in?"
            options={INTEREST_OPTIONS}
            value={interest}
            onValueChange={setInterest}
            onNext={() =>
              setStep(isBuy ? "propertyType" : "secondMortgage")
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
            onNext={() => setStep("buyingStage")}
            onBack={() => setStep("propertyType")}
          />
        )}

        {step === "buyingStage" && (
          <QuestionCard
            prompt="Where in the home buying process are you?"
            options={BUYING_STAGE_OPTIONS}
            value={buyingStage}
            onValueChange={setBuyingStage}
            onNext={() => setStep("purchasePrice")}
            onBack={() => setStep("propertyUse")}
          />
        )}

        {step === "purchasePrice" && (
          <InputCard
            prompt="What purchase price do you have in mind?"
            nextDisabled={!purchasePrice.trim()}
            onNext={() => setStep("downPayment")}
            onBack={() => setStep("buyingStage")}
          >
            <AmountField
              label="Purchase price"
              placeholder="350,000"
              value={purchasePrice}
              onChange={setPurchasePrice}
            />
          </InputCard>
        )}

        {step === "downPayment" && (
          <InputCard
            prompt="How much do you plan to use for a down payment?"
            nextDisabled={!downPayment.trim()}
            onNext={() => setStep("creditProfile")}
            onBack={() => setStep("purchasePrice")}
          >
            <AmountField
              label="Down payment amount"
              placeholder="70,000"
              value={downPayment}
              onChange={setDownPayment}
            />
          </InputCard>
        )}

        {step === "creditProfile" && (
          <QuestionCard
            prompt="Your credit profile"
            options={CREDIT_PROFILE_OPTIONS}
            value={creditProfile}
            onValueChange={setCreditProfile}
            onNext={() => setStep("latePayments")}
            onBack={() => setStep("downPayment")}
          />
        )}

        {step === "latePayments" && (
          <QuestionCard
            prompt="Number of late mortgage payments in the past 12 months?"
            options={LATE_PAYMENT_OPTIONS}
            value={latePayments}
            onValueChange={setLatePayments}
            onNext={() => setStep("foreclosure")}
            onBack={() => setStep("creditProfile")}
          />
        )}

        {step === "foreclosure" && (
          <QuestionCard
            prompt="Any foreclosure in the past 3 years?"
            options={YES_NO_OPTIONS}
            value={foreclosure}
            onValueChange={setForeclosure}
            onNext={() => setStep("buyBankruptcy")}
            onBack={() => setStep("latePayments")}
          />
        )}

        {step === "buyBankruptcy" && (
          <QuestionCard
            prompt="Any bankruptcies in the past 3 years?"
            options={YES_NO_OPTIONS}
            value={bankruptcy}
            onValueChange={setBankruptcy}
            onNext={() => setStep("name")}
            onBack={() => setStep("foreclosure")}
          />
        )}

        {step === "secondMortgage" && (
          <QuestionCard
            prompt="Do you have a second mortgage on this property?"
            options={YES_NO_OPTIONS}
            value={secondMortgage}
            onValueChange={setSecondMortgage}
            onNext={() => setStep("veteran")}
            onBack={() => setStep("interest")}
          />
        )}

        {step === "veteran" && (
          <QuestionCard
            prompt="Are you a veteran or active duty U.S. military?"
            options={YES_NO_OPTIONS}
            value={veteran}
            onValueChange={setVeteran}
            onNext={() => setStep("workStatus")}
            onBack={() => setStep("secondMortgage")}
          />
        )}

        {step === "workStatus" && (
          <QuestionCard
            prompt="What is your work status?"
            options={WORK_STATUS_OPTIONS}
            value={workStatus}
            onValueChange={setWorkStatus}
            onNext={() => setStep("bankruptcy")}
            onBack={() => setStep("veteran")}
          />
        )}

        {step === "bankruptcy" && (
          <QuestionCard
            prompt="Any bankruptcies in the past 3 years?"
            options={YES_NO_OPTIONS}
            value={bankruptcy}
            onValueChange={setBankruptcy}
            onNext={() => setStep("refinancePropertyType")}
            onBack={() => setStep("workStatus")}
          />
        )}

        {step === "refinancePropertyType" && (
          <QuestionCard
            prompt="What’s the property type?"
            options={PROPERTY_TYPE_OPTIONS}
            value={propertyType}
            onValueChange={setPropertyType}
            onNext={() => setStep("refinanceReason")}
            onBack={() => setStep("bankruptcy")}
          />
        )}

        {step === "refinanceReason" && (
          <QuestionCard
            prompt="Why are you most interested in refinancing?"
            options={REFINANCE_REASON_OPTIONS}
            value={refinanceReason}
            onValueChange={setRefinanceReason}
            onNext={() => setStep("refinanceCreditProfile")}
            onBack={() => setStep("refinancePropertyType")}
          />
        )}

        {step === "refinanceCreditProfile" && (
          <QuestionCard
            prompt="Your credit profile"
            options={CREDIT_PROFILE_OPTIONS}
            value={creditProfile}
            onValueChange={setCreditProfile}
            onNext={() => setStep("homeValue")}
            onBack={() => setStep("refinanceReason")}
          />
        )}

        {step === "homeValue" && (
          <InputCard
            prompt="What’s an estimate of your current home value?"
            nextDisabled={!homeValue.trim()}
            onNext={() => setStep("mortgageBalance")}
            onBack={() => setStep("refinanceCreditProfile")}
          >
            <AmountField
              label="Estimated home value"
              placeholder="400,000"
              value={homeValue}
              onChange={setHomeValue}
            />
          </InputCard>
        )}

        {step === "mortgageBalance" && (
          <InputCard
            prompt="About how much is left on your mortgage?"
            nextDisabled={!mortgageBalance.trim()}
            onNext={() => setStep("name")}
            onBack={() => setStep("homeValue")}
          >
            <AmountField
              label="Remaining mortgage amount"
              placeholder="250,000"
              value={mortgageBalance}
              onChange={setMortgageBalance}
            />
          </InputCard>
        )}

        {step === "name" && (
          <InputCard
            prompt="What’s your name?"
            nextDisabled={!firstName.trim() || !lastName.trim()}
            onNext={() => setStep("phone")}
            onBack={() =>
              setStep(isBuy ? "buyBankruptcy" : "mortgageBalance")
            }
          >
            <TextField
              label="First name"
              autoComplete="given-name"
              placeholder="Jane"
              value={firstName}
              onChange={setFirstName}
            />
            <TextField
              label="Last name"
              autoComplete="family-name"
              placeholder="Smith"
              value={lastName}
              onChange={setLastName}
            />
          </InputCard>
        )}

        {step === "phone" && (
          <InputCard
            prompt="Phone number"
            nextDisabled={!phone.trim()}
            onNext={() => setStep("email")}
            onBack={() => setStep("name")}
          >
            <TextField
              label="Phone number"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={setPhone}
            />
          </InputCard>
        )}

        {step === "email" && (
          <InputCard
            prompt="Email"
            nextDisabled={!email.trim()}
            onNext={() => setStep("address")}
            onBack={() => setStep("phone")}
          >
            <TextField
              label="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={email}
              onChange={setEmail}
            />
          </InputCard>
        )}

        {step === "address" && (
          <InputCard
            prompt="Current mailing address"
            nextDisabled={
              !address.trim() || !city.trim() || !state.trim() || !zip.trim()
            }
            onNext={() => setStep("summary")}
            onBack={() => setStep("email")}
          >
            <TextField
              label="Address"
              autoComplete="address-line1"
              placeholder="123 Main St"
              value={address}
              onChange={setAddress}
            />
            <TextField
              label="City"
              autoComplete="address-level2"
              placeholder="Springfield"
              value={city}
              onChange={setCity}
            />
            <div className="flex gap-4">
              <TextField
                label="State"
                autoComplete="address-level1"
                placeholder="CA"
                value={state}
                onChange={setState}
              />
              <TextField
                label="Zip"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="90210"
                value={zip}
                onChange={setZip}
              />
            </div>
          </InputCard>
        )}

        {step === "summary" && (
          <Card className="w-full max-w-md">
            <Confetti />
            <CardHeader>
              <CardTitle className="text-xl">Here’s what we got</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <p className="font-bold">Thanks! We will contact you shortly.</p>
              <dl className="flex flex-col gap-3">
                {summaryEntries.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {entry.label}
                    </dt>
                    <dd className="text-right text-sm font-medium">
                      {entry.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex justify-start">
                <Button variant="ghost" onClick={() => setStep("address")}>
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
