import Container from "@/components/shared/container";
import { crudPage } from "@/lib/iterationDetails";
import Link from "next/link";
import React from "react";

async function Dashboard() {
  return (
    <Container>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 justify-between place-content-between gap-5 my-10 lg:my-20 textSmall3">
        {crudPage.map((item) => (
          <Link key={item.id} href={`/dashboard${item.path}`} className="w-full text-center border rounded-md py-5 hover:bg-secondary/80">
            {item.title}
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default Dashboard