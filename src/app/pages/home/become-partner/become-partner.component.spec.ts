import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomePartnerComponent } from './become-partner.component';

describe('BecomePartnerComponent', () => {
  let component: BecomePartnerComponent;
  let fixture: ComponentFixture<BecomePartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomePartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BecomePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
