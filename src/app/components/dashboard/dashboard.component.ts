import { Component, OnInit } from '@angular/core';
import { Observable, filter, of } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  heroes!: Hero[];

  // the constructor will inject the HeroService into a private heroService property
  constructor( private heroService: HeroService){}

  ngOnInit(): void {
    this.getHeroes()
  }

  getHeroes(): void{
    // this.heroService.getHeroes().subscribe(heroes=>this.heroes = heroes.slice(1,5))
    this.heroService.getHeroes().subscribe(heroes=>this.filterAndSearchHeroes(heroes))
    
  }

  filterAndSearchHeroes(arr: Hero[]):void {
    console.log(arr)
    this.filterHeroes(arr).subscribe(filteredHeroes=>this.heroes =filteredHeroes)
  }

  filterHeroes(arr: Hero[]): Observable<Hero[]>{
    let newArr: Hero[] = [];
    // let randomIndexArr: number[] = []
    let randomIndexArr = new Set<number>()
    while(newArr.length < 4){
      const randomIndex = Math.floor(Math.random() * arr.length)
      if(!randomIndexArr.has(randomIndex)){
        randomIndexArr.add(randomIndex)
        newArr.push(arr[randomIndex])
      } 
    }
    
    console.log(randomIndexArr)
    console.log(newArr)

    return new Observable<Hero[]>(observer => {
      console.log(observer)
      observer.next(newArr)
      observer.complete()
    })

    return of(newArr)
  }

}
