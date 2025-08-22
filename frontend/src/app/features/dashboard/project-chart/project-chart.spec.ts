import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectChart } from './project-chart';

describe('ProjectChart', () => {
  let component: ProjectChart;
  let fixture: ComponentFixture<ProjectChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
