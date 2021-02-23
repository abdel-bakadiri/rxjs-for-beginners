import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.scss'],
})
export class UnsubscribeComponent implements OnInit {
  readonly leakCode = `@Component({
  selector: 'app-unsubscribe',
  template: '{{message}}',
})
export class UnsubscribeComponent implements OnInit {
  message = '';

  ngOnInit(): void {
    interval(1000).subscribe(value => this.message = \`You're looking at this page for \${value + 1} seconds!\`);
  }
}`;

  readonly howCode = `@Component({
  selector: 'app-unsubscribe',
  template: '{{message}}',
})
export class UnsubscribeComponent implements OnInit, OnDestroy {
  message = '';

  private readonly sub = new Subscription();

  ngOnInit(): void {
    this.sub.add(
      interval(1000).subscribe(value => this.message = \`You're looking at this page for \${value + 1} seconds!\`)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}`;

  readonly asyncCode = `@Component({
  selector: 'app-unsubscribe',
  template: '{{message$ | async}}',
})
export class UnsubscribeComponent implements OnInit {
  message$: Observable<string> | undefined;

  ngOnInit(): void {
    this.message$ = interval(1000).pipe(
      map(value => \`You're looking at this page for \${value + 1} seconds!\`)
    );
  }
}`;

  readonly ngFor = `// TS
this.items$ = this.httpClient.get<Item[]>('/api');
// HTML
<div *ngFor="let item of items$ | async">`;

  readonly ngIf = `// TS
this.result$ = this.httpClient.get<Result>('/api');
// HTML
<div *ngIf="result$ | async as results">`;

  message$: Observable<string> | undefined;

  ngOnInit(): void {
    this.message$ = interval(1000).pipe(map(value => `You're looking at this page for ${value + 1} seconds!`));
  }
}
