import { HeroService } from './../hero.service';
import { HeroModel } from './../hero.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: HeroModel[];

  constructor(public heroService: HeroService) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes() {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
    });
  }
  add(id, name: string) {
    id = parseInt(id.trim(), 10);
    name = name.trim();
    if (!name || !id) { return; }
    this.heroService.addHero({ id, name } as HeroModel)
      .subscribe(() => {
        this.heroes.push({ id, name });
      });
  }
}
