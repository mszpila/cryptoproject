export interface Equalable<TClass> {
  equals(other: TClass): boolean;
}
