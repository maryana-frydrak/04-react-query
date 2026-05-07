import axios from "axios";
import { type Movie } from "../types/movie";

interface TMDBResponse {
  results: Movie[];
}

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
});

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await instance.get<TMDBResponse>("/search/movie", {
    params: { query },
  });
  return response.data.results;
};
