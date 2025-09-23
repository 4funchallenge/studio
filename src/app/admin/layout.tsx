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
      {/* The admin page has its own complex layout, so we don't include the default player */}
      {children}
    </>
  );
}
