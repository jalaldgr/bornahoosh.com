import OrderPageClient from "./OrderPageClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <OrderPageClient />
    </Suspense>
  );
}
