import { PageSpecificAudio } from '@/components/audio-player';
import { HomeButton } from '@/components/home-button';

export default function SubPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeButton />
      {/* This component tells the main audio player which track to use. */}
      <PageSpecificAudio src="/music/arcade-birthday.mp3" />
      {children}
    </>
  );
}
