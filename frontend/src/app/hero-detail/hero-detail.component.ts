import { HeroModel } from './../hero.model';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: HeroModel;
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.getHero();
  }

  getHero() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe((hero) => this.hero = hero);
  }
  goBack() {
    this.location.back();
  }
  save() {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  delete() {
    this.heroService.deleteHero(this.hero).subscribe(() => {
        this.goBack()
    })
  }
}
