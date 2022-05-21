// import { ObjectID } from 'bson';
import mongoose, { Model } from "mongoose";
import { ListOptions } from "../application/ListOptions";
import { Entity } from "../domain/Entity";
import { ITranslator } from "../domain/ITranslator";
import { Versionable } from "../domain/IVersionable";
import { Identifier } from "../domain/Identifier";

export class MongoProxy<I extends Identifier, T extends Versionable, E extends Entity<I, T>> {

  constructor(
    private readonly mongooseModel: Model<E>,
    private readonly translationService: ITranslator<E, T>
  ) {
  }

  public async create(entity: E): Promise<void> {
    await this.mongooseModel.create(this.translationService.toSnapshot(entity));
  }

  public async insertMany(entities: E[]): Promise<void> {
    const documents = entities.map(this.translationService.toSnapshot);
    await this.mongooseModel.insertMany(documents);
  }

  public async remove(args: mongoose.FilterQuery<T>): Promise<void> {
    await this.mongooseModel.deleteMany(args);
  }

  public async findOne(args: mongoose.FilterQuery<T>): Promise<E | null> {
    const document = await this.mongooseModel.findOne(args);
    if (!document) {
      return null;
    }
    return this.extendEntityWithVersion(document);
  }

  public async findOneOrThrow(args: mongoose.FilterQuery<T>): Promise<E> {
    const entity = await this.findOne(args);

    if (!entity) {
      // throw new RuntimeError('Entity not found');
      throw new Error("Entity not found");
    }

    return entity;
  }

  public async findById(id: Identifier): Promise<E | null> {
    const document = await this.mongooseModel.findById(id);
    if (!document) {
      return null;
    }
    return this.extendEntityWithVersion(document);
  }

  public async findByIdOrThrow(id: Identifier): Promise<E> {
    const entity = await this.findById(id);

    if (!entity) {
      // throw new RuntimeError('Entity not found by id');
      throw new Error("Entity not found");
    }

    return entity;
  }

  public async list(filter: mongoose.FilterQuery<T>, listOptions: ListOptions) {
    const documents = await this.mongooseModel.find(filter, null, {
      sort: listOptions.sortBy || "-createdAt",
      skip: listOptions.offset,
      limit: listOptions.limit
    });

    return documents.map(document => {
      return this.extendEntityWithVersion(document);
    });
  }

  public async find(args: mongoose.FilterQuery<T>, projection?: any | null, options?: any | null): Promise<E[]> {
    const documents = await this.mongooseModel.find(args, projection, options);

    return documents.map((document) => {
      return this.extendEntityWithVersion(document);
    });
  }

  // public findStream(args: mongoose.FilterQuery<Snapshot>, options?: any): Readable {
  //   return multipipe(
  //     this.mongooseModel
  //       .find(args)
  //       .cursor(options),
  //     this.extendEntityWithVersionStream()
  //   );
  // }

  public async updateOne(entity: E): Promise<void> {
    const filterQuery = {
      _id: entity.id.toObjectID(),
      version: entity.version
    };

    entity.incrementVersion();
    const updateQuery = {
      $set: {
        ...this.translationService.toSnapshot(entity)
      }
    };

    const { modifiedCount } = await this.mongooseModel.updateOne(filterQuery, updateQuery);

    if (modifiedCount === 0) {
      // throw new DocumentVersionError({
      //   collection: this.mongooseModel.collection.name,
      //   oldVersion: entity.version(),
      //   documentId: entity.id.toString(),
      //   db: 'MongoDB',
      // });
      throw Error("Version error");
    }
  }

  public async aggregate<T>(arg: mongoose.PipelineStage[]): Promise<T[]> {
    return this.mongooseModel.aggregate<T>(arg);
  }

  public async count(args: mongoose.FilterQuery<T>): Promise<number> {
    return this.mongooseModel.countDocuments(args);
  }

  private extendEntityWithVersion(document: T): E {
    const entity = this.translationService.toEntity(document);
    entity.setVersion(document.version || 0);
    return entity;
  }

  // private extendEntityWithVersionStream() {
  //   const extendEntityWithVersion = this.extendEntityWithVersion.bind(this);
  //
  //   return through2.obj(function(document, _, callback) {
  //     try {
  //       this.push(extendEntityWithVersion(document));
  //       callback(null);
  //     } catch (error) {
  //       callback(error);
  //     }
  //   });
  // }

  public async bulkUpdate(entities: E[]): Promise<void> {
    const { modifiedCount } = await this.mongooseModel.bulkWrite(entities.map(entity => {
      const filterQuery = {
        _id: entity.id.toObjectID(),
        version: entity.version
      };

      const updateQuery = {
        $set: {
          ...this.translationService.toSnapshot(entity)
        },
        $inc: {
          version: 1
        }
      };

      return {
        updateOne: {
          filter: filterQuery,
          update: updateQuery
        }
      };
    }));

    if (modifiedCount !== entities.length) {
      // throw new DocumentBulkError({
      //   collection: this.mongooseModel.collection.name,
      //   documentIds: entities.map(entity => entity.id.toHexString()),
      //   db: 'MongoDB',
      // });
      throw new Error("Version error");
    }

    for (const entity of entities) {
      entity.incrementVersion();
    }
  }
}
