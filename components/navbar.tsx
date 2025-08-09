"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Github, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const getKakaoAuthUrl = async () => {
      const redirectTo = `${location.origin}/auth/callback?redirect_to=${encodeURIComponent(pathname)}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (data.url) {
        setAuthUrl(data.url);
      } else if (error) {
        console.error("Error getting Kakao auth URL:", error);
      }
    };

    getKakaoAuthUrl();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, pathname]);

  const handleLogin = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Eye className="w-6 h-6" />
          <span className="font-bold text-lg">눈길</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/about">
            <Button variant="ghost" size="sm">소개</Button>
          </Link>
          <Link href="/guide">
            <Button variant="ghost" size="sm">사용법</Button>
          </Link>
          {/* <Button variant="ghost" size="icon" asChild>
            <Link href="https://github.com/lambda0x63/nungil" target="_blank">
              <Github className="w-4 h-4" />
            </Link>
          </Button> */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/mypage">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.name} />
                  <AvatarFallback>{user.user_metadata.name?.[0]}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="로그아웃">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleLogin} disabled={!authUrl}>
                로그인
              </Button>
              <Button size="sm" asChild>
                <Link href="/start">시작하기</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}