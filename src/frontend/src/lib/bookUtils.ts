import { BookCondition } from "../backend.d";

export function conditionLabel(condition: BookCondition): string {
  switch (condition) {
    case BookCondition.new_:
      return "New";
    case BookCondition.likeNew:
      return "Like New";
    case BookCondition.good:
      return "Good";
    case BookCondition.fair:
      return "Fair";
    case BookCondition.poor:
      return "Poor";
    default:
      return "Unknown";
  }
}

export function conditionColor(condition: BookCondition): string {
  switch (condition) {
    case BookCondition.new_:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case BookCondition.likeNew:
      return "bg-green-100 text-green-800 border-green-200";
    case BookCondition.good:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case BookCondition.fair:
      return "bg-orange-100 text-orange-700 border-orange-200";
    case BookCondition.poor:
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function formatPrice(priceInCents: bigint): string {
  return `$${(Number(priceInCents) / 100).toFixed(2)}`;
}
