import { FamilyGeneratorService } from '../../shared/services/lifepath/family-generator.service';
import { LifepathFamily } from '../../shared/models/lifepath';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cs-lifepath-family',
  templateUrl: './lifepath-family.component.html',
  styleUrls: ['./lifepath-family.component.css']
})
export class LifepathFamilyComponent implements OnInit {

  @Input()
  lifepathSource: string;

  @Output()
  generateValue = new EventEmitter();

  generatedFamily: LifepathFamily;

  constructor(private familyGenService: FamilyGeneratorService) {
  }

  ngOnInit() {
    this.generatedFamily = new LifepathFamily();
    this.lifepathSource = 'CP2020';
  }
  generateFamily() {
    if (this.lifepathSource !== '') {
      this.familyGenService
        .GenerateFamily(this.lifepathSource).subscribe(data => {
          this.generatedFamily = data;
          this.onGenerate(this.generatedFamily);
        });
    }
  }

  onGenerate(family: LifepathFamily) {
    this.generateValue.emit(family);
  }
}
