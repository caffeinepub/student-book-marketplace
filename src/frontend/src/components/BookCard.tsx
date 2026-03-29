import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Phone, Tag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Book } from "../backend.d";
import { useStorageUrl } from "../hooks/useStorageUrl";
import { conditionColor, conditionLabel, formatPrice } from "../lib/bookUtils";

interface BookCardProps {
  book: Book;
  index?: number;
}

export default function BookCard({ book, index = 1 }: BookCardProps) {
  const [showPhone, setShowPhone] = useState(false);
  const imageUrl = useStorageUrl(book.imageKey);

  return (
    <div
      data-ocid={`books.item.${index}`}
      className="bg-card rounded-lg border border-border shadow-card overflow-hidden flex flex-col group hover:shadow-md transition-shadow duration-200"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-20 mx-auto mb-2 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          </div>
        )}
        {book.sold && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-sm font-bold px-3 py-1 rounded-full rotate-[-12deg]">
              SOLD
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${conditionColor(book.condition)}`}
          >
            {conditionLabel(book.condition)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-base leading-snug line-clamp-2 flex-1">
            {book.title}
          </h3>
          <span className="text-primary font-bold text-base whitespace-nowrap">
            {formatPrice(book.priceInCents)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
          <User className="w-3 h-3" />
          {book.author}
        </p>
        <div className="flex items-center gap-1.5 mb-3">
          <Tag className="w-3 h-3 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
        </div>
        {book.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {book.description}
          </p>
        )}

        {/* Contact Seller */}
        {!book.sold && (
          <div className="mt-auto">
            <Button
              data-ocid={`books.contact.button.${index}`}
              variant="outline"
              size="sm"
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setShowPhone((v) => !v)}
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Contact Seller
              {showPhone ? (
                <ChevronUp className="w-3.5 h-3.5 ml-1" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              )}
            </Button>
            <AnimatePresence>
              {showPhone && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex items-center justify-center gap-2 bg-primary/5 rounded-md py-2 px-3 border border-primary/20">
                    <Phone className="w-4 h-4 text-primary" />
                    <a
                      href={`tel:${book.sellerPhone}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {book.sellerPhone}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
