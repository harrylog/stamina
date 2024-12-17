import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, CourseDocument } from 'lib/common';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class CoursesRepository extends AbstractRepository<CourseDocument> {
  protected readonly logger = new Logger(CoursesRepository.name);

  constructor(
    @InjectModel(CourseDocument.name) courseModel: Model<CourseDocument>,
  ) {
    super(courseModel);
  }

  async find(filterQuery: FilterQuery<CourseDocument>) {
    return this.model.find(filterQuery).lean<CourseDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<CourseDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }
}

/*curl -X POST http://localhost:3003/courses \    ──(Tue,Dec17)─┘
  -H "Content-Type: application/json" \
  -d '{
    "title": "Kubernetes Fundamentals",
    "description": "Learn K8s basics",
    "technology": "kubernetes",
    "difficulty": 1
  }'
*/

//curl http://localhost:3003/courses

//curl http://localhost:3003/courses?technology=kubernetes
