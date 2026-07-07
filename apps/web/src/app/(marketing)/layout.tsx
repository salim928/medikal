import { MarketingNav, MarketingFooter } from "@/components/marketing/shell";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-slate-900">
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
