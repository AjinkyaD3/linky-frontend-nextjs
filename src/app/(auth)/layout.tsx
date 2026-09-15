import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 py-12">
      <Logo className="text-xl" />
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-card p-7 shadow-sm">
        {children}
      </div>
    </div>
  );
}
