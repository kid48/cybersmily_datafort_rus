import { OpponentTrackerService } from './../services/opponent-tracker.service';
import { CpPlayerWeaponList } from './../../shared/models/weapon/cp-player-weapon-list';
import { CmbtTrckOpponent, CmbtTrckOppSelection, CmbtTrckTemplate } from '../../shared/models/cmbt-trck';
import { OppTemplateService } from './../services/opp-template.service';
import { OppCyberware } from './../../shared/models/cyberware';
import { DataSkill } from './../../shared/models/data/data-skill';
import { Cp2020ArmorBlock, Cp2020ArmorLayer, Cp2020Role, Cp2020PlayerSkill, Cp2020StatBlock} from './../../shared/models/cp2020character';
import { SkillListService } from './../../shared/services/data/skill-list.service';
import { DataService } from './../../shared/services/data.service';
import { Cp2020RolesDataService } from './../../shared/services/chargen/cp2020-roles-data.service';
import { forkJoin } from 'rxjs';
import { faDice, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'cs-cmbt-trck-opponent-card',
  templateUrl: './cmbt-trck-opponent-card.component.html',
  styleUrls: ['./cmbt-trck-opponent-card.component.css']
})
export class CmbtTrckOpponentCardComponent implements OnInit, OnChanges {
  dice = faDice;
  faTrash = faTrash;


  customClass = 'opp-section';
  currOpponent = new CmbtTrckOpponent();

  @Input()
  opponent = new CmbtTrckOpponent();

  @Input()
  index: number;

  selectedTemplate = null;
  templates = new Array<CmbtTrckTemplate>();
  selectedRole: Cp2020Role = null;
  roles: Array<Cp2020Role> = new Array<Cp2020Role>();
  skills: Array<DataSkill> = new Array<DataSkill>();

  constructor(private data: DataService,
    private roleService: Cp2020RolesDataService,
    private skillListService: SkillListService,
    private oppTemplateService: OppTemplateService,
    private opponentService: OpponentTrackerService
    ) { }

  ngOnInit() {
    const templates = this.oppTemplateService.TemplateList;
    const rolesList = this.roleService.getRoles();
    const skillList = this.skillListService.Skills;
    const opponents = this.opponentService.opponents;
    this.currOpponent = this.opponent;
    forkJoin([
      templates
      , rolesList
      , skillList
    ]).subscribe( results => {
      this.templates = results[0];
      this.roles = results[1];
      this.skills = results[2];
    }, err => {
      console.log(err);
    }
    );
  }

  ngOnChanges() {
    this.selectedTemplate = null;
    this.selectedRole = null;
    this.currOpponent = this.opponent;
  }

  onStatBlockChange(value: Cp2020StatBlock) {
    this.currOpponent.stats = value;
    this.opponentService.changeOpponent(this.currOpponent);
  }

  changeTemplate() {
    this.oppTemplateService.getTemplate(this.selectedTemplate)
    .subscribe( template => {
      this.currOpponent.importTemplate(template);
      this.selectedRole = this.roles.find( r => r.name === this.currOpponent.role);
      this.updateOpponent();
    });
  }

  changeWeapons(wpns: CpPlayerWeaponList) {
    if (!wpns) {
      return;
    }
    this.currOpponent.weapons = wpns.items;
    this.updateOpponent();
  }

  changeArmor(armor: Cp2020ArmorBlock) {
    this.currOpponent.armor = armor;
    this.currOpponent.stats.REF.ev = this.currOpponent.armor.ev;
    this.updateOpponent();
  }

  changeOpponent(opp?: CmbtTrckOpponent) {
    if (opp) {
      this.currOpponent = opp;
    }
    this.updateOpponent();
  }

  changeCyber(cyber: Array<OppCyberware>) {
    this.currOpponent.cyberware = cyber;
    // add any armor to as layers
    this.currOpponent.cyberware.filter( c => c.armor)
    .forEach( c => {
      const a = new Cp2020ArmorLayer(c.armor);
      a.name = c.name;
      a.isActive = true;
      a.isSkinWeave = c.name.toLowerCase().includes('skinweave');
      this.currOpponent.armor.addLayer(a);
    });
    this.updateOpponent();
  }

  changeGear(gear: Array<string>) {
    this.currOpponent.gear = gear;
    this.updateOpponent();
  }

  changeRole() {
    this.currOpponent.role = this.selectedRole.name;
    this.currOpponent.sa = new Cp2020PlayerSkill(this.selectedRole.specialability);
    this.selectedRole.skills.forEach( sk => {
      if (typeof sk === 'string') {
        // resolve ampersand in JSON file.
        sk = sk.replace('\\&', '&');
        this.addSkill(sk);
      }
      if (Array.isArray(sk)) {
        sk.forEach( s => {
          this.addSkill(s, true);
        });
      }
    });
    this.updateOpponent();
  }

  clear() {
    this.currOpponent = new CmbtTrckOpponent();
    this.opponent = new CmbtTrckOpponent();
    this.updateOpponent();
  }

  private addSkill(name: string, choice?: boolean) {
    const found = this.skills.find( skill => skill.name.toLowerCase() === name.toLowerCase());
    if (found) {
      this.currOpponent.addSkill(new Cp2020PlayerSkill({
        name: found.name,
        stat: found.stat,
        value: 0,
        roleskill: true,
        ischoice: choice
      }));
    }
    this.updateOpponent();
  }

  private updateOpponent() {
    this.opponentService.changeOpponent(this.currOpponent);
  }

  deleteRole() {
    this.currOpponent.role = '';
    this.updateOpponent();
  }
}
