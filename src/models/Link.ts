import { Model } from 'objection';
import path from 'path';

class Link extends Model {
  static tableName = 'links';

  readonly id!: number;

  url?: string;

  static relationMappings = {
    share: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, 'Share'),
      join: {
        from: 'links.id',
        to: 'shares.linkId',
      },
    },
  };
}

export default Link;
