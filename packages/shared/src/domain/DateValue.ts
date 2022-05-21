import { BadRequestException } from '@nestjs/common';
import moment from 'moment';
import { Equalable } from './IEqualable';


export type ISODate = string;

export class DateValue implements Equalable<DateValue> {
  private static readonly MILLISECOND = 1;
  private static readonly SECOND = 1000;
  private static readonly MINUTE = 60 * DateValue.SECOND;
  private static readonly HOUR = 3600 * DateValue.SECOND;
  private static readonly DAY = 24 * DateValue.HOUR;

  private static ISO8601_RE = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
  private static SIMPLE_FORMAT_RE = /^\d{4}-\d\d-\d\d$/i;
  private value: Date | null;

  /**
   * @param date Date or ISO string
   */
  constructor(date: Date | string | null) {

    if (date instanceof Date) {
      this.value = new Date(date.getTime());
    } else if (typeof date === 'string' && DateValue.ISO8601_RE.test(date)) {
      this.value = new Date(date);
    } else if (typeof date === 'string' && DateValue.SIMPLE_FORMAT_RE.test(date)) {
      this.value = new Date(date);
    } else if (date === null) {
      this.value = null;
    } else {
      throw new BadRequestException( { date: date, }, `Invalid date format`);
    }

    if (!this.isNullable()) {

      if (this.toDate().toString() === 'Invalid Date') {
        throw new BadRequestException( { date: date, }, `Invalid date error for value`);
      }

    }
  }

  static startOfDay(): DateValue {
    const initializedDate = moment().utc(false).startOf('day').toDate();
    return new DateValue(initializedDate.toISOString());
  }

  static null(): DateValue {
    return new DateValue(null);
  }

  static zero(): DateValue {
    return new DateValue(new Date(0));
  }

  static now(): DateValue {
    return new DateValue(new Date());
  }

  /**
   * @example ```
   *  DateValue.after(DateValue.HOUR) // now() + 1h
   *  DateValue.after(DateValue.HOUR + DateValue.MINUTE * 30) // now() + 1.5H
   * ```
   * @param milliseconds number after current timestamp
   */
  static after(milliseconds: number): DateValue {
    const currentTs = new Date();
    return new DateValue(new Date(currentTs.getTime() + milliseconds));
  }

  /**
   * Inverted after method
   *
   * @param milliseconds number before current timestamp
   */
  static before(milliseconds: number): DateValue {
    return this.after(-milliseconds);
  }

  public isBeforeDays(days: number): boolean {
    if (days <= 0) {
      throw new BadRequestException('Days number can not be less than 1');
    }

    const dayBefore = DateValue.before(DateValue.DAY * days).toDate();

    return this.value?.getFullYear() === dayBefore.getFullYear() &&
      this.value?.getMonth() === dayBefore.getMonth() &&
      this.value?.getDate() === dayBefore.getDate();
  }

  /**
   * Checks if current timestamp was before other one.
   * @param other
   */
  isBefore(other: DateValue) {
    if (this.isNullable() || other.isNullable()) {
      throw new BadRequestException('Comparing nullable dates');
    }

    return this.toDate().getTime() < other.toDate().getTime();
  }

  toDateString() {
    return moment(this.value).format('YYYY-MM-DD');
  }

  isAfter(other: DateValue) {
    return !this.equals(other) && !this.isBefore(other);
  }

  toDate(): Date {
    if (!this.value) {
      throw new BadRequestException('Date value is nullable');
    }

    return new Date(this.value);
  }

  toDateOrNull(): Date | null {
    return this.isNullable() ? null : this.toDate();
  }

  /**
   * Returns start of its day.
   * @returns {Date}
   */
  static startOfGivenDay(day: DateValue): DateValue {
    return new DateValue(moment(day.toDate()).utc(false).startOf('day').toDate());
  }

  toISOString(): ISODate {
    if (!this.value) {
      throw new BadRequestException('Date value is nullable');
    }

    return this.value.toISOString();
  }

  public toISOStringOrNull(): ISODate | null {
    return this.isNullable() ? null : this.toISOString();
  }

  public isNullable() {
    return this.value === null;
  }

  public equals(other: any): boolean {
    if (this === other) {
      return true;
    }

    if (!(other instanceof DateValue)) {
      return false;
    }

    if (this.value === null) {
      return other.value === null;
    }

    if (other.value === null) {
      return false;
    }

    return other.value.getTime() === this.value.getTime();
  }

  /**
   * Checks if timestamp is in past.
   */
  hasAlreadyPassed(): boolean {
    return this.toDate().getTime() < Date.now();
  }

}
