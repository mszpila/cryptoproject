import { Injectable } from "./shared/src/decorators/Injectable";
import * as yaml from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
import { RuntimeException } from "@nestjs/core/errors/exceptions/runtime.exception";

@Injectable()
export class ConfigService {
  private readonly config = yaml.load(readFileSync(join(__dirname, process.env.CONFIG), "utf8")) as Record<string, any>;

  public static getEnv(): unknown {
    console.log(__dirname);
    return yaml.load(
      readFileSync(
        join(__dirname, process.env.NODE_ENV === "test" ? "config.dev.yaml" : "config.prod.yaml"),
        "utf8"
      )
    );
  }

  constructor() {
    this.config = this.transformConfigObject(this.config);
  }

  private transformConfigObject(obj: object): object {
    let result = {};

    for (let [key, valueOrArrOfObjects] of Object.entries(obj)) {
      if (typeof valueOrArrOfObjects === "object") {
        result[key] = Object.assign({}, ...valueOrArrOfObjects.map(objFromArr => this.transformConfigObject(objFromArr)));
      } else {
        result[key] = valueOrArrOfObjects;
      }
    }

    return result;
  }

  public get<T>(configName: string): T {
    let result = this.config

    if (configName.includes('.')) {
      const parts = configName.split('.');

      for (let part of parts) {
        result = result[part];
      }
    } else {
      result = result[configName];
    }

    if (!result) throw new RuntimeException(`Config ${configName} doesn't exist`);
    return result as T;
  }
}