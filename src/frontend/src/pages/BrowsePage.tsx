import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { BookCondition } from "../backend.d";
import BookCard from "../components/BookCard";
import { useBrowseBooks } from "../hooks/useQueries";

const CATEGORIES = [
  "All",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Psychology",
  "History",
  "Literature",
  "Engineering",
  "Business",
  "Other",
];

const CONDITIONS: { label: string; value: string }[] = [
  { label: "Any Condition", value: "all" },
  { label: "New", value: BookCondition.new_ },
  { label: "Like New", value: BookCondition.likeNew },
  { label: "Good", value: BookCondition.good },
  { label: "Fair", value: BookCondition.fair },
  { label: "Poor", value: BookCondition.poor },
];

export default function BrowsePage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [conditionValue, setConditionValue] = useState("all");
  const [category, setCategory] = useState("All");

  const conditionFilter: BookCondition | null =
    conditionValue === "all" ? null : (conditionValue as BookCondition);

  const categoryFilter = category === "All" ? "" : category;

  const { data: books, isLoading } = useBrowseBooks(
    search,
    conditionFilter,
    categoryFilter,
  );

  const handleSearch = () => setSearch(searchInput);
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setConditionValue("all");
    setCategory("All");
  };

  const hasFilters = search || conditionValue !== "all" || category !== "All";

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-2">Browse Books</h1>
        <p className="text-muted-foreground">
          Search through student listings to find your next textbook
        </p>
      </div>

      {/* Search & Filters */}
      <div
        data-ocid="browse.search.panel"
        className="bg-card border border-border rounded-lg p-4 mb-6 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="browse.search.input"
                placeholder="Search by title or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button
              data-ocid="browse.search.submit_button"
              onClick={handleSearch}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              Search
            </Button>
          </div>
          <div className="flex gap-2">
            <Select value={conditionValue} onValueChange={setConditionValue}>
              <SelectTrigger
                data-ocid="browse.condition.select"
                className="w-full sm:w-40"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                data-ocid="browse.category.select"
                className="w-full sm:w-40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {hasFilters && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Active filters
            </span>
            <Button
              data-ocid="browse.clear_filters.button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs text-destructive hover:text-destructive"
            >
              <X className="w-3 h-3 mr-1" /> Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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
      ) : books && books.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {books.length} book{books.length !== 1 ? "s" : ""} found
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {books.map((book, i) => (
              <BookCard key={Number(book.id)} book={book} index={i + 1} />
            ))}
          </motion.div>
        </>
      ) : (
        <div
          data-ocid="browse.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-semibold text-foreground text-lg mb-2">
            {hasFilters ? "No books match your filters" : "No books listed yet"}
          </h3>
          <p className="text-sm max-w-xs mx-auto">
            {hasFilters
              ? "Try adjusting your search or clearing filters."
              : "Be the first to list a book on BookSwap!"}
          </p>
          {hasFilters && (
            <Button
              data-ocid="browse.empty.clear_button"
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
