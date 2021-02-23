import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  readonly subject = `const subject$ = new Subject();
subject$.next(0);
setTimeout(() => subject$.next(1), 0);
setTimeout(() => subject$.next(2), 1000);
subject$.subscribe();`;

  readonly behaviorSubject = `const behaviorSubject$ = new BehaviorSubject(-1);
behaviorSubject$.next(0);
setTimeout(() => behaviorSubject$.next(1), 0);
setTimeout(() => behaviorSubject$.next(2), 1000);
behaviorSubject$.subscribe();
console.log(behaviorSubject$.value);`;

  readonly replaySubject = `const replaySubject$ = new ReplaySubject(2);
replaySubject$.next(0);
setTimeout(() => replaySubject$.next(1), 0);
setTimeout(() => replaySubject$.next(2), 1000);
replaySubject$.subscribe();`;

  constructor() {}

  ngOnInit(): void {}
}
