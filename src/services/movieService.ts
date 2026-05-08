import axios from "axios";
import { type Movie } from "../types/movie";

interface TMDBResponse {
  results: Movie[];
  total_pages: number;
}

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<TMDBResponse> => {
  const response = await instance.get<TMDBResponse>("/search/movie", {
    params: { query, page },
  });
  return response.data;
};
