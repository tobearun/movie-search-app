"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { searchMovies } from "@/lib/api";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import debounce from "lodash.debounce";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const router = useRouter();

  const fetchSuggestions = debounce(async (q: string) => {
    if (!q.trim()) return setSuggestions([]);
    try {
      const results = await searchMovies(q);
      setSuggestions(results.slice(0, 5));
    } catch {
      setSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/movies?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 relative">
      {/* Brand Name */}
      <div className="absolute top-4 left-6 text-3xl font-extrabold text-red-600 tracking-widest select-none drop-shadow-[0_0_10px_#ff0000]">
        CineFlex
      </div>

      {/* Dark mode toggle */}
      <div className="absolute top-4 right-6">
        <DarkModeToggle />
      </div>

      {/* Neon Search Box */}
      <div className="relative w-full max-w-xl neon-glow mt-6">
        <Input
          placeholder="Search for movies..."
          className="text-xl px-6 py-5 pr-12 bg-transparent text-white border-none shadow-none placeholder:text-muted-foreground focus:outline-none focus:ring-0"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 cursor-pointer"
          onClick={handleSearch}
        />

        {suggestions.length > 0 && (
          <div className="absolute mt-1 w-full bg-background border border-muted rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
            {suggestions.map((movie) => (
              <div
                key={movie.imdbID}
                className="flex items-center gap-3 px-4 py-2 hover:bg-muted cursor-pointer"
                onClick={() => router.push(`/movies/${movie.imdbID}`)}
              >
                <Image
                  src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
                  alt={movie.Title}
                  width={40}
                  height={60}
                  className="w-10 h-16 object-cover rounded"
                />
                <span className="truncate">{movie.Title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
