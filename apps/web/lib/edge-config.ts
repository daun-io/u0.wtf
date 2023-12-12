import { getDomainWithoutWWW } from "@u0/utils";
import { get } from "@vercel/edge-config";

export const isBlacklistedDomain = async (domain: string) => {
  let blacklistedDomains, blacklistedTerms;
  try {
    [blacklistedDomains, blacklistedTerms] = await Promise.all([
      get("domains"),
      get("terms"),
    ]);
    if (blacklistedDomains === undefined) {
      return false;
    }
  } catch (e) {
    blacklistedDomains = [];
    blacklistedTerms = [];
    return false;
  }
  const domainToTest = getDomainWithoutWWW(domain) || domain;
  return (
    blacklistedDomains.includes(domainToTest) ||
    new RegExp(blacklistedTerms.join("|")).test(domainToTest)
  );
};

export const isBlacklistedReferrer = async (referrer: string | null) => {
  const hostname = referrer ? getDomainWithoutWWW(referrer) : "(direct)";
  let referrers;
  try {
    referrers = (await get("referrers")) || [];
  } catch (e) {
    referrers = [];
  }
  return !referrers.includes(hostname);
};

export const isBlacklistedKey = async (key: string) => {
  let blacklistedKeys;
  try {
    blacklistedKeys = await get("keys");
    if (blacklistedKeys === undefined) {
      return false;
    }
  } catch (e) {
    blacklistedKeys = [];
    return false;
  }
  return new RegExp(blacklistedKeys.join("|"), "i").test(key);
};

export const isWhitelistedEmail = async (email: string) => {
  let whitelistedEmails;
  try {
    whitelistedEmails = (await get("whitelist")) || [];
  } catch (e) {
    whitelistedEmails = [];
  }
  return whitelistedEmails.includes(email);
};

export const isBlacklistedEmail = async (email: string) => {
  let blacklistedEmails;
  try {
    blacklistedEmails = (await get("emails")) || [];
  } catch (e) {
    blacklistedEmails = [];
  }
  return new RegExp(blacklistedEmails.join("|"), "i").test(email);
};

export const isReservedKey = async (key: string) => {
  if (!process.env.EDGE_CONFIG) {
    // If EDGE_CONFIG is not set, these are the default reserved keys
    return [
      "blog",
      "help",
      "pricing",
      "changelog",
      "metatags",
      "terms",
      "privacy",
      "license",
      "empty",
    ].includes(key);
  }
  let reservedKeys;
  try {
    reservedKeys = (await get("reserved")) || [];
  } catch (e) {
    reservedKeys = [];
    return [
      "blog",
      "help",
      "pricing",
      "changelog",
      "metatags",
      "terms",
      "privacy",
    ].includes(key);
  }
  return reservedKeys.includes(key);
};

export const isReservedUsername = async (key: string) => {
  let reservedUsernames;
  try {
    reservedUsernames = (await get("reservedUsernames")) || [];
  } catch (e) {
    reservedUsernames = [];
  }
  return reservedUsernames.includes(key);
};
