import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import {
  CheckCircle,
  ImagePlus,
  Loader2,
  LogIn,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BookCondition } from "../backend.d";
import { loadConfig } from "../config";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useListBook } from "../hooks/useQueries";
import { StorageClient } from "../utils/StorageClient";

const CATEGORIES = [
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

const CONDITIONS: { label: string; value: BookCondition }[] = [
  { label: "New", value: BookCondition.new_ },
  { label: "Like New", value: BookCondition.likeNew },
  { label: "Good", value: BookCondition.good },
  { label: "Fair", value: BookCondition.fair },
  { label: "Poor", value: BookCondition.poor },
];

export default function SellPage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const { mutateAsync: listBook, isPending } = useListBook();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState<BookCondition>(BookCondition.good);
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number.parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      let imageKey: string | undefined = undefined;

      if (imageFile) {
        const config = await loadConfig();
        const agent = new HttpAgent({ host: config.backend_host });
        const storageClient = new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        );
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) =>
          setUploadProgress(pct),
        );
        imageKey = hash;
      }

      await listBook({
        title,
        author,
        description,
        condition,
        priceInCents: BigInt(Math.round(priceNum * 100)),
        sellerPhone: phone,
        imageKey,
        category,
      });

      setSubmitted(true);
      toast.success("Your book has been listed!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to list book");
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-card border border-border rounded-xl p-10 shadow-card">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-display text-2xl mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            You need to log in to list books for sale on BookSwap.
          </p>
          <Button
            data-ocid="sell.login.primary_button"
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoggingIn ? "Logging in..." : "Log In to Continue"}
          </Button>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          data-ocid="sell.success_state"
          className="bg-card border border-border rounded-xl p-10 shadow-card"
        >
          <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-2">Book Listed!</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Your book is now live on BookSwap. Students can contact you via the
            phone number you provided.
          </p>
          <Button
            data-ocid="sell.list_another.button"
            onClick={() => {
              setSubmitted(false);
              setTitle("");
              setAuthor("");
              setDescription("");
              setCondition(BookCondition.good);
              setPrice("");
              setPhone("");
              setCategory("");
              removeImage();
              setUploadProgress(0);
            }}
            className="bg-primary text-primary-foreground"
          >
            List Another Book
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl mb-2">
          Sell Your Book
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to list your book for sale
        </p>
      </div>

      <form
        data-ocid="sell.form"
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-xl shadow-card p-6 space-y-5"
      >
        {/* Title & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Book Title *</Label>
            <Input
              data-ocid="sell.title.input"
              id="title"
              placeholder="e.g. Introduction to Algorithms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="author">Author *</Label>
            <Input
              data-ocid="sell.author.input"
              id="author"
              placeholder="e.g. Thomas H. Cormen"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            data-ocid="sell.description.textarea"
            id="description"
            placeholder="Edition, included materials, any notes or highlights..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Condition, Category, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Condition *</Label>
            <Select
              value={condition}
              onValueChange={(v) => setCondition(v as BookCondition)}
            >
              <SelectTrigger data-ocid="sell.condition.select">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger data-ocid="sell.category.select">
                <SelectValue placeholder="Select category" />
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
          <div className="space-y-1.5">
            <Label htmlFor="price">Price (USD) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <Input
                data-ocid="sell.price.input"
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-6"
                required
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone">Your Phone Number *</Label>
          <Input
            data-ocid="sell.phone.input"
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Buyers will contact you directly via this number
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <Label>Book Photo</Label>
          {imagePreview ? (
            <div className="relative w-32 h-40 rounded-md overflow-hidden border border-border">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-foreground/70 text-background rounded-full p-0.5 hover:bg-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              data-ocid="sell.image.upload_button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-md hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Click to upload a photo
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG, WEBP up to 5MB
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Upload Progress */}
        {isPending &&
          imageFile &&
          uploadProgress > 0 &&
          uploadProgress < 100 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

        <Button
          data-ocid="sell.submit.submit_button"
          type="submit"
          disabled={isPending || !category}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Listing Book...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> List My Book
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
