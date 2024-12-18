// questions.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, QuestionDocument } from 'lib/common';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class QuestionsRepository extends AbstractRepository<QuestionDocument> {
  protected readonly logger = new Logger(QuestionsRepository.name);

  constructor(
    @InjectModel(QuestionDocument.name) questionModel: Model<QuestionDocument>,
  ) {
    super(questionModel);
  }

  async find(filterQuery: FilterQuery<QuestionDocument>) {
    return this.model.find(filterQuery).lean<QuestionDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<QuestionDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }
}

/*
# Create a new question
curl -X POST http://localhost:3003/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kubernetes Pod Creation",
    "content": "Which command is used to create a new pod in Kubernetes?",
    "type": "multiple_choice",
    "correctAnswer": "kubectl create pod",
    "options": [
      "kubectl create pod",
      "kubectl run pod",
      "kubectl start pod",
      "kubectl deploy pod"
    ],
    "difficulty": 0,
    "pointsValue": 10,
    "units": ["65fd789abc012def345678"]
  }'

# Get all questions
curl http://localhost:3003/questions

# Get questions by unit
curl http://localhost:3003/questions?unitId=65fd789abc012def345678

# Get questions by difficulty
curl http://localhost:3003/questions?difficulty=1

# Get specific question
curl http://localhost:3003/questions/65fd456abc789def012345

*/
