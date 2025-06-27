"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MovieCard({ movie }: { movie: any }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/movies/${movie.imdbID}`)}
      className="cursor-pointer border rounded-lg p-2 hover:shadow-md transition"
    >
      <Image
        src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
        alt={movie.Title}
        width={200}
        height={300}
        className="w-full h-64 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{movie.Title}</h3>
      <p className="text-sm text-gray-500">{movie.Year}</p>
    </div>
  );
}
