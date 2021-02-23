import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  readonly code = `ngOnInit() {
  interval(2000).pipe(skip(5), take(1), map(() => alert('Hello World')));
}`;

  constructor() {}

  ngOnInit(): void {}
}
