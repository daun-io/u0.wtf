import { DomainVerificationStatusProps } from "@/lib/types";
import { getSubdomain } from "@u0/utils";
import { useState } from "react";

export default function DomainConfiguration({
  data,
}: {
  data: { status: DomainVerificationStatusProps; response: any };
}) {
  const { domainJson, configJson } = data.response;
  const subdomain = getSubdomain(domainJson.name, domainJson.apexName);
  const [recordType, setRecordType] = useState(!!subdomain ? "CNAME" : "A");

  if (data.status === "인증 대기중") {
    const txtVerification = domainJson.verification.find(
      (x: any) => x.type === "TXT",
    );
    return (
      <div className="border-t border-gray-200">
        <DnsRecord
          instructions={`<code>${domainJson.apexName}</code> TXT 레코드를 설정해 <code>${domainJson.name}</code> 도메인의 소유권을 증명하세요:`}
          records={[
            {
              type: txtVerification.type,
              name: txtVerification.domain.slice(
                0,
                txtVerification.domain.length - domainJson.apexName.length - 1,
              ),
              value: txtVerification.value,
            },
          ]}
          warning="경고: 다른 사이트에서 이 도메인을 사용하는 경우 이 TXT 레코드를 설정하면 도메인 소유권이 해당 사이트로부터 이전되어 도메인이 손상됩니다. 이 레코드를 설정할 때는 주의하세요."
        />
      </div>
    );
  }

  if (data.status === "DNS 레코드 충돌") {
    return (
      <div className="border-t border-gray-200 pt-5">
        <div className="flex justify-start space-x-4">
          <div className="ease border-b-2 border-black pb-1 text-sm text-black transition-all duration-150">
            {configJson?.conflicts.some((x) => x.type === "A")
              ? "A 레코드 (추천)"
              : "CNAME 레코드 (추천)"}
          </div>
        </div>
        <DnsRecord
          instructions="Please remove the following conflicting DNS records from your DNS provider:"
          records={configJson?.conflicts.map(
            ({
              name,
              type,
              value,
            }: {
              name: string;
              type: string;
              value: string;
            }) => ({
              name,
              type,
              value,
            }),
          )}
        />
        <DnsRecord
          instructions="Afterwards, set the following record on your DNS provider to continue:"
          records={[
            {
              type: recordType,
              name: recordType === "A" ? "@" : subdomain ?? "www",
              value: recordType === "A" ? `76.76.21.21` : `cname.u0.wtf`,
              ttl: "86400",
            },
          ]}
        />
      </div>
    );
  }

  if (data.status === "알 수 없는 오류") {
    return (
      <div className="border-t border-gray-200 pt-5">
        <p className="mb-5 text-sm">{data.response.domainJson.error.message}</p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 pt-5">
      <div className="flex justify-start space-x-4">
        <button
          onClick={() => setRecordType("A")}
          className={`${
            recordType == "A"
              ? "border-black text-black"
              : "border-white text-gray-400"
          } ease border-b-2 pb-1 text-sm transition-all duration-150`}
        >
          A 레코드{!subdomain && " (추천)"}
        </button>
        <button
          onClick={() => setRecordType("CNAME")}
          className={`${
            recordType == "CNAME"
              ? "border-black text-black"
              : "border-white text-gray-400"
          } ease border-b-2 pb-1 text-sm transition-all duration-150`}
        >
          CNAME 레코드{subdomain && " (추천)"}
        </button>
      </div>

      <DnsRecord
        instructions={`${
          recordType === "A" ? "최상위 도메인" : "하위 도메인"
        }을 설정하기 위해서는 (<code>${
          recordType === "A" ? domainJson.apexName : domainJson.name
        }</code>), 다음 ${recordType} 레코드를 DNS 제공자에서 추가해주세요:`}
        records={[
          {
            type: recordType,
            name: recordType === "A" ? "@" : subdomain ?? "www",
            value: recordType === "A" ? `76.76.21.21` : `cname.u0.wtf`,
            ttl: "86400",
          },
        ]}
      />
    </div>
  );
}

const MarkdownText = ({ text }: { text: string }) => {
  return (
    <p
      className="prose-sm prose-code:rounded-md prose-code:bg-blue-100 prose-code:p-1 prose-code:text-[14px] prose-code:font-medium prose-code:font-mono prose-code:text-blue-900 my-5 max-w-none"
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

const DnsRecord = ({
  instructions,
  records,
  warning,
}: {
  instructions: string;
  records: { type: string; name: string; value: string; ttl?: string }[];
  warning?: string;
}) => {
  const hasTtl = records.some((x) => x.ttl);
  return (
    <div className="my-3 text-left">
      <MarkdownText text={instructions} />
      <div className="flex items-center justify-start space-x-10 rounded-md bg-gray-50 p-2">
        <div>
          <p className="text-sm font-bold">유형</p>
          {records.map((record) => (
            <p key={record.type} className="mt-2 font-mono text-sm">
              {record.type}
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold">이름</p>
          {records.map((record) => (
            <p key={record.name} className="mt-2 font-mono text-sm">
              {record.name}
            </p>
          ))}
        </div>
        <div>
          <p className="text-sm font-bold">값</p>
          {records.map((record) => (
            <p key={record.value} className="mt-2 font-mono text-sm">
              {record.value}
            </p>
          ))}
        </div>
        {hasTtl && (
          <div>
            <p className="text-sm font-bold">TTL</p>
            {records.map((record) => (
              <p key={record.ttl} className="mt-2 font-mono text-sm">
                {record.ttl}
              </p>
            ))}
          </div>
        )}
      </div>
      {(warning || hasTtl) && (
        <MarkdownText
          text={
            warning ||
            "참고: TTL의 경우 <code>86400</code>이 사용 불가능하면 가능한 가장 높은 값을 설정하세요. 또한, 도메인 전파는 1시간에서 12시간까지 걸릴 수 있습니다."
          }
        />
      )}
    </div>
  );
};
