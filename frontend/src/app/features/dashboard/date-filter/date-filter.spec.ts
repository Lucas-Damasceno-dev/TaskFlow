import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateFilter } from './date-filter';
import { FormsModule } from '@angular/forms';

describe('DateFilter', () => {
  let component: DateFilter;
  let fixture: ComponentFixture<DateFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateFilter, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
