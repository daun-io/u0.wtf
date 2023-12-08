import "dotenv-flow/config";
import prisma from "@/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    where: {
      projects: {
        some: {
          project: {
            slug: "steven",
          },
        },
      },
    },
    select: {
      name: true,
      email: true,
    },
  });

  const response = await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify(
      users.map(({ name, email }) => {
        return {
          from: "Daun from U0 <daun@ship.u0.wtf>",
          to: email,
          subject: "U0에서 보내는 인사",
          text: `Hi ${name},\n\nThis is a test email from U0.\n\nBest,\Daun`,
        };
      }),
    ),
  }).then((res) => res.json());

  console.log(response);
}

main();
