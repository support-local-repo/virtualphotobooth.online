import { Suspense } from "react";
import BoothCamera from "@/modules/booth/BoothCamera";

export default function Page() {
  return (
    <Suspense>
      <BoothCamera />
    </Suspense>
  );
}
