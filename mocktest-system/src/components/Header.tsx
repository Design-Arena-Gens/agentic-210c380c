import Link from "next/link";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/tests", label: "All Tests" },
  { href: "/create", label: "Create Test" },
  { href: "/attempts", label: "Attempt History" },
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          MockTest Pro
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-zinc-600 sm:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-zinc-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/create"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          New Mock Test
        </Link>
      </div>
    </header>
  );
};
