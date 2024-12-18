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
