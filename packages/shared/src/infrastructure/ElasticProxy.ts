import { ListOptions } from '../application/ListOptions';
import { Entity } from '../domain/Entity';
import { ITranslator } from '../domain/ITranslator';
import { Versionable } from '../domain/IVersionable';
import { Identifier } from '../domain/Identifier';
import { Client } from "@elastic/elasticsearch";

export class ElasticProxy<I extends Identifier, T extends Versionable, E extends Entity<I, T>> {
  private readonly elasticSearch: Client;

  constructor(
    private readonly translationService: ITranslator<E, T>,
    private readonly elasticSearchIndex: string,
  ) {
    this.elasticSearch = new Client({ node: 'http://localhost:9200' });
  }

  public async create(entity: E): Promise<void> {
    await this.elasticSearch.index({
      index: this.elasticSearchIndex,
      id: entity.id.toString(),
      version: entity.version,
      version_type: 'external',
      body: entity.toSnapshot(),
    });
  }

  public async delete(entity: E): Promise<void> {
    await this.elasticSearch.delete({
      index: this.elasticSearchIndex,
      id: entity.id.toString(),
    });
  }

  public async update(entity: E): Promise<void> {
    await this.elasticSearch.update({
      index: this.elasticSearchIndex,
      id: entity.id.toString(),
      body: {
        doc: entity.toSnapshot(),
      },
    });
  }

  public async list(query: IElasticSearchQuery<T>, listOptions: ListOptions): Promise<E[]> {
    const documents = await this.elasticSearch.search<T>({
      index: this.elasticSearchIndex,
      from: listOptions.offset,
      size: listOptions.limit,
      sort: listOptions.sortBy || '',
      body: {
        query: {
          match: query.match
        }
      },
    });

    return documents.hits.hits.map(document => {
      return this.extendEntityWithVersion(document._source);
    });
  }

  private extendEntityWithVersion(document: T): E {
    const entity = this.translationService.toEntity(document);
    entity.setVersion(document.version || 0);
    return entity;
  }
}

interface IElasticSearchQuery<T extends Versionable> {
  match: {
    [P in keyof T]?: string
  };
  // match_all? : Record<string, unknown>;
}