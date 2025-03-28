"use client";

import ChatPlaceHolder from "@/components/rightPanel/chatPlaceHolder/ChatPlaceHolder";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    router.push("/v");
  }, [error, router]);

  return <ChatPlaceHolder />;
}
