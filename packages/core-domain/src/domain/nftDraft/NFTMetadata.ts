import { BadRequestException } from "@nestjs/common";

export class NFTMetadata {
  private readonly name: string;
  private readonly description: string;
  private readonly image: string;
  private readonly attributes: IAttributeMetadata[];

  constructor(props: Object) {
    const requiredKeys = new Set<string>(["name", "description"]);
    Object.entries(props).map(([key, value]) => {
      if (requiredKeys.has(key)) {
        // TODO: validate value
        requiredKeys.delete(key);
      } else {
        // TODO: validate key and value
      }
      this[key] = value;
    });

    if (requiredKeys.size) throw new BadRequestException(`Metadata doesn\'t have all required fields. Missing: ${requiredKeys.keys()}`);
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getImage(): string {
    return this.image;
  }

  public getAttributes(): IAttributeMetadata[] {
    return this.attributes;
  }

  // public toJSON(): string {
  //   return JSON.stringify(this);
  // }

  public hasRequiredFields(): boolean {
    return !(!this.name.length || !this.description.length);
  }
}

interface IAttributeMetadata {
  trait_type: string;
  value: string;
  display_type?: string;
}

{
  // "description": "Friendly OpenSea Creature that enjoys long swims in the ocean.",
  // "external_url": "https://openseacreatures.io/3",
  // "image": "https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png",
  // "name": "Dave Starbelly",
  // "attributes": [ ... ],
}