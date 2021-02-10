import { NgModule, Type } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowsComponent } from './pages/shows/shows.component';
import { BasicUsageComponent } from './pages/basic-usage/basic-usage.component';
import { ObservableComponent } from './pages/observable/observable.component';
import { ObservablesInAngularComponent } from './pages/observables-in-angular/observables-in-angular.component';
import { ObserverPatternComponent } from './pages/observer-pattern/observer-pattern.component';
import { ReactiveProgrammingComponent } from './pages/reactive-programming/reactive-programming.component';
import { ReactivexComponent } from './pages/reactivex/reactivex.component';
import { RxjsOperatorsComponent } from './pages/rxjs-operators/rxjs-operators.component';
import { ShowsCodeComponent } from './pages/shows-code/shows-code.component';
import { StartComponent } from './pages/start/start.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { TheEndComponent } from './pages/the-end/the-end.component';
import { UnsubscribeComponent } from './pages/unsubscribe/unsubscribe.component';

const pageComponents: Type<unknown>[] = [
  StartComponent,
  ReactiveProgrammingComponent,
  ObserverPatternComponent,
  ReactivexComponent,
  ObservableComponent,
  ObservablesInAngularComponent,
  BasicUsageComponent,
  UnsubscribeComponent,
  RxjsOperatorsComponent,
  SubjectsComponent,
  TheEndComponent,
  ShowsComponent,
  ShowsCodeComponent,
];

const routes: Routes = pageComponents.map((component, index) => ({ component, path: `page-${index + 1}` }));
routes.push({ path: '', pathMatch: 'full', redirectTo: 'page-1' });

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
