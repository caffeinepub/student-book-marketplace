import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Book {
    id: bigint;
    title: string;
    sellerPhone: string;
    sold: boolean;
    description: string;
    seller: Principal;
    author: string;
    imageKey?: string;
    category: string;
    priceInCents: bigint;
    condition: BookCondition;
}
export interface CreateBookInput {
    title: string;
    sellerPhone: string;
    description: string;
    author: string;
    imageKey?: string;
    category: string;
    priceInCents: bigint;
    condition: BookCondition;
}
export interface UserProfile {
    name: string;
}
export enum BookCondition {
    new_ = "new",
    fair = "fair",
    good = "good",
    poor = "poor",
    likeNew = "likeNew"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseBooks(search: string, condition: BookCondition | null, category: string): Promise<Array<Book>>;
    deleteBook(id: bigint): Promise<void>;
    getBook(id: bigint): Promise<Book | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedBooks(): Promise<Array<Book>>;
    getMyListings(): Promise<Array<Book>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listBook(input: CreateBookInput): Promise<bigint>;
    markAsSold(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
