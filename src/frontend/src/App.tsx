import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import MyListingsPage from "./pages/MyListingsPage";
import SellPage from "./pages/SellPage";

type Page = "home" | "browse" | "sell" | "contact" | "mylistings";

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage={page} onNavigate={navigate} />
      <div className="flex-1">
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "browse" && <BrowsePage />}
        {page === "sell" && <SellPage />}
        {page === "contact" && <ContactPage />}
        {page === "mylistings" && <MyListingsPage onNavigate={navigate} />}
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
