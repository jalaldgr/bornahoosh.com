import CheckoutClient from "./CheckoutClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}
