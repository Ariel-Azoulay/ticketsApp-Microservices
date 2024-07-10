import Stripe from "stripe";

export const stripe = new Stripe(
  "sk_test_51PaExe2LrTUkiI1LtFnwvJZfKvOepJg2TR9vJOISDn07MKccMpmhOG8LqADiapktBXHbTfAg7xZG9Pxplsjqby4400VgxE2I5g",
  {
    apiVersion: "2022-11-15",
  }
);
