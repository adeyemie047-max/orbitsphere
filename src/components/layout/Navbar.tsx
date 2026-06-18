import Logo from "@/components/ui/Logo";
import NavbarDate from "@/components/layout/NavbarDate";
import { NavbarProvider } from "@/components/layout/NavbarContext";
import { NavbarNavLinks, NavbarNavPanels } from "@/components/layout/NavbarShell";
import type { SiteBrandingData } from "@/lib/site-branding";

/** Server-rendered shell — stable markup avoids Turbopack HMR hydration drift. */
export default function Navbar({ branding }: { branding: SiteBrandingData }) {
  return (
    <header className="site-navbar">
      <div className="site-navbar-masthead hidden md:block border-b border-[var(--ds-nav-border)]">
        <div className="container-main flex items-center justify-between py-2">
          <span>{branding.mastheadLocations}</span>
          <NavbarDate />
          <span>Today&apos;s Edition</span>
        </div>
      </div>

      <NavbarProvider>
        <nav aria-label="Main navigation">
          <div className="site-navbar-inner container-main flex items-center justify-between gap-4">
            <Logo variant="masthead" branding={branding} />
            <NavbarNavLinks />
          </div>
          <NavbarNavPanels />
        </nav>
      </NavbarProvider>
    </header>
  );
}
