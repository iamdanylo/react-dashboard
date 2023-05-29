import { currencies } from "constans/currency";

export const renderCurrency = (currency: string) => {
  return currencies[currency] || currency;
};
