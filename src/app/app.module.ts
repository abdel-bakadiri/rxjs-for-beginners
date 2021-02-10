import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveProgrammingComponent } from './pages/reactive-programming/reactive-programming.component';
import { ObserverPatternComponent } from './pages/observer-pattern/observer-pattern.component';
import { ObservableComponent } from './pages/observable/observable.component';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { ObservablesInAngularComponent } from './pages/observables-in-angular/observables-in-angular.component';
import { BasicUsageComponent } from './pages/basic-usage/basic-usage.component';
import { UnsubscribeComponent } from './pages/unsubscribe/unsubscribe.component';
import { RxjsOperatorsComponent } from './pages/rxjs-operators/rxjs-operators.component';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { TheEndComponent } from './pages/the-end/the-end.component';
import { StartComponent } from './pages/start/start.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { FormsModule } from '@angular/forms';
import { ReactivexComponent } from './pages/reactivex/reactivex.component';
import { ShowsCodeComponent } from './pages/shows-code/shows-code.component';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveProgrammingComponent,
    ObserverPatternComponent,
    ObservableComponent,
    ObservablesInAngularComponent,
    BasicUsageComponent,
    UnsubscribeComponent,
    RxjsOperatorsComponent,
    SubjectsComponent,
    TheEndComponent,
    StartComponent,
    ShowsComponent,
    ReactivexComponent,
    ShowsCodeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HighlightModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatExpansionModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
