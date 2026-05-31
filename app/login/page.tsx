"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08090d] flex items-center justify-center text-xs text-slate-500 font-semibold font-sans">
      메인 페이지로 이동 중입니다...
    </div>
  );
}
