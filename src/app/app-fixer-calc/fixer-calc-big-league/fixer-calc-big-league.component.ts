import { SaveFileService } from './../../shared/services/save-file.service';
import { BigLeagueContact } from './../../shared/models/fixer/big-league-contact';
import { FixerBigLeagueService } from './../../shared/services/fixer/fixer-big-league.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BigLeagueCategories } from './../../shared/models/fixer/big-league-categories';

@Component({
  selector: 'cs-fixer-calc-big-league',
  templateUrl: './fixer-calc-big-league.component.html',
  styleUrls: ['./fixer-calc-big-league.component.css']
})
export class FixerCalcBigLeagueComponent implements OnInit {
  streetdeal = 0;
  contacts: Array<BigLeagueContact> = new Array<BigLeagueContact>();

  constructor(private bigLeague: FixerBigLeagueService,
              private fileService: SaveFileService
    ) {}

  ngOnInit() {
    this.bigLeague.model.subscribe( c => {
      this.contacts = c.contacts;
      this.streetdeal = c.streetdeal;
    });
  }

  get totalPoints(): number {
    return this.bigLeague.totalPoints;
  }

  get spentPoints(): number {
    return this.bigLeague.spentPoints;
  }

  get availablePoints(): number {
    return this.bigLeague.availablePoints;
  }

  changeStreetdeal() {
    this.bigLeague.setStreetdeal(this.streetdeal);
  }

  addContact(value: BigLeagueContact) {
    this.bigLeague.addContact(value);
  }

  deleteContact(index: number) {
    this.bigLeague.deleteContact(index);
  }
  editContact(contact: BigLeagueContact) {
    this.bigLeague.updateContact(contact);
  }

  reset() {
    this.bigLeague.reset();
  }

  save() {
    this.fileService.SaveAsFile('FixerBigLeagueContacts', this.bigLeague.toString());
  }
}
