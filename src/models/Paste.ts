import { Model } from 'objection';
import path from 'path';

class Paste extends Model {
  static tableName = 'pastes';

  readonly id!: number;

  static relationMappings = {
    share: {
      relation: Model.HasOneRelation,
      modelClass: path.join(__dirname, 'Share'),
      join: {
        from: 'pastes.id',
        to: 'shares.pasteId',
      },
    },
  };
}

export default Paste;
