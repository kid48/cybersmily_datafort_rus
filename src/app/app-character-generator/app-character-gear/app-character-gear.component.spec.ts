import { CommonUiModule } from './../../shared/modules/common-ui/common-ui.module';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCharacterGearComponent } from './app-character-gear.component';

describe('AppCharacterGearComponent', () => {
  let component: AppCharacterGearComponent;
  let fixture: ComponentFixture<AppCharacterGearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCharacterGearComponent ],
      imports: [ CommonUiModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCharacterGearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
