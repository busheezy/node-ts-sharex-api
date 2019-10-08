import { Model } from 'objection';
import path from 'path';

class Image extends Model {
  static tableName = 'images';

  readonly id!: number;

  fileName?: string;

  type?: string;

  static relationMappings = {
    share: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, 'Share'),
      join: {
        from: 'images.id',
        to: 'shares.imageId',
      },
    },
  };
}

export default Image;
