import { ModalContext } from "@/ui/modals/provider";
import va from "@vercel/analytics";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useContext } from "react";

export default function ProBanner({
  setShowProBanner,
}: {
  setShowProBanner: Dispatch<SetStateAction<boolean>>;
}) {
  const { slug } = useParams() as { slug: string };
  const { setShowUpgradePlanModal } = useContext(ModalContext);
  return (
    <div className="fixed bottom-5 z-10 mx-5 flex flex-col space-y-3 rounded-lg border border-gray-200 bg-white p-5 shadow-lg sm:right-5 sm:mx-auto sm:max-w-sm">
      <h3 className="text-lg font-semibold">프로로 업그레이드</h3>
      <p className="text-sm text-gray-500">
        현재 무료 요금제를 사용 중인 것 같습니다. 업그레이드를 고려해보세요.
        Pro로 업그레이드하여 더 높은 한도, 추가 기능, 우선순위 지원을
        받아보세요.
      </p>
      <div className="flex space-x-5">
        <button
          onClick={() => {
            setShowProBanner(false);
            va.track("Hid Pro Banner");
            Cookies.set("hideProBanner", slug, { expires: 7 });
          }}
          className="w-full rounded-md border border-gray-300 p-2 text-center text-sm font-medium text-gray-500 transition-all hover:border-gray-700 hover:text-gray-600"
        >
          다시 표시하지 않기
        </button>
        <button
          onClick={() => {
            va.track("Clicked on Pro Banner");
            setShowUpgradePlanModal(true);
          }}
          className="w-full rounded-md border border-black bg-black p-2 text-center text-sm font-medium text-white transition-all hover:bg-white hover:text-black"
        >
          업그레이드
        </button>
      </div>
    </div>
  );
}
