export function getPlanFromPriceId(priceId: string) {
  const env =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "production" : "test";
  return PLANS.find(
    (plan) =>
      plan.price.monthly.priceIds[env] === priceId ||
      plan.price.yearly.priceIds[env] === priceId,
  )!;
}

// custom type coercion because Stripe's types are wrong
export function isUpgrade(
  previousAttributes:
    | {
        default_payment_method?: string;
        items?: {
          data?: {
            price?: {
              id?: string;
            }[];
          };
        };
      }
    | undefined,
) {
  const oldPriceId =
    previousAttributes?.items?.data &&
    previousAttributes?.items?.data[0].price.id;

  //
  return oldPriceId && getPlanFromPriceId(oldPriceId).slug === "pro";
}

export const PLANS = [
  {
    name: "Pro",
    slug: "pro",
    quota: 50000,
    price: {
      monthly: {
        amount: 8000,
        curreny: "krw",
        priceIds: {
          test: "price_1OL2c9DWbs4J5X5cpqyX4JuA",
          production: "price_1OL2bBDWbs4J5X5cp1wWoMbn",
        },
      },
      yearly: {
        amount: 80000,
        curreny: "krw",
        priceIds: {
          test: "price_1OL2cVDWbs4J5X5cOqREZtC6",
          production: "price_1OL2bBDWbs4J5X5c3yM4DcUt",
        },
      },
    },
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    quota: 1000000000, // arbitrary large number to represent unlimited – might need to change this in the future
    price: {
      monthly: {
        amount: 49000,
        curreny: "krw",
        priceIds: {
          test: "price_1LoyrCAlJJEpqkPVZ32BV3wm",
          production: "price_1OLPsEDWbs4J5X5cYOqgUDkQ",
        },
      },
      yearly: {
        amount: 490000,
        curreny: "krw",
        priceIds: {
          test: "price_1LoyrCAlJJEpqkPVgIlNG23q",
          production: "price_1OLPsnDWbs4J5X5cSmL68KlC",
        },
      },
    },
  },
];
