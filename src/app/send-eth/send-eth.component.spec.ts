import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEthComponent } from './send-eth.component';

describe('SendEthComponent', () => {
  let component: SendEthComponent;
  let fixture: ComponentFixture<SendEthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
