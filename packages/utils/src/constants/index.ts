export const LOCALHOST_GEO_DATA = {
  city: "San Francisco",
  region: "CA",
  country: "US",
  latitude: "37.7695",
  longitude: "-122.385",
};
export const LOCALHOST_IP = "63.141.57.109";

export const FRAMER_MOTION_LIST_ITEM_VARIANTS = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: "spring" } },
};

export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

export const SWIPE_REVEAL_ANIMATION_SETTINGS = {
  initial: { height: 0 },
  animate: { height: "auto" },
  exit: { height: 0 },
  transition: { duration: 0.15, ease: "easeOut" },
};

export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const PAGINATION_LIMIT = 100;

export const HOME_DOMAIN = "https://u0.wtf";

export const APP_HOSTNAMES = new Set([
  "app.u0.wtf",
  "preview.u0.wtf",
  "localhost:8888",
  "localhost",
]);

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://app.u0.wtf"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://preview.u0.wtf"
    : "http://localhost:8888";

export const APP_DOMAIN_WITH_NGROK =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://app.u0.wtf"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://preview.u0.wtf"
    : process.env.NGROK_URL;

export const API_HOSTNAMES = new Set([
  "api.u0.wtf",
  "api.u0.wtf",
  "api.localhost:8888",
]);

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://api.u0.wtf"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? "https://api.u0.wtf"
    : "http://api.localhost:8888";

export const ADMIN_HOSTNAMES = new Set([
  "admin.u0.wtf",
  "admin.localhost:8888",
]);

export const DEFAULT_REDIRECTS = {
  home: "https://u0.wtf",
  dub: "https://u0.wtf",
  u0: "https://u0.wtf",
  signin: "https://app.u0.wtf/login",
  login: "https://app.u0.wtf/login",
  register: "https://app.u0.wtf/register",
  signup: "https://app.u0.wtf/register",
  app: "https://app.u0.wtf",
  dashboard: "https://app.u0.wtf",
  links: "https://app.u0.wtf/links",
  settings: "https://app.u0.wtf/settings",
  welcome: "https://app.u0.wtf/welcome",
};

export const DUB_HEADERS = {
  headers: {
    "x-powered-by": "U0.wtf - Link management for modern marketing teams",
  },
};

export const FAVICON_FOLDER = "/_static/favicons";
export const GOOGLE_FAVICON_URL =
  "https://www.google.com/s2/favicons?sz=64&domain_url=";

export const U0_LOGO = "https://u0.wtf/_static/logo.png";
export const DUB_THUMBNAIL = "https://u0.wtf/_static/thumbnail.jpg";

export const SHOW_BACKGROUND_SEGMENTS = [
  "tools",
  "pricing",
  "help",
  "features",
  "compare",
  "customers",
  "blog",
  "(blog-post)",
  "login",
  "register",
  "auth",
];

export const DUB_DOMAINS = [
  {
    slug: "u0.wtf",
    verified: true,
    primary: true,
    target: "https://u0.wtf",
    type: "redirect",
    placeholder: "https://u0.wtf/help/article/what-is-u0",
    clicks: 0,
    allowedHostnames: [],
  },
  {
    slug: "empty.app",
    verified: true,
    primary: true,
    target: "https://empty.app",
    type: "redirect",
    placeholder: "https://u0.wtf/help/article/what-is-u0",
    clicks: 0,
    allowedHostnames: [],
  },
];

export const ALL_TOOLS = [
  { name: "Metatags API", slug: "metatags" },
  { name: "QR Code Generator", slug: "qr-code" },
  { name: "Link Inspector", slug: "inspector" },
];

export { default as ccTLDs } from "./cctlds";
export { default as COUNTRIES } from "./countries";

export const SECOND_LEVEL_DOMAINS = new Set([
  "com",
  "co",
  "net",
  "org",
  "edu",
  "gov",
  "in",
]);

export const SPECIAL_APEX_DOMAINS = new Set([
  "my.id",
  "github.io",
  "vercel.app",
  "now.sh",
  "pages.dev",
  "webflow.io",
  "netlify.app",
  "fly.dev",
  "web.app",
]);

export const DEFAULT_LINK_PROPS = {
  key: "",
  url: "",
  domain: "",
  archived: false,
  expiresAt: null,
  password: null,

  title: null,
  description: null,
  image: null,
  rewrite: false,
  ios: null,
  android: null,

  clicks: 0,
  userId: "",

  proxy: false,
};

export const DUB_PROJECT_ID = "cl7pj5kq4006835rbjlt2ofka";

export const SAML_PROVIDERS = [
  {
    name: "Okta",
    logo: "/_static/icons/okta.svg",
    saml: "okta",
    samlModalCopy: "Metadata URL",
    scim: "okta-scim-v2",
    scimModalCopy: {
      url: "SCIM 2.0 Base URL",
      token: "OAuth Bearer Token",
    },
    wip: false,
  },
  {
    name: "Azure AD",
    logo: "/_static/icons/azure.svg",
    saml: "azure",
    samlModalCopy: "App Federation Metadata URL",
    scim: "azure-scim-v2",
    scimModalCopy: {
      url: "Tenant URL",
      token: "Secret Token",
    },
    wip: false,
  },
  {
    name: "Google",
    logo: "/_static/icons/google.svg",
    saml: "google",
    samlModalCopy: "XML Metadata File",
    scim: "google",
    scimModalCopy: {
      url: "SCIM 2.0 Base URL",
      token: "OAuth Bearer Token",
    },
    wip: false,
  },
];
