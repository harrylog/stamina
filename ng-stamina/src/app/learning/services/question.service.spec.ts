import { TestBed } from '@angular/core/testing';
import { QuestionsService } from './question.service';


describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
