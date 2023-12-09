import useProject from "@/lib/swr/use-project";
import { ModalContext } from "@/ui/modals/provider";
import {
  InfoTooltip,
  SimpleTooltipContent,
  Switch,
  TooltipContent,
} from "@u0/ui";
import { COUNTRIES, FADE_IN_ANIMATION_SETTINGS, HOME_DOMAIN } from "@u0/utils";
import { type Link as LinkProps } from "@prisma/client";
import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export default function GeoSection({
  props,
  data,
  setData,
}: {
  props?: LinkProps;
  data: LinkProps;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) {
  const { plan } = useProject();
  const { setShowUpgradePlanModal } = useContext(ModalContext);
  const { geo } = data;
  const [enabled, setEnabled] = useState(!!geo);

  useEffect(() => {
    if (enabled) {
      // if enabling, add previous geo data if exists
      setData({
        ...data,
        geo: props?.geo || {
          "": "",
        },
      });
    } else {
      // if disabling, remove geo data
      setData({ ...data, geo: null });
    }
  }, [enabled]);

  const addGeoSelector = () => {
    setData((prev) => ({
      ...prev,
      geo: { ...((prev.geo as object) || {}), "": "" }, // Add an empty entry
    }));
  };

  return (
    <div className="relative border-b border-gray-200 pb-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between space-x-2">
          <h2 className="text-sm font-medium text-gray-900">지역 타게팅</h2>
          <InfoTooltip
            content={
              <SimpleTooltipContent title="유저를 지역에 따라 다른 링크로 리다이렉트합니다." />
            }
          />
        </div>
        <Switch
          fn={() => setEnabled(!enabled)}
          checked={enabled}
          // geo targeting is only available on Dub's Pro plan
          {...(!plan || plan === "free"
            ? {
                disabledTooltip: (
                  <TooltipContent
                    title="지역 타게팅 기능은 프로로 업그레이드한 이후에 사용할 수 있습니다."
                    cta="프로로 업그레이드"
                    {...(plan === "free"
                      ? {
                          onClick: () => setShowUpgradePlanModal(true),
                        }
                      : {
                          href: `${HOME_DOMAIN}/pricing`,
                        })}
                  />
                ),
              }
            : {})}
        />
      </div>
      {enabled && (
        <motion.div className="mt-3 grid gap-2" {...FADE_IN_ANIMATION_SETTINGS}>
          {geo &&
            Object.entries(geo).map(([country, url]) => (
              <GeoSelector
                key={country}
                country={country}
                url={url}
                setData={setData}
              />
            ))}
          <button
            type="button"
            onClick={addGeoSelector}
            className="mt-2 rounded-md border border-gray-200 bg-white p-1 text-sm text-gray-400 transition-all duration-75 hover:border-gray-400 hover:text-gray-500 active:bg-gray-50"
          >
            Add location
          </button>
        </motion.div>
      )}
    </div>
  );
}

const GeoSelector = ({
  country,
  url,
  setData,
}: {
  country: string;
  url: string;
  setData: Dispatch<SetStateAction<LinkProps>>;
}) => {
  const removeGeoSelector = (countryToRemove: string) => {
    setData((prev) => {
      const { [countryToRemove]: _, ...rest } = prev.geo as {
        [key: string]: string;
      };
      return {
        ...prev,
        geo: Object.keys(rest).length ? rest : null,
      };
    });
  };

  return (
    <div className="flex justify-between space-x-2">
      <div className="relative flex flex-1 rounded-md shadow-sm">
        <select
          id={`geo-selector-${country}`}
          value={country}
          onChange={(e) => {
            removeGeoSelector(country);
            setData((prev) => ({
              ...prev,
              geo: {
                ...((prev.geo as object) || {}),
                [e.target.value]: url,
              },
            }));
          }}
          className="flex w-28 items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 pl-3 pr-7 text-center text-sm text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-0"
        >
          <option value="" disabled selected={!country}>
            Country
          </option>
          {Object.entries(COUNTRIES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <input
          type="url"
          name="geo-url"
          required
          autoComplete="off"
          className="block w-full rounded-r-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
          value={url}
          placeholder="URL"
          onChange={(e) => {
            setData((prev) => ({
              ...prev,
              geo: {
                ...((prev.geo as object) || {}),
                [country]: e.target.value,
              },
            }));
          }}
        />
      </div>
      <button
        type="button"
        onClick={() => removeGeoSelector(country)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-400 transition-all duration-75 hover:border-gray-400 hover:text-gray-500 active:bg-gray-50"
      >
        <Trash size={16} className="text-gray-400" />
      </button>
    </div>
  );
};
