import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { SearchBar } from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";
import styles from "./App.module.css";
import { MovieGrid } from "../MovieGrid/MovieGrid";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { MovieModal } from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

const Paginate =
  (ReactPaginate as unknown as { default: React.ElementType }).default ||
  ReactPaginate;

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length === 0 && searchQuery !== "") {
      toast.error("Movies not found!");
    }
  }, [data, searchQuery]);

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
        <div style={{ opacity: isFetching ? 0.5 : 1 }}>
          <MovieGrid movies={data?.results || []} onSelect={openModal} />
        </div>
      )}

      {data && data?.total_pages > 1 && (
        <Paginate
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
