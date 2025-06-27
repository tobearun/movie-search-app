"use client";

import { Suspense, useEffect, useState } from "react";
import { searchMovies } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useRouter, useSearchParams } from "next/navigation";

export default function MovieSearchPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white px-6 py-10">Loading search...</div>}>
      <MovieSearchPage />
    </Suspense>
  );
}

function MovieSearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const fetchMovies = async (q: string) => {
    if (!q.trim()) return;
    try {
      setLoading(true);
      const results = await searchMovies(q);
      setMovies(results);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    if (initialQuery) {
      fetchMovies(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="bg-background text-white min-h-screen px-6 py-10 transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Search Movies</h1>
        <DarkModeToggle />
      </div>

      <div className="relative max-w-md">
        <Input
          placeholder="Search for a movie..."
          className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground focus:ring-0 focus:outline-none"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            fetchSuggestions(val);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSuggestions([]);
              router.push(`/movies?query=${encodeURIComponent(query)}`);
            }
          }}
        />

        {suggestions.length > 0 && query.trim() && (
          <div className="absolute top-full mt-2 bg-background border border-muted rounded-md shadow-lg z-10 max-h-60 overflow-y-auto w-full">
            {suggestions.map((movie) => (
              <div
                key={movie.imdbID}
                className="flex items-center gap-3 px-4 py-2 hover:bg-muted cursor-pointer"
                onClick={() => {
                  router.push(`/movies/${movie.imdbID}?query=${encodeURIComponent(query)}`);
                }}
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

      {loading && <p className="text-gray-300 mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {movies.map((movie) => (
          <Link
            key={movie.imdbID}
            href={`/movies/${movie.imdbID}?query=${encodeURIComponent(query)}`}
          >
            <div className="group relative overflow-hidden rounded-lg hover:scale-105 transition transform duration-300">
              <Image
                src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
                alt={movie.Title}
                width={300}
                height={450}
                className="w-full h-[360px] object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent px-2 py-2">
                <h2 className="text-sm font-semibold truncate text-white">
                  {movie.Title}
                </h2>
                <p className="text-xs text-gray-300">{movie.Year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
