import { Button } from "@/components/ui/button";
import { BookOpen, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Page = "home" | "browse" | "sell" | "contact" | "mylistings";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Browse Books", page: "browse" },
  { label: "Sell Your Book", page: "sell" },
  { label: "My Listings", page: "mylistings" },
  { label: "Contact", page: "contact" },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!identity;

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.home.link"
          onClick={() => handleNav("home")}
          className="flex items-center gap-2 font-display text-xl text-primary hover:opacity-80 transition-opacity"
        >
          <BookOpen className="w-6 h-6" />
          <span>BookSwap</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.page}
              data-ocid={`nav.${link.page}.link`}
              onClick={() => handleNav(link.page)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === link.page
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Auth button + mobile menu */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button
              data-ocid="nav.logout.button"
              variant="outline"
              size="sm"
              onClick={clear}
              className="hidden md:flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          ) : (
            <Button
              data-ocid="nav.login.button"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="hidden md:flex items-center gap-1 bg-primary text-primary-foreground"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Logging in..." : "Log In"}
            </Button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            data-ocid="nav.menu.toggle"
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <nav className="flex flex-col p-3 gap-1">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.page}
                  data-ocid={`nav.mobile.${link.page}.link`}
                  onClick={() => handleNav(link.page)}
                  className={`px-3 py-2.5 rounded-md text-sm font-medium text-left transition-colors ${
                    currentPage === link.page
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-border mt-1">
                {isLoggedIn ? (
                  <Button
                    data-ocid="nav.mobile.logout.button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clear();
                      setMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Log Out
                  </Button>
                ) : (
                  <Button
                    data-ocid="nav.mobile.login.button"
                    size="sm"
                    onClick={() => {
                      login();
                      setMenuOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    {isLoggingIn ? "Logging in..." : "Log In"}
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
