import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  apiKey: string;
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.apiKey = 'e7f4ebb';
    this.baseUrl = 'http://www.omdbapi.com/?apikey=e7f4ebb';
  }

  getMovieData(name: string): Observable<any[]> {
    const url = `${this.baseUrl}&s=${encodeURIComponent(name)}&type=movie`;
    return this.http.get(url)
      .pipe(
        map((data: any) => data.Search ? data.Search : []),
        catchError(() => throwError(() => new Error('Filme não encontrado')))
      );
  }

  getMovieDetails(imdbID: string): Observable<any> {
    const url = `http://www.omdbapi.com/?i=${imdbID}&apikey=${this.apiKey}`;

    return this.http.get(url).pipe(
      map((data: any) => {
        const actors = typeof data.Actors === 'string' ? data.Actors.split(", ") : [];

        return {
          ...data,
          Actors: actors,
          Plot: data.Plot || "N/A"
        };
      }),
      catchError(() => throwError(() => new Error('Detalhes do filme não encontrados')))
    );
  }
}


