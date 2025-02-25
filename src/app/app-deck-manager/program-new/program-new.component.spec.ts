import { DataService } from './../../shared/services/data.service';
import { NrProgramOptionsService } from './../../shared/services/netrun/nr-program-options.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonUiModule } from './../../shared/modules/common-ui/common-ui.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramNewComponent } from './program-new.component';

describe('ProgramNewComponent', () => {
  let component: ProgramNewComponent;
  let fixture: ComponentFixture<ProgramNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramNewComponent ],
      imports: [
        CommonUiModule,
        HttpClientTestingModule
      ],
      providers: [
        NrProgramOptionsService,
        DataService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
