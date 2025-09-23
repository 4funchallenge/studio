import { SiteHeader } from "@/components/site-header";

export default function SubPageLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
            <SiteHeader />
            {children}
        </>
    );
  }