"use client";
import { useEffect } from "react";
import BoothMenu from "@/modules/booth/BoothMenu";

export default function Page() {
  useEffect(() => {
    // Clear session data but preserve loop frame if coming back from loop
    const loopFrame = sessionStorage.getItem("vpb_loop_frame");
    sessionStorage.removeItem("vpb_photos");
    sessionStorage.removeItem("vpb_template");
    if (!loopFrame) sessionStorage.removeItem("vpb_loop_frame");
  }, []);
  return <BoothMenu />;
}