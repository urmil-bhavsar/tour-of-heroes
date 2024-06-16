import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hero } from 'src/app/interfaces/hero';
import { HeroService } from 'src/app/services/hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit{
  @Input() hero?: Hero;

  ngOnInit(): void {
    this.getHero()
  }

  getHero():void {
    const id = Number(this.route.snapshot.paramMap.get("id"))
    this.heroService.getHero(id).subscribe(hero => this.hero = hero);
    console.log(this.hero)
  }

  goBack(): void{
    this.location.back()
  }

  save():void{
    if(this.hero){
      this.heroService.updateHero(this.hero).subscribe(()=>this.goBack())
    }
  }

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}
}
