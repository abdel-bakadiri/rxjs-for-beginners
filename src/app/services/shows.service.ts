import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Show, SearchResponse, PopularResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ShowsService {
  private readonly apiUrl = 'https://api.trakt.tv';
  private readonly headers = { 'trakt-api-key': 'd4fdc0c985770f4486f5c1d8a637c9d1cc4153933e7e258aa9a4b24a2d36cd7b' };

  constructor(private httpClient: HttpClient) {}

  getShows(network?: string, year?: number, searchText?: string): Observable<Show[]> {
    return !!searchText && searchText.length > 2 ? this.searchShows(searchText, network, year) : this.getPopularShows(network, year);
  }

  private getPopularShows(network?: string, year?: number): Observable<Show[]> {
    const url = `${this.apiUrl}/shows/popular?extended=full&networks=${network || ''}&years=${year || ''}`;
    return this.httpClient.get<PopularResponse>(url, { headers: this.headers });
  }

  private searchShows(searchText: string, network?: string, year?: number): Observable<Show[]> {
    const url = `${this.apiUrl}/search/show?extended=full&query=${searchText || ''}&networks=${network || ''}&years=${year || ''}`;
    return this.httpClient
      .get<SearchResponse>(url, { headers: this.headers })
      .pipe(map(response => response.map(x => x.show)));
  }
}
