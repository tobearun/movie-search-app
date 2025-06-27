import { getMovieDetails, searchMovies } from "@/lib/api";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";

type Props = {
  params: {
    id: string;
  };
};

export default async function MovieDetailsPage({ params }: Props) {
  const movie = await getMovieDetails(params.id);

  let recommendations = [];
  try {
    const genreKeyword = movie.Genre?.split(",")[0] || "action";
    recommendations = await searchMovies(genreKeyword);
    recommendations = recommendations.filter((m: any) => m.imdbID !== params.id).slice(0, 4);
  } catch (err) {
    recommendations = [];
  }

  return (
    <div className="bg-background text-foreground min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movie Details</h1>
        <DarkModeToggle />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        <Image
          src={movie.Poster !== "N/A" ? movie.Poster : "/no-image.png"}
          alt={movie.Title}
          width={300}
          height={450}
          className="rounded w-full md:w-[300px] h-auto object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
          <p className="text-gray-400 mb-4">{movie.Year} • {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p className="mt-4"><strong>Plot:</strong> {movie.Plot}</p>
          <StarRating movieId={movie.imdbID} />
        </div>
      </div>

      {recommendations.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendations.map((rec: any) => (
              <Link key={rec.imdbID} href={`/movies/${rec.imdbID}`}>
                <div className="group cursor-pointer hover:scale-105 transition duration-300">
                  <Image
                    src={rec.Poster !== "N/A" ? rec.Poster : "/no-image.png"}
                    alt={rec.Title}
                    width={200}
                    height={300}
                    className="rounded w-full h-[300px] object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-300 truncate">{rec.Title}</p>
                  <p className="text-xs text-gray-500">{rec.Year}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
