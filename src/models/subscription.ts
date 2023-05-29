export type SubscriptionDetails = {
  stripeSubscriptionId: string;
  productName: string;
  productId: string;
  priceId: string;
  amount: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
  status: SubscriptionStatus;
  startedAt: string;
};

export enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  ACTIVE_CANCELED = 'active_canceled',
}