import { Suspense } from "react";
import BoothUpload from "@/modules/booth/BoothUpload";

export default function Page() {
  return (
    <Suspense>
      <BoothUpload />
    </Suspense>
  );
}
