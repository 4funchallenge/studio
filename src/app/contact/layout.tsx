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
      <PageSpecificAudio src="/music/contact-music.mp3" />
      {children}
    </>
  );
}
