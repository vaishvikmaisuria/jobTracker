import type {
  Resource,
  CreateResourceInput,
  UpdateResourceInput,
  ResourceFilters,
} from "@job-tracker/types";

export interface IResourceRepository {
  getAll(): Promise<Resource[]>;
  getById(id: string): Promise<Resource | null>;
  create(input: CreateResourceInput): Promise<Resource>;
  update(id: string, input: UpdateResourceInput): Promise<Resource | null>;
  delete(id: string): Promise<boolean>;
  search(filters: ResourceFilters): Promise<Resource[]>;
}

// TODO: MongoResourceRepository – MongoDB implementation
// TODO: RedisResourceRepository – cache layer
