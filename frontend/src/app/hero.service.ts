import { MessageService } from './message.service';
import { HeroModel } from './hero.model';
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class HeroService {
  private heroesUrl = 'http://localhost:8080/heroes';
  private heroUrl = 'http://localhost:8080/hero/';
  private updateUrl = 'http://localhost:8080/update';
  private searchUrl = 'http://localhost:8080/search';
  private addUrl = 'http://localhost:8080/insert';
  private deleteUrl = 'http://localhost:8080/delete';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getHeroes(): Observable<HeroModel[]> {
    this.log('已获取到所有英雄');
    return this.http.get<HeroModel[]>(this.heroesUrl);
    // return of(HEROES);
  }

  getHero(id: number): Observable<HeroModel> {
    this.log(`已获取到该英雄,id为${id}`);
    // return of(HEROES.find((hero) => hero.id === id));
    return this.http.get<HeroModel>(this.heroUrl + id);
  }

  updateHero(hero: HeroModel): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post(this.updateUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  searchHeroes(term: string): Observable<HeroModel[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<HeroModel[]>(`${this.searchUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<HeroModel[]>('searchHeroes', []))
    );
  }
  addHero(hero: HeroModel): Observable<HeroModel> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<HeroModel>(this.addUrl, hero, httpOptions)
      .pipe(
          // tap((hero: HeroModel) => this.log(`added hero w/ id=${hero.id}`)),
          catchError(this.handleError<HeroModel>('addHero'))
      );
  }
  deleteHero(hero: HeroModel): Observable<HeroModel> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<HeroModel>(this.deleteUrl, hero, httpOptions)
      .pipe(
          // tap((hero: HeroModel) => this.log(`added hero w/ id=${hero.id}`)),
          catchError(this.handleError<HeroModel>('addHero'))
      );
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
