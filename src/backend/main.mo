import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Text "mo:core/Text";
import Iter "mo:core/Iter";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── User Profile ─────────────────────────────────────────────

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Book types ───────────────────────────────────────────────

  public type BookCondition = {
    #new_;
    #likeNew;
    #good;
    #fair;
    #poor;
  };

  public type Book = {
    id : Nat;
    title : Text;
    author : Text;
    description : Text;
    condition : BookCondition;
    priceInCents : Nat;
    sellerPhone : Text;
    imageKey : ?Text;
    category : Text;
    seller : Principal;
    sold : Bool;
  };

  public type CreateBookInput = {
    title : Text;
    author : Text;
    description : Text;
    condition : BookCondition;
    priceInCents : Nat;
    sellerPhone : Text;
    imageKey : ?Text;
    category : Text;
  };

  // ── State ────────────────────────────────────────────────────

  var nextId = 0;
  let books = Map.empty<Nat, Book>();

  // ── Helpers ─────────────────────────────────────────────────

  func textContains(haystack : Text, needle : Text) : Bool {
    if (needle == "") { // Match all if no search term
      true;
    } else {
      haystack.toLower().contains(#text(needle.toLower()));
    };
  };

  // ── Public API ──────────────────────────────────────────────

  public shared ({ caller }) func listBook(input : CreateBookInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list books");
    };
    let id = nextId;
    nextId += 1;
    let book : Book = {
      id;
      title = input.title;
      author = input.author;
      description = input.description;
      condition = input.condition;
      priceInCents = input.priceInCents;
      sellerPhone = input.sellerPhone;
      imageKey = input.imageKey;
      category = input.category;
      seller = caller;
      sold = false;
    };
    books.add(id, book);
    id;
  };

  public query ({ caller }) func getBook(id : Nat) : async ?Book {
    books.get(id);
  };

  public query ({ caller }) func browseBooks(search : Text, condition : ?BookCondition, category : Text) : async [Book] {
    books.values().filter(func(book) { not book.sold }).filter(
      func(book) {
        textContains(book.title, search) or textContains(book.author, search);
      }
    ).filter(
      func(book) {
        switch (condition) {
          case (null) { true };
          case (?c) { book.condition == c };
        };
      }
    ).filter(
      func(book) {
        if (category == "") { true } else { book.category == category };
      }
    ).toArray();
  };

  public query ({ caller }) func getFeaturedBooks() : async [Book] {
    books.values().filter(func(book) { not book.sold }).toArray();
  };

  public shared ({ caller }) func markAsSold(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark books as sold");
    };
    switch (books.get(id)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) {
        if (book.seller != caller) { Runtime.trap("Not your listing") };
        books.add(id, { book with sold = true });
      };
    };
  };

  public shared ({ caller }) func deleteBook(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete books");
    };
    switch (books.get(id)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) {
        if (book.seller != caller) { Runtime.trap("Not your listing") };
        books.remove(id);
      };
    };
  };

  public query ({ caller }) func getMyListings() : async [Book] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their listings");
    };
    books.values().filter(func(book) { book.seller == caller }).toArray();
  };
};
