import { Logger, NotFoundException } from "@nestjs/common"
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose"
import { AbstractEntity } from "./abstract.entity"

export abstract class AbstractRepository<TDocument extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(public readonly model: Model<TDocument>) { }
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean<TDocument>();
    if (!document) {
      this.logger.warn('Document was not found with the filterQuery', filterQuery);
      throw new NotFoundException('Document not found.')
    }
    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      new: true
    }).lean<TDocument>();
    if (!document) {
      this.logger.warn('Document was not found with the filterQuery', filterQuery);
      throw new NotFoundException('Document not found.')
    }
    return document;
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery).lean<TDocument[]>();
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    return await this.model.findOneAndDelete(filterQuery).lean<TDocument>();
  }
}