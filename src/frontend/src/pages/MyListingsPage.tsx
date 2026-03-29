import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCheck, Loader2, LogIn, PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteBook,
  useMarkAsSold,
  useMyListings,
} from "../hooks/useQueries";
import { conditionColor, conditionLabel, formatPrice } from "../lib/bookUtils";

interface MyListingsPageProps {
  onNavigate: (page: "sell") => void;
}

function ListingRow({ book, index }: { book: Book; index: number }) {
  const { mutateAsync: markAsSold, isPending: isMarkingAsSold } =
    useMarkAsSold();
  const { mutateAsync: deleteBook, isPending: isDeleting } = useDeleteBook();

  const handleMarkSold = async () => {
    try {
      await markAsSold(book.id);
      toast.success("Marked as sold!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(book.id);
      toast.success("Listing deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  return (
    <div
      data-ocid={`listings.item.${index}`}
      className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-xs"
    >
      {/* Book info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{book.title}</h3>
          {book.sold && (
            <Badge variant="destructive" className="text-xs">
              Sold
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${conditionColor(book.condition)}`}
          >
            {conditionLabel(book.condition)}
          </span>
          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
          <span className="text-sm font-bold text-primary">
            {formatPrice(book.priceInCents)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!book.sold && (
          <Button
            data-ocid={`listings.sold.button.${index}`}
            size="sm"
            variant="outline"
            onClick={handleMarkSold}
            disabled={isMarkingAsSold || isDeleting}
            className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {isMarkingAsSold ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckCheck className="w-3 h-3 mr-1" />
            )}
            Mark Sold
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              data-ocid={`listings.delete.open_modal_button.${index}`}
              size="sm"
              variant="outline"
              disabled={isMarkingAsSold || isDeleting}
              className="text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              {isDeleting ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid={`listings.delete.dialog.${index}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Listing</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{book.title}&rdquo;? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid={`listings.delete.cancel_button.${index}`}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid={`listings.delete.confirm_button.${index}`}
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function MyListingsPage({ onNavigate }: MyListingsPageProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { data: listings, isLoading } = useMyListings();

  if (!isLoggedIn) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card border border-border rounded-xl p-10 shadow-card">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Log in to view and manage your book listings.
          </p>
          <Button
            data-ocid="listings.login.primary_button"
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-1">
            My Listings
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your active book listings
          </p>
        </div>
        <Button
          data-ocid="listings.new.primary_button"
          onClick={() => onNavigate("sell")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </div>

      {isLoading ? (
        <div data-ocid="listings.loading_state" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-4"
            >
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/3 mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : listings && listings.length > 0 ? (
        <div className="space-y-3">
          {listings.map((book, i) => (
            <ListingRow key={Number(book.id)} book={book} index={i + 1} />
          ))}
        </div>
      ) : (
        <div
          data-ocid="listings.empty_state"
          className="text-center py-16 bg-card border border-border rounded-xl"
        >
          <div className="text-5xl mb-4">📖</div>
          <h3 className="font-semibold text-lg mb-2">No listings yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
            You haven&apos;t listed any books for sale. Start earning by selling
            your old textbooks!
          </p>
          <Button
            data-ocid="listings.empty.sell.primary_button"
            onClick={() => onNavigate("sell")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            List Your First Book
          </Button>
        </div>
      )}
    </main>
  );
}
