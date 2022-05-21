import { DateValue } from './DateValue';

export interface CreatedAt {
  createdAt: DateValue;
}

export interface UpdatedAt {
  updatedAt: DateValue;
}

export interface DeletedAt {
  deletedAt: DateValue;
}

export interface Timestamps extends CreatedAt, UpdatedAt, DeletedAt {

}
