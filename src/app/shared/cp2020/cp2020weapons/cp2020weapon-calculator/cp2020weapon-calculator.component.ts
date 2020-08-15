import { CombatRange } from './../../../models/weapon/combat-range';
import { Cp2020PlayerSkills } from './../../../models/cp2020character/cp2020-player-skills';
import { DiceService } from './../../../services/dice/dice.service';
import { Cp2020PlayerSkill } from './../../../models/cp2020character/cp2020-player-skill';
import { CpPlayerWeaponList, CpPlayerWeapon } from './../../../models/weapon';
import { faDice } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cs-cp2020weapon-calculator',
  templateUrl: './cp2020weapon-calculator.component.html',
  styleUrls: ['./cp2020weapon-calculator.component.css'],
})
export class Cp2020weaponCalculatorComponent implements OnInit {
  faDice = faDice;
  @Input()
  weaponList: CpPlayerWeaponList = new CpPlayerWeaponList();

  @Input()
  ref = 0;

  @Input()
  bodyDamageMod = 0;

  @Input()
  body = 0;

  @Input()
  skills: Cp2020PlayerSkills = new Cp2020PlayerSkills();

  shots = 0;
  rangeToTarget = 1;
  fireMode = 2; // default to single shot
  shotsFired = 0;
  aimedTurns = 0;
  targetMovementModified = 0;
  targetSize = 0;
  targetDodge = false;
  targetSilhoutted = false;
  turnToFaceTarget = false;
  smartWeapon = false;
  laserSight = false;
  teleSight = false;
  targetScope = false;

  fastDraw = false;
  ambush = false;
  aimedBody = false;
  ricochet = false;
  blind = false;
  twoWeapons = false;
  running = false;
  fireFromHip = false;

  otherToHitModifiers = 0;

  selectedSkill: Cp2020PlayerSkill = new Cp2020PlayerSkill();
  selectedWeapon: CpPlayerWeapon;

  constructor(private diceService: DiceService) {}

  ngOnInit(): void {}
  get filteredList(): Array<CpPlayerWeapon> {
    return this.weaponList.items.filter((wpn) => wpn.name !== '');
  }

  get targetActionModifier(): number {
    let total = 0;
    total += this.targetDodge ? 2 : 0;
    total += this.targetSilhoutted ? -2 : 0;
    total += this.turnToFaceTarget ? 2 : 0;
    return total;
  }

  get attackerActionModifier(): number {
    let total = 0;
    total += this.fastDraw ? 3 : 0;
    total += this.ambush ? -5 : 0;
    total += this.aimedBody ? 4 : 0;
    total += this.ricochet ? 5 : 0;
    total += this.blind ? 3 : 0;
    total += this.twoWeapons ? 3 : 0;
    total += this.running ? 3 : 0;
    total += this.fireFromHip ? 2 : 0;
    return total;
  }

  get sightSmartModifier(): number {
    let total = 0;
    total += this.smartWeapon ? -2 : 0;
    total += this.laserSight ? -1 : 0;
    total += this.teleSight ? this.selectedWeaponBracket.bracket === 'Medium'
        ? -1
        : this.selectedWeaponBracket.bracket === 'Extreme'
        ? -2
        : 0 : 0;
    total += this.targetScope ? -1 : 0;
    return total;
  }

  get filteredSkills(): Array<Cp2020PlayerSkill> {
    if (this.selectedWeapon) {
      return this.skills.getSkillForWeaponType(this.selectedWeapon.type);
    }
    return [];
  }
  get totalDiff(): number {
    let total = 0;
    total = this.selectedWeaponBracket.diff;
    total += this.aimedTurns;
    total += this.fireModeModifier;
    total += this.targetMovementModified;
    total += this.targetSize;
    total += this.targetActionModifier;
    total += this.sightSmartModifier;
    total += this.attackerActionModifier;
    total += this.otherToHitModifiers;
    return total;
  }

  get selectedWeaponBracket(): CombatRange {
    return this.selectedWeapon.getRangeBracket(this.rangeToTarget);
  }

  get fireModeModifier(): number {
    if (this.fireMode === 1 && this.selectedWeaponBracket.diff < 16) {
      return -3;
    }
    if (this.fireMode === 3) {
      return (this.selectedWeaponBracket.diff < 11 ? 1 : -1) * Math.ceil(this.shotsFired / 10);
    }
    return 0;
  }

  get fireShots(): number {
    if (this.fireMode === 2) {
      return this.selectedWeapon.rof > 3 ? 2 : this.selectedWeapon.rof;
    } else {
      return this.selectedWeapon.rof;
    }
  }

  get weaponRange(): number {
    if (this.selectedWeapon.range && this.selectedWeapon.range > 0) {
      return this.selectedWeapon.range;
    }
    if (this.selectedWeapon.thrown) {
      return this.body * 10;
    }
    switch (this.selectedWeapon.type.toLowerCase()) {
      case 'p':
        return 50;
      case 'smg':
        return 150;
      case 'rif':
        return 400;
      case 'sht':
        return 50;
      default:
        return 1;
    }
  }

  changeWeapon() {
    this.selectedSkill = new Cp2020PlayerSkill();
    if (this.selectedWeapon && this.filteredSkills.length < 2) {
      this.selectedSkill = this.filteredSkills[0];
    }
  }
}
