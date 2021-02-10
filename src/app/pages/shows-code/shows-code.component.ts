import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shows-code',
  templateUrl: './shows-code.component.html',
  styleUrls: ['./shows-code.component.scss'],
})
export class ShowsCodeComponent implements OnInit {
  readonly html = `<header>
  <span>TV Shows</span>
  <input [ngModel]="search$ | async" (ngModelChange)="onSearchInput($event)" placeholder="search" />
</header>

<main>
  <div *ngIf="shows$ | async as shows" class="table-wrapper">
    <table>
      <thead>
        <ng-container *ngFor="let header of headers">
          <th (click)="onSort(header)" [class.sorted]="header === (sortingProperty$ | async)">{{ header }}</th>
        </ng-container>
      </thead>
      <tr *ngFor="let show of shows">
        <td class="pointer" (click)="onShowSelect(show)">{{ show.title }}</td>
        <td class="pointer" (click)="onYearSelect(show.year)">{{ show.year }}</td>
        <td class="pointer" (click)="onNetworkSelect(show.network)">{{ show.network }}</td>
        <td>{{ show.status }}</td>
        <td>{{ show.rating | number: '0.1-1' }}</td>
      </tr>
    </table>
  </div>

  <div *ngIf="hasFilters$ | async" class="filters">
    <span class="pointer" (click)="onResetFilters()">reset filters</span>
  </div>

  <div *ngIf="selectedShow$ | async as selectedShow" class="selected-show">
    <div class="content-wrapper">
      <h2>{{ selectedShow.title }}</h2>
      <div>{{ selectedShow.overview }}</div>
    </div>
    <img [src]="posterUrl$ | async" />
  </div>
</main>`;

  readonly ts = `  readonly headers: (keyof Show)[] = ['title', 'year', 'network', 'status', 'rating'];
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
        .get<{ show: Show }[]>(\`\${apiUrl}/search/show?extended=full&query=\${search || ''}&networks=\${network || ''}&years=\${year || ''}\`, {
          headers,
        })
        .pipe(map(response => response.map(x => x.show)));
    }
    return this.httpClient.get<Show[]>(\`\${apiUrl}/shows/popular?extended=full&networks=\${network || ''}&years=\${year || ''}\`, {
      headers,
    });
  }

  private getOMDBPosterUrl(id: string): Observable<string> {
    return this.httpClient.get<any>(\`http://www.omdbapi.com/?apikey=fb5f6564&i=\${id}\`).pipe(map(x => x.Poster));
  }
  `;

  constructor() {}

  ngOnInit(): void {}
}
