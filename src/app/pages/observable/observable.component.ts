import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.scss'],
})
export class ObservableComponent implements OnInit {
  readonly code = `const obs$ = new Observable((subscriber) => {
  subscriber.next(1);
  setTimeout(() => subscriber.next(2), 1000);
  setTimeout(() => subscriber.next(3), 2000);
  setTimeout(() => subscriber.complete(), 3000);
});`;

  constructor() {}

  ngOnInit(): void {}
}
