'use client';

import { Button } from '@/components/ui/button';

export default function KakaoLoginButton() {
  const handleLogin = () => {
    // 1. 환경 변수에서 카카오 REST API 키를 가져옵니다.
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    // 2. 로그인 후 돌아올 리디렉션 URI를 설정합니다.
    const REDIRECT_URI = `${location.origin}/auth/callback`;

    // 3. 필수 파라미터를 포함하여 카카오 로그인 URL을 직접 생성합니다.
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=profile_nickname,profile_image`;

    // 4. 생성된 URL로 사용자를 리디렉션시킵니다.
    window.location.href = kakaoAuthUrl;
  };

  return (
    <Button onClick={handleLogin} className="w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90">
      카카오로 로그인하기
    </Button>
  );
}
