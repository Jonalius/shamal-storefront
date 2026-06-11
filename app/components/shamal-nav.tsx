import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ShamalCartTrigger } from "~/components/shamal-cart-trigger";
import { cn } from "~/utils/cn";

// Soft-launch nav: Home + the two real routes. "Our Story" (homepage anchor)
// and "Shop" (hidden during soft launch) were removed. "Home" navigates to "/"
// alongside the logo, which is also a home link. "Nordic Seasons" and
// "The Journal" point at real routes.
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Nordic Seasons", href: "/collections/perfumes" },
  { label: "The Journal", href: "/blogs/journal" },
] as const;

/**
 * Global Shamal navigation. Rendered on all Shamal pages (homepage, collections,
 * products) so the cart is always reachable. Transparent on load, becomes a
 * solid bg-shamal-black bar after 50px of scroll.
 */
export function ShamalNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ease-out",
        scrolled
          ? "border-shamal-white/10 border-b bg-shamal-black"
          : "border-transparent border-b bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link to="/">
          <img src="/shamal-nav-logo.png" alt="Shamal" className="h-7 w-auto" />
        </Link>
        <div className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-light text-[11px] text-shamal-white-dim uppercase tracking-[0.28em] transition-colors duration-300 hover:text-shamal-gold"
            >
              {link.label}
            </a>
          ))}
        </div>
        <ShamalCartTrigger />
      </div>
    </nav>
  );
}
