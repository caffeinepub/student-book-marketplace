import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookOpen, Phone, Search, Tag } from "lucide-react";
import { motion } from "motion/react";
import { type Book, BookCondition } from "../backend.d";
import BookCard from "../components/BookCard";
import { useFeaturedBooks } from "../hooks/useQueries";

const SAMPLE_BOOKS: Book[] = [
  {
    id: 1n,
    title: "Introduction to Algorithms",
    author: "Cormen, Leiserson, Rivest",
    description: "Classic algorithms textbook in great condition.",
    condition: BookCondition.good,
    priceInCents: 4500n,
    sellerPhone: "(555) 234-5678",
    imageKey: undefined,
    category: "Computer Science",
    seller: {} as any,
    sold: false,
  },
  {
    id: 2n,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    description: "8th edition, barely used.",
    condition: BookCondition.likeNew,
    priceInCents: 3800n,
    sellerPhone: "(555) 345-6789",
    imageKey: undefined,
    category: "Economics",
    seller: {} as any,
    sold: false,
  },
  {
    id: 3n,
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    description: "7th edition with lab manual included.",
    condition: BookCondition.fair,
    priceInCents: 2500n,
    sellerPhone: "(555) 456-7890",
    imageKey: undefined,
    category: "Chemistry",
    seller: {} as any,
    sold: false,
  },
  {
    id: 4n,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    description: "9th edition. Student solutions manual included.",
    condition: BookCondition.good,
    priceInCents: 3200n,
    sellerPhone: "(555) 567-8901",
    imageKey: undefined,
    category: "Mathematics",
    seller: {} as any,
    sold: false,
  },
];

const steps = [
  {
    icon: Search,
    title: "Find Your Book",
    desc: "Search by title, author, or category across hundreds of listings from fellow students.",
  },
  {
    icon: Phone,
    title: "Contact the Seller",
    desc: "Tap 'Contact Seller' on any listing to reveal the phone number and arrange a meetup.",
  },
  {
    icon: Tag,
    title: "List & Earn",
    desc: "Have books to sell? Create a free listing in minutes and reach students on campus.",
  },
];

interface HomePageProps {
  onNavigate: (page: "browse" | "sell") => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const { data: books, isLoading } = useFeaturedBooks();
  const displayBooks =
    books && books.length > 0 ? books.slice(0, 4) : SAMPLE_BOOKS;

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-8 w-32 h-40 border-2 border-primary-foreground rounded-sm rotate-[-8deg]" />
          <div className="absolute top-16 left-24 w-24 h-32 border-2 border-primary-foreground rounded-sm rotate-[4deg]" />
          <div className="absolute bottom-8 right-12 w-28 h-36 border-2 border-primary-foreground rounded-sm rotate-[10deg]" />
          <div className="absolute bottom-16 right-32 w-20 h-28 border-2 border-primary-foreground rounded-sm rotate-[-5deg]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center text-primary-foreground">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground text-sm px-4 py-1.5 rounded-full mb-6">
              <BookOpen className="w-4 h-4" />
              Student-to-Student Book Marketplace
            </div>
            <h1 className="font-display text-4xl md:text-6xl mb-4 leading-tight">
              Buy & Sell Textbooks
              <br />
              <span className="italic opacity-80">Between Students</span>
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-xl mx-auto mb-8">
              Save money on course materials. Connect directly with sellers on
              campus — no middleman, no hassle.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                data-ocid="home.browse.primary_button"
                size="lg"
                onClick={() => onNavigate("browse")}
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Books
              </Button>
              <Button
                data-ocid="home.sell.secondary_button"
                size="lg"
                variant="outline"
                onClick={() => onNavigate("sell")}
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Tag className="w-4 h-4 mr-2" />
                Sell Your Book
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/50 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl mb-2">How It Works</h2>
            <p className="text-muted-foreground">
              Three simple steps to buy or sell
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-lg border border-border p-6 text-center shadow-card"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl mb-1">Featured Books</h2>
            <p className="text-muted-foreground text-sm">
              Recently listed by students
            </p>
          </div>
          <Button
            data-ocid="home.viewall.secondary_button"
            variant="ghost"
            onClick={() => onNavigate("browse")}
            className="text-primary hover:text-primary"
          >
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border overflow-hidden"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayBooks.map((book, i) => (
              <BookCard key={Number(book.id)} book={book} index={i + 1} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-muted border-y border-border">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h2 className="font-display text-2xl md:text-3xl mb-3">
            Have books collecting dust?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            List them for free in under 2 minutes and help a fellow student
            while earning some cash.
          </p>
          <Button
            data-ocid="home.sell_cta.primary_button"
            size="lg"
            onClick={() => onNavigate("sell")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            List a Book <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </section>
    </main>
  );
}
