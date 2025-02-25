import { Component, OnInit } from '@angular/core';
import { faAngleDoubleRight, faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'cs-cmbt-trck-instructions',
  templateUrl: './cmbt-trck-instructions.component.html',
  styleUrls: ['./cmbt-trck-instructions.component.css']
})
export class CmbtTrckInstructionsComponent implements OnInit {
  isCollapsed = true;
  isLeftCollapsed = true;
  isRightCollapsed = true;
  isModifiedCollapsed = true;
  isStatCollapsed = true;
  isSkillCollapsed = true;
  isWeaponCollapsed = true;
  isCyberwareCollapsed = true;
  isWoundsCollapsed = true;
  isArmorCollapsed = true;
  isGearCollapsed = true;
  faAngleDoubleRight = faAngleDoubleRight;
  faAngleDoubleDown = faAngleDoubleDown;

  constructor() { }

  ngOnInit() {
  }

}
