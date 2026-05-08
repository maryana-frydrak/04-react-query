import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { SearchBar } from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";
import styles from "./App.module.css";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import { useQuery } from "@tanstack/react-query";
import { default as ReactPaginate } from "react-paginate";

console.log("ПЕРЕВІРКА КОМПОНЕНТІВ:");
console.log("SearchBar:", typeof SearchBar);
console.log("MovieGrid:", typeof MovieGrid);
console.log("ReactPaginate:", typeof ReactPaginate);
console.log("MovieModal:", typeof MovieModal);

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery !== "",
  });

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data?.results || []} onSelect={openModal} />
      )}

      {data && data?.total_pages > 1 && (
        <ReactPaginate
          pageCount={data?.total_pages || 0}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }: { selected: number }) =>
            setPage(selected + 1)
          }
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel=">"
          previousLabel="<"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
