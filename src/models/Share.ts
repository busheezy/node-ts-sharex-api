import { Model } from 'objection';
import path from 'path';

class Share extends Model {
  static tableName = 'shares';

  readonly id!: number;

  deleteUrl?: string;

  deleteKey?: string;

  static relationMappings = {
    file: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'File'),
      join: {
        from: 'shares.fileId',
        to: 'files.id',
      },
    },
    image: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Image'),
      join: {
        from: 'shares.imageid',
        to: 'images.id',
      },
    },
    link: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Link'),
      join: {
        from: 'shares.linkId',
        to: 'links.id',
      },
    },
    paste: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Paste'),
      join: {
        from: 'shares.pasteId',
        to: 'pastes.id',
      },
    },
  };
}

export default Share;
