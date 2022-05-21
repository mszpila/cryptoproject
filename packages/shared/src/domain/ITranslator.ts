import { Versionable } from './IVersionable';

export interface ITranslator<Entity, Snapshot extends Versionable> {

  toEntity(snapshot: Snapshot): Entity;

  toSnapshot(entity: Entity): Snapshot;
}