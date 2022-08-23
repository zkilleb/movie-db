import { BulkErrors } from '.';

export class BulkResponse {
  message: string = '';
  errors: BulkErrors[] = [];
}
