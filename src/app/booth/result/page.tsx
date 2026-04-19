import { Suspense } from "react";
import BoothResult from "@/modules/booth/BoothResult";

export default function Page() {
  return (
    <Suspense>
      <BoothResult />
    </Suspense>
  );
}
