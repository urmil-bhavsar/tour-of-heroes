import { Injectable } from '@angular/core';
import { HEROES } from '../mock-heroes';
import { Hero } from '../interfaces/hero';
import { Observable, catchError, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class HeroService {
  getHeroes(): Observable<Hero[]> {
    // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes
    // const heroes = of(HEROES);
    // this.messageService.add('HeroService: fetched heroes');
    // return heroes;

    // both 'of' and 'http.get()' return an Observable<Hero[]>
    // an observable can return more than one value over time. An observable from HttpClient always emits a single value and then completes, never to emit again

    // here '<Hero[]>' is the type specifier
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_=>this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    )
  }


  getHero(id: number): Observable<Hero> {

    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }


  // put req takes three params: url, data to update, options
  updateHero(hero: Hero): Observable<any>{
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_=>this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero)=>this.log(`added hero w/id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }


  // the convention is to name it _ to indicate that this parameter is intentionally unused. This is a common practice to avoid linting errors or confusion about unused parameters.
  deleteHero(id: number): Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_=>this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }


   // here <T> is the type parameter to return the safe value as the type that the application expects and it is used to handle erros of various types

  //  result? means that it is an optional parameter, it represent the value to be returned as an 'Observable' in case of error, its default value is undefined
   private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> =>{
      console.error(error);
      this.log(`${operation} failed: ${error.message}`)
      return of(result as T)
      
    }
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }



// tap() allows to perform sideeffects for each emitted value in an observable stream without modifying it
  searchHeroes(term: string): Observable<Hero[]>{
    if(!term.trim()){
      return of([])
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ? 
        this.log(`found heroes matching ${term}`):
        this.log(`no heroes matching ${term}`),
        catchError(this.handleError<Hero[]>('searchHeroes',[]))
      )
    )
  }

  private log(message: string){
    this.messageService.add(`HeroService: ${message}`)
  }

  private heroesUrl = 'api/heroes'

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}
}
