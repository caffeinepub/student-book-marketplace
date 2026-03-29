import {
  BookOpen,
  Clock,
  MessageCircle,
  Phone,
  Shield,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";

const faqs = [
  {
    icon: Phone,
    q: "How do I contact a seller?",
    a: "Click the 'Contact Seller' button on any book listing to reveal the seller's phone number. You can then call or text them directly to arrange a time and place to exchange the book.",
  },
  {
    icon: Tag,
    q: "Is there an online payment system?",
    a: "No. BookSwap is a listings platform only — all transactions happen in person. Meet the seller on campus, inspect the book, and pay cash or arrange your preferred payment directly.",
  },
  {
    icon: BookOpen,
    q: "How do I list a book for sale?",
    a: "Log in with your Internet Identity, then go to 'Sell Your Book'. Fill out the form with your book's details, set your price, and add your phone number. Your listing goes live immediately.",
  },
  {
    icon: Shield,
    q: "Is my phone number safe?",
    a: "Your phone number is only visible to users who click 'Contact Seller' on your listing. It is not shown in search results or to non-logged-in visitors.",
  },
  {
    icon: Clock,
    q: "How do I mark a book as sold?",
    a: "Go to 'My Listings' and click 'Mark as Sold' next to the listing. This removes it from active search results and lets other buyers know it's no longer available.",
  },
  {
    icon: MessageCircle,
    q: "Can I negotiate the price?",
    a: "Absolutely. Once you contact the seller, you can negotiate any terms directly. The listed price is just the starting point.",
  },
];

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-12"
      >
        <h1 className="font-display text-3xl md:text-4xl mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Everything you need to know about buying and selling on BookSwap
        </p>
      </motion.div>

      {/* FAQ grid */}
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-card border border-border rounded-lg p-6 shadow-xs"
          >
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <faq.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1.5">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* About card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-10 bg-primary text-primary-foreground rounded-xl p-8 text-center shadow-card"
      >
        <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-90" />
        <h2 className="font-display text-2xl mb-2">About BookSwap</h2>
        <p className="text-primary-foreground/80 text-sm max-w-sm mx-auto leading-relaxed">
          BookSwap is a peer-to-peer marketplace built for students. We help you
          save money on textbooks and connect you directly with fellow students.
          No commissions, no fees — just books.
        </p>
      </motion.div>
    </main>
  );
}
