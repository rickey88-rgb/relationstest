export type Market = "sv" | "no";

export const norwegian = {
  test: "/no/audhd-test",
  questionnaire: "/no/audhd-test/test",
  book: "/no/hjernen-i-kryssild",
  reportPrice: 199,
  bookPrice: 249,
  bookOffer: 149,
  withdrawalForm: "https://www.regjeringen.no/no/dokument/dep/bld/skjema/skjema-2/skjema-om-angrerett/id614564/",
} as const;

export const swedishToNorwegian: Readonly<Record<string, string>> = {
  "/audhd-test": norwegian.test,
  "/audhd": "/no/audhd",
  "/audhd-symtom-vuxna": "/no/audhd-symptomer",
  "/audhd-kvinnor": "/no/audhd-kvinner",
  "/adhd-och-autism-samtidigt": "/no/adhd-og-autisme",
  "/audhd-masking": "/no/audhd-maskering",
  "/audhd-utredning-vuxna": "/no/audhd-utredning",
};

export function marketText<T>(market: Market, swedish: T, bokmal: T): T {
  return market === "no" ? bokmal : swedish;
}

export function audhdApi(path: string, market: Market) {
  return market === "no" ? `${path}?market=no` : path;
}

export function checkoutMarket(request: { url?: string; nextUrl?: { searchParams: URLSearchParams } }): Market {
  return (request.nextUrl?.searchParams ?? (request.url ? new URL(request.url).searchParams : undefined))?.get("market") === "no" ? "no" : "sv";
}

export function marketCookie(name: string, market: Market) {
  return market === "no" ? name + "_no" : name;
}
