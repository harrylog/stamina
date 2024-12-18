import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, SectionDocument } from 'lib/common';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class SectionsRepository extends AbstractRepository<SectionDocument> {
  protected readonly logger = new Logger(SectionsRepository.name);

  constructor(
    @InjectModel(SectionDocument.name) sectionModel: Model<SectionDocument>,
  ) {
    super(sectionModel);
  }

  async find(filterQuery: FilterQuery<SectionDocument>) {
    return this.model.find(filterQuery).lean<SectionDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<SectionDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }
}

/*
# Create a new section
curl -X POST http://localhost:3003/sections \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pod Management",
    "description": "Learn how to manage Kubernetes pods",
    "courseId": "65fd123abc456def789012", # Replace with actual course ID
    "orderIndex": 1
  }'

# Get all sections
curl http://localhost:3003/sections

# Get sections for a specific course
curl http://localhost:3003/sections?courseId=65fd123abc456def789012

# Get specific section
curl http://localhost:3003/sections/65fd456abc789def012345 # Replace with actual section ID

# Update a section
curl -X PUT http://localhost:3003/sections/65fd456abc789def012345 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Pod Management",
    "description": "Updated description"
  }'

# Add units to a section
curl -X PUT http://localhost:3003/sections/65fd456abc789def012345/units \
  -H "Content-Type: application/json" \
  -d '{
    "unitIds": ["65fd789abc012def345678", "65fd789abc012def345679"]
  }'
  */
