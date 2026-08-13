"use server";

import { getMongoClient } from "@/lib/mongodb";

const PROPERTY_TYPES = new Set([
  "singleFamily",
  "multifamily",
  "condo",
  "manufactured",
]);
const CREDIT_PROFILES = new Set([
  "720plus",
  "660to719",
  "620to659",
  "580to619",
  "579orBelow",
]);
const PROPERTY_USES = new Set(["primary", "vacation", "investment"]);
const BUYING_STAGES = new Set([
  "signedPurchaseAgreement",
  "researching",
  "lookingAtHomes",
  "offerPending",
]);
const LATE_PAYMENTS: Record<string, number> = { none: 0, "1": 1, "2": 2 };
const WORK_STATUSES = new Set([
  "employed",
  "selfEmployed",
  "retired",
  "notEmployed",
]);
const REFINANCE_REASONS = new Set([
  "cashOut",
  "lowerPayment",
  "compareRates",
  "payOffFaster",
  "armToFixed",
]);
const YES_NO = new Set(["yes", "no"]);

export type LeadSubmission = {
  flow: string;
  propertyType: string;
  creditProfile: string;
  bankruptcy: string;
  buy?: {
    propertyUse: string;
    buyingStage: string;
    purchasePrice: string;
    downPayment: string;
    latePayments: string;
    foreclosure: string;
  };
  refinance?: {
    secondMortgage: string;
    veteran: string;
    workStatus: string;
    reason: string;
    homeValue: string;
    mortgageBalance: string;
  };
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
};

type SubmitResult = { ok: true } | { ok: false; error: string };

function parseAmount(value: string): number | null {
  const amount = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function trimmed(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function submitLead(
  submission: LeadSubmission
): Promise<SubmitResult> {
  const invalid: SubmitResult = {
    ok: false,
    error: "Some of your answers were missing or invalid. Please review them.",
  };

  if (
    (submission.flow !== "buy" && submission.flow !== "refinance") ||
    !PROPERTY_TYPES.has(submission.propertyType) ||
    !CREDIT_PROFILES.has(submission.creditProfile) ||
    !YES_NO.has(submission.bankruptcy)
  ) {
    return invalid;
  }

  const contact = {
    firstName: trimmed(submission.contact?.firstName),
    lastName: trimmed(submission.contact?.lastName),
    phone: trimmed(submission.contact?.phone),
    email: trimmed(submission.contact?.email),
    address: {
      street: trimmed(submission.contact?.address),
      city: trimmed(submission.contact?.city),
      state: trimmed(submission.contact?.state),
      zip: trimmed(submission.contact?.zip),
    },
  };
  if (
    !contact.firstName ||
    !contact.lastName ||
    !contact.phone ||
    !contact.email ||
    !contact.address.street ||
    !contact.address.city ||
    !contact.address.state ||
    !contact.address.zip
  ) {
    return invalid;
  }

  let flowFields;
  if (submission.flow === "buy") {
    const buy = submission.buy;
    const purchasePrice = buy ? parseAmount(buy.purchasePrice) : null;
    const downPayment = buy ? parseAmount(buy.downPayment) : null;
    if (
      !buy ||
      !PROPERTY_USES.has(buy.propertyUse) ||
      !BUYING_STAGES.has(buy.buyingStage) ||
      purchasePrice === null ||
      downPayment === null ||
      !(buy.latePayments in LATE_PAYMENTS) ||
      !YES_NO.has(buy.foreclosure)
    ) {
      return invalid;
    }
    flowFields = {
      buy: {
        propertyUse: buy.propertyUse,
        buyingStage: buy.buyingStage,
        purchasePrice,
        downPayment,
        latePayments: LATE_PAYMENTS[buy.latePayments],
        hadForeclosure: buy.foreclosure === "yes",
      },
    };
  } else {
    const refinance = submission.refinance;
    const homeValue = refinance ? parseAmount(refinance.homeValue) : null;
    const mortgageBalance = refinance
      ? parseAmount(refinance.mortgageBalance)
      : null;
    if (
      !refinance ||
      !YES_NO.has(refinance.secondMortgage) ||
      !YES_NO.has(refinance.veteran) ||
      !WORK_STATUSES.has(refinance.workStatus) ||
      !REFINANCE_REASONS.has(refinance.reason) ||
      homeValue === null ||
      mortgageBalance === null
    ) {
      return invalid;
    }
    flowFields = {
      refinance: {
        hasSecondMortgage: refinance.secondMortgage === "yes",
        isVeteranOrActiveMilitary: refinance.veteran === "yes",
        workStatus: refinance.workStatus,
        reason: refinance.reason,
        homeValue,
        mortgageBalance,
      },
    };
  }

  try {
    const client = await getMongoClient();
    await client.db().collection("leads").insertOne({
      createdAt: new Date(),
      status: "new",
      flow: submission.flow,
      propertyType: submission.propertyType,
      creditProfile: submission.creditProfile,
      hadBankruptcy: submission.bankruptcy === "yes",
      ...flowFields,
      contact,
    });
    return { ok: true };
  } catch (error) {
    console.error("Failed to save lead", error);
    return {
      ok: false,
      error: "We couldn’t save your information. Please try again.",
    };
  }
}
