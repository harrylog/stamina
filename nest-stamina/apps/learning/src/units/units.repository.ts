import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, UnitDocument } from 'lib/common';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UnitsRepository extends AbstractRepository<UnitDocument> {
  protected readonly logger = new Logger(UnitsRepository.name);

  constructor(@InjectModel(UnitDocument.name) unitModel: Model<UnitDocument>) {
    super(unitModel);
  }

  async find(filterQuery: FilterQuery<UnitDocument>) {
    return this.model.find(filterQuery).lean<UnitDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<UnitDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }
}
/*
# 1. Create a Course
curl -X POST http://localhost:3003/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kubernetes Fundamentals",
    "description": "Learn K8s basics and core concepts",
    "technology": "kubernetes",
    "difficulty": 0
  }'

# Store the response course ID, for example:
COURSE_ID="65fd123abc456def789012"

# 2. Create a Section
curl -X POST http://localhost:3003/sections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pod Management",
    "description": "Learn all about Kubernetes pods",
    "courseId": "65fd123abc456def789012",
    "orderIndex": 0
  }'

# Store the response section ID, for example:
SECTION_ID="65fd456abc789def012345"

# 3. Create a Unit
curl -X POST http://localhost:3003/units \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Creating and Managing Pods",
    "description": "Learn how to create, update, and delete pods",
    "sectionId": "65fd456abc789def012345",
    "orderIndex": 0,
    "xpValue": 50
  }'

# Store the response unit ID, for example:
UNIT_ID="65fd789abc012def345678"

# 4. Create Questions
curl -X POST http://localhost:3003/questions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pod Creation Command",
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
    "pointsValue": 10
  }'

# Store the response question ID, for example:
QUESTION_ID="65fd890abc123def456789"

# 5. Add Section to Course
curl -X PUT http://localhost:3003/courses/65fd123abc456def789012/sections \
  -H "Content-Type: application/json" \
  -d '{
    "sectionIds": ["65fd456abc789def012345"]
  }'

# 6. Add Question to Unit
curl -X PUT http://localhost:3003/units/65fd789abc012def345678/questions \
  -H "Content-Type: application/json" \
  -d '{
    "questionIds": ["65fd890abc123def456789"]
  }'

# 7. Initialize User Progress
curl -X POST http://localhost:3003/progress \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "65fd111abc222def333444",
    "courseId": "65fd123abc456def789012"
  }'

# 8. Record Question Attempt
curl -X PUT http://localhost:3003/progress/65fd111abc222def333444/courses/65fd123abc456def789012/units \
  -H "Content-Type: application/json" \
  -d '{
    "unitId": "65fd789abc012def345678",
    "questionAttempts": [{
      "questionId": "65fd890abc123def456789",
      "score": 10,
      "isCorrect": true
    }]
  }'

# 9. Check Progress
curl http://localhost:3003/progress/65fd111abc222def333444/courses/65fd123abc456def789012

# 10. Get Unit Completion Status
curl http://localhost:3003/progress/65fd111abc222def333444/courses/65fd123abc456def789012/units/65fd789abc012def345678/completion

*/
