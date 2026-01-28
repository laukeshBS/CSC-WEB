import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BfaregistrationComponent } from './bfaregistration.component';

describe('BfaregistrationComponent', () => {
  let component: BfaregistrationComponent;
  let fixture: ComponentFixture<BfaregistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BfaregistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BfaregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
