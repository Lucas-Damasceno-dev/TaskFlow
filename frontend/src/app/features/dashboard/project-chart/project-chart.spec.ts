import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectChartComponent } from './project-chart';

describe('ProjectChartComponent', () => {
  let component: ProjectChartComponent;
  let fixture: ComponentFixture<ProjectChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
