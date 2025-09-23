import { AudioPlayer } from '@/components/audio-player';
import { HomeButton } from '@/components/home-button';

export default function SubPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeButton />
      <AudioPlayer src="/music/contact-music.mp3" />
      {children}
    </>
  );
}
