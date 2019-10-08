import { Model } from 'objection';
import path from 'path';

class File extends Model {
  static tableName = 'files';

  readonly id!: number;

  fileName?: string;

  static relationMappings = {
    share: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, 'Share'),
      join: {
        from: 'files.id',
        to: 'shares.fileId',
      },
    },
  };
}

export default File;
