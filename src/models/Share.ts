import { Model } from 'objection';
import path from 'path';

import File from './File';
import Image from './Image';
import Link from './Link';
import Paste from './Paste';

class Share extends Model {
  static tableName = 'shares';

  readonly id!: number;

  stringId?: string;

  deleteUrl?: string;

  deleteKey?: string;

  fileId?: number;

  imageId?: number;

  linkId?: number;

  pasteId?: number;

  file?: File;

  image?: Image;

  link?: Link;

  paste?: Paste;

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
        from: 'shares.imageId',
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
