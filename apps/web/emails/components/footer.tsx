import { Hr, Tailwind, Text } from "@react-email/components";

export default function Footer({
  email,
  marketing,
}: {
  email: string;
  marketing?: boolean;
}) {
  return (
    <Tailwind>
      <Hr className="mx-0 my-6 w-full border border-gray-200" />
      {marketing ? (
        <Text className="text-[12px] leading-6 text-gray-500">
          이 이메일은 <span className="text-black">{email}</span>님께 보내진
          것입니다. 이 이메일을 기대하지 않았다면 무시하실 수 있습니다. 앞으로
          이런 이메일을 받고 싶지 않다면, 계정 설정을 통해서 이메일을 변경하거나
          계정을 삭제하실 수 있습니다.
        </Text>
      ) : (
        <Text className="text-[12px] leading-6 text-gray-500">
          이 이메일은 <span className="text-black">{email}</span>님께 보내진
          것입니다. 이 이메일을 기대하지 않았다면 무시하실 수 있습니다. 계정의
          안전에 대해 우려된다면, 이 이메일에 답장하여 저희에게 연락해주세요.
        </Text>
      )}
    </Tailwind>
  );
}
