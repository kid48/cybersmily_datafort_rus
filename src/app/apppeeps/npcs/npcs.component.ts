import { SeoService } from './../../shared/services/seo/seo.service';
import { DataService } from './../../shared/services/data.service';
import { NpcCard } from '../../shared/models/character';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cs-npcs',
  templateUrl: './npcs.component.html',
  styleUrls: ['./npcs.component.css']
})
export class NpcsComponent implements OnInit {

  npcRoster: NpcCard[];
  currNpcs: string;

  constructor(private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService) { }

  ngOnInit() {
    this.seo.updateMeta(
      'Cyberpunk 2020 Peeps',
      '2020-07, Cybersmily\'s Datafort Cyberpunk 2020 Peeps are NPCs from the various campaigns and scenarios over the years.'
    );
    this.getNpcs();
  }

  private LoadRosterFile(url: string) {
    this.dataService
    .GetJson(`/json/peeps/${url}.json`)
    .subscribe(
      resultObj => { this.npcRoster = resultObj.npcs; },
      error => console.log( 'Error :: ' + error)
    );
  }

  private getNpcs(): void {
    this.activatedRoute.url.subscribe(
      (url) => this.LoadRosterFile(url[0].path),
      error => console.log( 'Error :: ' + error)
    );
  }


}
