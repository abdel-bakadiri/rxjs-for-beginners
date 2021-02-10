import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rxjs-operators',
  templateUrl: './rxjs-operators.component.html',
  styleUrls: ['./rxjs-operators.component.scss'],
})
export class RxjsOperatorsComponent implements OnInit {
  readonly of = `of('myValue') // emits single value
of(1, 2, 3) // emits three values in sequence`;

  readonly from = `const arr = ['a', 'b', 'c'];
from(arr);
from([1, 2, 3]) // same as of(1, 2, 3), use from if you have an array`;

  readonly fromEvent = `fromEvent(document, 'click')`;
  readonly interval = `interval(1000) // emits numbers (0, 1, 2, 3...) every second`;
  readonly timer = `timer(1000) // emits 0 after 1 second and completes
timer(0, 5000) // starts emitting numbers immediately, emits every 5 seconds
timer(1000, 1000) // same as interval(1000)
`;

  readonly map = `timer(0, 100).pipe(map(x => x * 10))`;

  readonly switchMap = `const source$ = timer(0, 300);
const result$ = source$.pipe(
  switchMap(source => timer(0, 100).pipe(map(x => source + '' + x))
);`;

  readonly mergeMap = `const source$ = timer(0, 300);
const result$ = source$.pipe(
  mergeMap(source => timer(0, 100).pipe(map(x => source + '' + x))
);`;

  readonly concatMap = `const source$ = timer(0, 300);
const result$ = source$.pipe(
  concatMap(source => timer(0, 100).pipe(take(5), map(x => source + '' + x))
);`;

  readonly filter = `const source$ = timer(0, 100);
const result$ = source$.pipe(filter(x => x % 2));`;

  readonly distinctUntilChanged = `const source$ = of(1, 1, 2, 2, 3, 3, 3);
const result$ = source$.pipe(distinctUntilChanged());`;

  readonly take = `timer(0, 100).pipe(take(3))`;
  readonly skip = `timer(0, 100).pipe(skip(5))`;

  readonly combineLatest = `const a$ = timer(0, 100);
const b$ = timer(200, 300);
const result$ = combineLatest(a$, b$);`;

  readonly forkJoin = `const a$ = timer(0, 100).pipe(take(3));
const b$ = timer(200, 300).pipe(take(3));
const result$ = forkJoin(a$, b$);`;

  readonly zip = `const a$ = timer(0, 300);
const b$ = timer(100, 200).pipe(map(x => x* 10));
zip(a$, b$)`;

  readonly merge = `const a$ = timer(0, 200);
const b$ = timer(100, 200).pipe(map(x => x* 10));
merge(a$, b$)`;

  readonly startWith = `timer(100, 200).pipe(startWith(999));`;

  readonly tap = `timer(100, 200).pipe(tap(value => console.log({value})));`;

  readonly delay = `timer(100, 200).pipe(delay(100));`;

  readonly timeout = `const source$ = from([0, 100, 200, 450, 1000]).pipe(delayWhen(x => timer(x)));
const result$ = source$.pipe(timeout(300));`;

  readonly catchError = `const source$ = from([0, 100, 200, 450, 1000]).pipe(delayWhen(x => timer(x)));
const result$ = source$.pipe(
  timeout(300),
  catchError(err => of('TIMEOUT')),
);`;

  constructor() {}

  ngOnInit(): void {}
}
