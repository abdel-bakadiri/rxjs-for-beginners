export interface PosterResponse {
  Poster: string;
}

export interface SearchResponse extends Array<{ show: Show }> {}

export interface PopularResponse extends Array<Show> {}

export interface Show {
  title: string;
  year: number;
  network: string;
  overview: string;
  genres: string[];
  status: string;
  rating: number;
  ids: {
    imdb: string;
  };
}
