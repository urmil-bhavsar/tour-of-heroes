import { Component, OnInit } from '@angular/core';
import { Observable, Subject, debounce, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero';
import { HeroService } from 'src/app/services/hero.service';



@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService){}

  // push a search term into the observable stream
  search(term: string): void{
    this.searchTerms.next(term)
  }

  ngOnInit(): void {
      this.heroes$ = this.searchTerms.pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(300),

        // ignore new term if same as previous one
        distinctUntilChanged(),

        // switch to new search observable each time the term changes, it cancels and discards previous search observables, returning only the latest search service observables.
        switchMap((term: string)=> this.heroService.searchHeroes(term))
      )
  }

}

