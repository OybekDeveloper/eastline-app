import Container from "@/components/shared/container";
import { crudPage } from "@/lib/iterationDetails";
import Link from "next/link";
import React from "react";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Панель управления EAST LINE TELEKOM",
  description: "Рабочая зона для администраторов сайта.",
  path: "/dashboard",
  robots: {
    index: false,
    follow: false,
  },
});

async function Dashboard() {
  return (
    <Container>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 justify-between place-content-between gap-5 my-10 lg:my-20 textSmall3">
        {crudPage.map((item,idx) => (
          <Link
            key={idx}
            href={`/dashboard${item.path}`}
            className="w-full text-center border rounded-md py-5 hover:bg-secondary/80"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </Container>
  );
}

export default Dashboard;
