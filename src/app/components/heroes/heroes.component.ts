import { Component, OnInit } from '@angular/core';
import { interval, of } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero';
import { HEROES } from 'src/app/mock-heroes';
import { HeroService } from 'src/app/services/hero.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  selectedHero?: Hero;


  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes=>this.heroes = heroes);
  }

  add(name: string): void{
    name = name.trim();
    if(!name){
      return;
    }
    this.heroService.addHero({name} as Hero).subscribe(hero=>{
      this.heroes.push(hero)
    })
  }

  // an observable wont do anything until a subscriber subscribes to it,so if there is no subscriber of this delete function, then http req wont't be made
  delete(hero: Hero):void{
    this.heroes = this.heroes.filter(h=> h !== hero);
    this.heroService.deleteHero(hero.id).subscribe()
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  constructor(private heroService: HeroService, private messageService: MessageService) {}
}
