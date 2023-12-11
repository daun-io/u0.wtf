import { AlertCircleFill } from "@/ui/shared/icons";
import { Button, InfoTooltip, Logo, Modal, Tooltip } from "@u0/ui";
import { HOME_DOMAIN, generateDomainFromName } from "@u0/utils";
import slugify from "@sindresorhus/slugify";
import va from "@vercel/analytics";
import { usePathname, useRouter } from "next/navigation";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import { mutate } from "swr";

function AddProjectModalHelper({
  showAddProjectModal,
  setShowAddProjectModal,
}: {
  showAddProjectModal: boolean;
  setShowAddProjectModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [slugError, setSlugError] = useState<string | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<{
    name: string;
    slug: string;
    domain: string;
  }>({
    name: "",
    slug: "",
    domain: "",
  });
  const { name, slug, domain } = data;

  const [debouncedSlug] = useDebounce(slug, 500);
  useEffect(() => {
    if (debouncedSlug.length > 0 && !slugError) {
      fetch(`/api/projects/${slug}/exists`).then(async (res) => {
        if (res.status === 200) {
          const exists = await res.json();
          setSlugError(exists === 1 ? "Slug is already in use." : null);
        }
      });
    }
  }, [debouncedSlug, slugError]);

  const [debouncedDomain] = useDebounce(domain, 500);
  useEffect(() => {
    if (debouncedDomain.length > 0 && !domainError) {
      fetch(`/api/domains/${debouncedDomain}/exists`).then(async (res) => {
        if (res.status === 200) {
          const exists = await res.json();
          setDomainError(exists === 1 ? "도메인이 이미 사용중입니다." : null);
        }
      });
    }
  }, [debouncedDomain, domainError]);

  useEffect(() => {
    setSlugError(null);
    setDomainError(null);
    setData((prev) => ({
      ...prev,
      slug: slugify(name),
      domain: generateDomainFromName(name),
    }));
  }, [name]);

  const welcomeFlow = pathname === "/welcome";

  return (
    <Modal
      showModal={showAddProjectModal}
      setShowModal={setShowAddProjectModal}
      preventDefaultClose={welcomeFlow}
      {...(welcomeFlow && { onClose: () => router.back() })}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
        <Logo />
        <h3 className="text-lg font-medium">새 브랜드 생성</h3>
        <Tooltip
          content={`"브랜드"는 웹사이트, 앱 또는 비즈니스에 대한 모든 짧은 URL을 저장하는 데 사용할 수 있는 공간입니다. '팀'이라고 생각하시면 됩니다. 팀원을 브랜드에 초대하여 함께 링크를 관리할 수 있습니다.`}
        >
          <p className="-translate-y-2 text-center text-xs text-gray-500 underline underline-offset-4 hover:text-gray-800">
            브랜드란?
          </p>
        </Tooltip>
      </div>

      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSaving(true);
          fetch("/api/projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }).then(async (res) => {
            if (res.status === 200) {
              // track project creation event
              va.track("Created Project");
              await mutate("/api/projects");
              if (welcomeFlow) {
                router.push(`/welcome?type=upgrade&slug=${slug}`);
              } else {
                router.push(`/${slug}`);
                toast.success("브랜드를 생성했습니다.");
                setShowAddProjectModal(false);
              }
            } else if (res.status === 422) {
              const {
                slugError: slugErrorResponse,
                domainError: domainErrorResponse,
              } = await res.json();

              if (slugErrorResponse) {
                setSlugError(slugErrorResponse);
                toast.error(slugErrorResponse);
              }
              if (domainErrorResponse) {
                setDomainError(domainErrorResponse);
                toast.error(domainErrorResponse);
              }
            } else {
              toast.error(res.statusText);
            }
            setSaving(false);
          });
        }}
        className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16"
      >
        <div>
          <label htmlFor="name" className="flex items-center space-x-2">
            <p className="block text-sm font-medium text-gray-700">
              브랜드 이름
            </p>
            <InfoTooltip content="U0에서 사용할 브랜드의 이름입니다." />
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              name="name"
              id="name"
              type="text"
              required
              autoFocus
              autoComplete="off"
              className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              placeholder="U0"
              value={name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              aria-invalid="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor="slug" className="flex items-center space-x-2">
            <p className="block text-sm font-medium text-gray-700">
              브랜드 식별자
            </p>
            <InfoTooltip content="U0에서 브랜드를 식별할 수 있게 해주는 고유한 URL입니다." />
          </label>
          <div className="relative mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-5 text-gray-500 sm:text-sm">
              app.u0.wtf
            </span>
            <input
              name="slug"
              id="slug"
              type="text"
              required
              autoComplete="off"
              pattern="[a-zA-Z0-9\-]+"
              className={`${
                slugError
                  ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500"
              } block w-full rounded-r-md focus:outline-none sm:text-sm`}
              placeholder="u0"
              value={slug}
              onChange={(e) => {
                setSlugError(null);
                setData({ ...data, slug: e.target.value });
              }}
              aria-invalid="true"
            />
            {slugError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleFill
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          {slugError && (
            <p className="mt-2 text-sm text-red-600" id="slug-error">
              {slugError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="domain" className="flex items-center space-x-2">
            <p className="block text-sm font-medium text-gray-700">
              커스텀 도메인
            </p>
            <InfoTooltip content="내가 소유한 짧은 URL을 호스팅할 도메인입니다. 예: yourbrand.com/link" />
          </label>
          <div className="relative mt-1 flex rounded-md shadow-sm">
            <input
              name="domain"
              id="domain"
              type="text"
              required
              autoComplete="off"
              pattern="[a-zA-Z0-9\-.]+"
              className={`${
                domainError
                  ? "border-red-300 pr-10 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:ring-gray-500"
              } block w-full rounded-md focus:outline-none sm:text-sm`}
              placeholder="u0.wtf"
              value={domain}
              onChange={(e) => {
                setDomainError(null);
                setData({ ...data, domain: e.target.value });
              }}
              aria-invalid="true"
            />
            {domainError && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircleFill
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          {domainError &&
            (domainError === "도메인이 이미 사용중입니다." ? (
              <p className="mt-2 text-sm text-red-600" id="domain-error">
                도메인이 이미 사용중입니다. 이 도메인을 브랜드에 사용하려는 경우{" "}
                <a
                  className="underline"
                  href="mailto:team@empty.app?subject=내 도메인이 이미 사용중입니다."
                >
                  연락하기
                </a>{" "}
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-600" id="domain-error">
                {domainError}
              </p>
            ))}
        </div>

        <Button
          disabled={slugError || domainError ? true : false}
          loading={saving}
          text="브랜드 생성"
        />
      </form>
    </Modal>
  );
}

export function useAddProjectModal() {
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const AddProjectModal = useCallback(() => {
    return (
      <AddProjectModalHelper
        showAddProjectModal={showAddProjectModal}
        setShowAddProjectModal={setShowAddProjectModal}
      />
    );
  }, [showAddProjectModal, setShowAddProjectModal]);

  return useMemo(
    () => ({ setShowAddProjectModal, AddProjectModal }),
    [setShowAddProjectModal, AddProjectModal],
  );
}
