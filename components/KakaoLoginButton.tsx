"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function KakaoLoginButton() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getKakaoAuthUrl = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          // We use redirectTo here, but we won't redirect immediately.
          // We're just using this to get the generated URL from Supabase.
          redirectTo: `${location.origin}/auth/callback`,
          // IMPORTANT: We ask Supabase to skip the redirect 
          // so we can get the URL and modify it if needed.
          skipBrowserRedirect: true,
        },
      });

      if (data.url) {
        // Supabase gives us the full URL. Now we can ensure the scopes are correct.
        const url = new URL(data.url);
        // We will explicitly set the scopes, ensuring email is included.
        url.searchParams.set('scope', 'profile_nickname,profile_image,account_email');
        setAuthUrl(url.toString());
      } else if (error) {
        console.error("Error getting Kakao auth URL:", error);
      }
    };

    getKakaoAuthUrl();
  }, [supabase.auth]);

  const handleLogin = () => {
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      // Fallback or error handling
      alert("카카오 로그인에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <Button 
      onClick={handleLogin} 
      disabled={!authUrl}
      className="w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90"
    >
      카카오로 로그인하기
    </Button>
  );
}