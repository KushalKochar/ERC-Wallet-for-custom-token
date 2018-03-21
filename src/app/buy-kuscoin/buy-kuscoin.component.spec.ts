import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyKuscoinComponent } from './buy-kuscoin.component';

describe('BuyKuscoinComponent', () => {
  let component: BuyKuscoinComponent;
  let fixture: ComponentFixture<BuyKuscoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyKuscoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyKuscoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
