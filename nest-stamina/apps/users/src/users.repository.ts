import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository, UserDocument } from 'lib/common';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(@InjectModel(UserDocument.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  async find(filterQuery: FilterQuery<UserDocument>) {
    return this.model.find(filterQuery).lean<UserDocument[]>(true);
  }

  async count(filterQuery: FilterQuery<UserDocument>): Promise<number> {
    return this.model.countDocuments(filterQuery);
  }

  async deleteMany(filterQuery: FilterQuery<UserDocument>) {
    const result = await this.model.deleteMany(filterQuery);
    return { deletedCount: result.deletedCount };
  }
}
