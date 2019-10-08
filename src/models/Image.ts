import { Model } from 'objection';
import path from 'path';

class Image extends Model {
  static tableName = 'images';

  static get relationMappings() {
    return {
      share: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Share'),
        join: {
          from: 'images.id',
          to: 'shares.imageId',
        },
      },
    };
  }
}

module.exports = Image;
