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
      {/* Set the track for this page. The actual player is in the root layout. */}
      <PageSpecificAudio src="/music/arcade-birthday.mp3" />
      {children}
    </>
  );
}
