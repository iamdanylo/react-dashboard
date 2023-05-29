import { MemberProfile, OnboardingSettings, Status, UserType } from "./member";
import { SubscriptionDetails } from "./subscription";

export type ReferralDto = {
    _id: string;
    userType: UserType;
    email: string;
    passwordHash: string;
    lastLogin: Date;
    createdAt: Date;
    status: Status;
    brazeId: string;
    customerId: string;
    referralCode: string;
    successfulReferrals: number;
    onboardingSettings: OnboardingSettings;
    profile: MemberProfile;
    subscription: SubscriptionDetails;
}