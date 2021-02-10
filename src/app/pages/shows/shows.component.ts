import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, combineLatest, BehaviorSubject, Subject, of, ReplaySubject, merge } from 'rxjs';
import { map, distinctUntilChanged, switchMap, share, tap, startWith, filter, debounceTime } from 'rxjs/operators';

interface Show {
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

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowsComponent implements OnInit {
  readonly headers: (keyof Show)[] = ['title', 'year', 'network', 'status', 'rating'];
  readonly selectedShow$ = new ReplaySubject<Show | undefined>(1);
  readonly selectedNetwork$ = new Subject<string | undefined>();
  readonly selectedYear$ = new Subject<number | undefined>();
  readonly sortingProperty$ = new BehaviorSubject<keyof Show>('title');
  readonly sortingDesc$ = new BehaviorSubject<boolean>(false);
  readonly search$ = new Subject<string>();

  hasFilters$: Observable<boolean> | undefined;
  shows$: Observable<Show[]> | undefined;
  posterUrl$: Observable<string | undefined> | undefined;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    const selectedNetwork$ = this.selectedNetwork$.pipe(distinctUntilChanged(), startWith(undefined));
    const selectedYear$ = this.selectedYear$.pipe(distinctUntilChanged(), startWith(undefined));
    const search$ = this.search$.pipe(debounceTime(250), distinctUntilChanged(), startWith(undefined));
    const filters$ = combineLatest([selectedNetwork$, selectedYear$, search$]);
    this.hasFilters$ = filters$.pipe(map(([network, year, search]) => !!network || !!year || (!!search && search.length > 2)));
    const shows$ = filters$.pipe(
      tap(() => this.selectedShow$.next(undefined)),
      switchMap(([network, year, search]) => this.getShows(network, year, search))
    );
    this.shows$ = combineLatest([shows$, this.sortingProperty$, this.sortingDesc$]).pipe(
      map(([shows, sortProperty, sortDesc]) => this.sortShows(shows, sortProperty, sortDesc))
    );
    this.posterUrl$ = this.selectedShow$.pipe(switchMap(show => (show ? this.getOMDBPosterUrl(show.ids.imdb) : of(undefined))));
  }

  onNetworkSelect(network: string): void {
    this.selectedNetwork$.next(network);
  }

  onYearSelect(year: number): void {
    this.selectedYear$.next(year);
  }

  onShowSelect(show: Show): void {
    this.selectedShow$.next(show);
  }

  onSort(property: keyof Show): void {
    this.sortingProperty$.next(property);
    this.sortingDesc$.next(this.sortingProperty$.value === property && !this.sortingDesc$.value);
  }

  onResetFilters(): void {
    this.selectedNetwork$.next(undefined);
    this.selectedYear$.next(undefined);
    this.search$.next(undefined);
  }

  onSearchInput(input: string) {
    this.search$.next(input);
  }

  private sortShows(shows: Show[], property: keyof Show = 'title', desc: boolean = true): Show[] {
    return shows.sort((a, b) => (a[property] > b[property] ? 1 : -1) * (desc ? -1 : 1));
  }

  private getShows(network?: string, year?: number, search?: string): Observable<Show[]> {
    const apiKey = 'd4fdc0c985770f4486f5c1d8a637c9d1cc4153933e7e258aa9a4b24a2d36cd7b';
    const apiUrl = 'https://api.trakt.tv';
    const headers = { 'trakt-api-key': apiKey };

    if (search && search.length > 2) {
      return this.httpClient
        .get<{ show: Show }[]>(`${apiUrl}/search/show?extended=full&query=${search || ''}&networks=${network || ''}&years=${year || ''}`, {
          headers,
        })
        .pipe(map(response => response.map(x => x.show)));
    }
    return this.httpClient.get<Show[]>(`${apiUrl}/shows/popular?extended=full&networks=${network || ''}&years=${year || ''}`, {
      headers,
    });
  }

  private getOMDBPosterUrl(id: string): Observable<string> {
    return this.httpClient.get<any>(`http://www.omdbapi.com/?apikey=fb5f6564&i=${id}`).pipe(map(x => x.Poster));
  }
}
