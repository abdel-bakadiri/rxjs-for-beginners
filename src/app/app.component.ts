import { trigger, transition } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivationStart, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { left, right } from './animations/slide-in';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [trigger('routeAnimations', [transition(':increment', left), transition(':decrement', right)])],
})
export class AppComponent implements OnInit, OnDestroy {
  pageId$: Observable<number>;

  private readonly subscription = new Subscription();

  constructor(private router: Router, private snackBar: MatSnackBar) {
    this.pageId$ = this.router.events.pipe(
      filter((e): e is ActivationStart => e instanceof ActivationStart),
      map(e => e.snapshot.url[0].path.match(/(?:page-)(\d+)/)),
      map(match => (match && match.length > 1 ? +match[1] : 0))
    );
  }

  ngOnInit(): void {
    this.snackBar.open('Use left and right arrows to navigate between slides', undefined, { duration: 5000 });
    const keyDown$ = fromEvent<KeyboardEvent>(document, 'keydown');
    const arrowRight$ = keyDown$.pipe(filter(e => e.key === 'ArrowRight'));
    const arrowLeft$ = keyDown$.pipe(filter(e => e.key === 'ArrowLeft'));
    const pageIdDelta$ = merge(arrowRight$.pipe(map(() => 1)), arrowLeft$.pipe(map(() => -1)));
    const newPageId$ = pageIdDelta$.pipe(
      withLatestFrom(this.pageId$),
      map(([delta, index]) => index + delta)
    );

    this.subscription.add(newPageId$.subscribe(pageId => this.router.navigate([`/page-${pageId}`]).catch(() => {})));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
