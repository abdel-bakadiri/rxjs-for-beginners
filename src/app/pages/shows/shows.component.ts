import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest, BehaviorSubject, ObservableInput, ObservedValueOf, OperatorFunction, Subject, pipe } from 'rxjs';
import { map, switchMap, pairwise, startWith, scan, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Show } from 'src/app/models';
import { ShowsService } from 'src/app/services/shows.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowsComponent implements OnInit {
  readonly headers: (keyof Show)[] = ['title', 'year', 'network', 'status', 'rating'];

  readonly selectedNetwork$ = new BehaviorSubject<string | undefined>(undefined);
  readonly selectedYear$ = new BehaviorSubject<number | undefined>(undefined);
  readonly sortingProperty$ = new BehaviorSubject<keyof Show>('title');
  readonly searchText$ = new BehaviorSubject<string | undefined>(undefined);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  shows$: Observable<Show[]> | undefined;

  constructor(private showsService: ShowsService) {}

  ngOnInit(): void {
    const shows$ = combineLatest([this.selectedNetwork$, this.selectedYear$, this.searchText$.pipe(debounceTime(250))]).pipe(
      debounceTime(0),
      distinctUntilChanged((arrayA, arrayB) => arrayA.every((x, i) => x === arrayB[i])),
      switchMapWithLoading(this.isLoading$, ([network, year, search]) => this.showsService.getShows(network, year, search))
    );
    const sortingDesc$ = this.sortingProperty$.pipe(
      pairwise(),
      scan((desc, [previous, current]) => previous === current && !desc, false),
      startWith(false)
    );
    this.shows$ = combineLatest([shows$, this.sortingProperty$, sortingDesc$]).pipe(
      map(([shows, sortProperty, sortDesc]) => this.sortShows(shows, sortProperty, sortDesc))
    );
  }

  onNetworkSelect(network: string): void {
    this.selectedNetwork$.next(network);
  }

  onYearSelect(year: number): void {
    this.selectedYear$.next(year);
  }

  onSort(property: keyof Show): void {
    this.sortingProperty$.next(property);
  }

  onResetFilters(): void {
    this.selectedNetwork$.next(undefined);
    this.selectedYear$.next(undefined);
    this.searchText$.next(undefined);
  }

  onSearchInput(input: string) {
    this.searchText$.next(input);
  }

  private sortShows(shows: Show[], property: keyof Show = 'title', desc: boolean = false): Show[] {
    return shows.sort((a, b) => (a[property] === b[property] ? 0 : a[property] > b[property] ? 1 : -1) * (desc ? -1 : 1));
  }
}

function switchMapWithLoading<T, O extends ObservableInput<any>>(
  isLoading$: Subject<boolean>,
  project: (value: T, index: number) => O
): OperatorFunction<T, ObservedValueOf<O>> {
  return pipe(
    tap(() => isLoading$.next(true)),
    switchMap(project),
    tap(() => isLoading$.next(false))
  );
}
