export class ListDTO<Data, DataDTO> {
  public data: DataDTO[];
  public metadata: ListMetaData;

  constructor(
    data: Data[],
    DataDTO: new (data: Data) => DataDTO,
    count: number,
  ) {
    this.data = Array.from(data).map(item => new DataDTO(item));
    this.metadata = new ListMetaData(count);
  }
}

export class ListDTO2<DataDTO> {
  public data: DataDTO[];
  public metadata: ListMetaData;

  constructor(
    data: DataDTO[],
    count: number,
  ) {
    this.data = data;
    this.metadata = new ListMetaData(count);
  }
}

interface IListResponseMetadata {
  total: number;
}

class ListMetaData implements IListResponseMetadata {
  constructor(public total: number) {
  }
}
