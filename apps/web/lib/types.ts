import { DirectorySyncProviders } from "@boxyhq/saml-jackson";

export { type Link as LinkProps } from "@prisma/client";
export interface SimpleLinkProps {
  domain: string;
  key: string;
  url: string;
}
export interface TagProps {
  id: string;
  name: string;
  color: TagColorProps;
}

export type TagColorProps =
  | "red"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "brown";

export type PlanProps = "free" | "pro" | "enterprise";

export interface ProjectProps {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  usage: number;
  usageLimit: number;
  plan: PlanProps;
  stripeId?: string;
  billingCycleStart?: number;
  createdAt?: Date;
  domains?: {
    slug: string;
  }[];
  users?: {
    role: "owner" | "member";
  }[];
}

export interface ProjectWithDomainProps extends ProjectProps {
  domains: DomainProps[];
  primaryDomain?: DomainProps;
}

export interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  role: "owner" | "member";
  projects?: { projectId: string }[];
}

export type DomainVerificationStatusProps =
  | "올바르게 설정됨"
  | "유효하지 않은 설정"
  | "DNS 레코드 충돌"
  | "인증 대기중"
  | "도메인을 찾지 못함"
  | "알 수 없는 오류";

export interface DomainProps {
  slug: string;
  verified: boolean;
  primary: boolean;
  target?: string;
  type: "redirect" | "rewrite";
  placeholder?: string;
  clicks: number;
}

export interface BitlyGroupProps {
  guid: string;
  bsds: string[]; // custom domains
  tags: string[];
}

export interface ShortioDomainProps {
  id: number;
  domain: string;
  links: number;
}

export interface SAMLProviderProps {
  name: string;
  logo: string;
  saml: "okta" | "azure" | "google";
  samlModalCopy: string;
  scim: keyof typeof DirectorySyncProviders;
  scimModalCopy: {
    url: string;
    token: string;
  };
}
