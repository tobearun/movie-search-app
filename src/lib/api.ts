const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY!;
const BASE_URL = "https://www.omdbapi.com/";

export const searchMovies = async (query: string) => {
  const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error);
  return data.Search;
};

export const getMovieDetails = async (id: string) => {
  const res = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await res.json();
  if (data.Response === "False") throw new Error(data.Error);
  return data;
};
