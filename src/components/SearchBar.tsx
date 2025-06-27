"use client";
import { Input } from "@/components/ui/input";

export default function SearchBar({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (val: string) => void;
}) {
  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search for movies..."
      className="w-full"
    />
  );
}
