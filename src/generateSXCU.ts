import fs, { mkdirp } from 'fs-extra';
import path from 'path';
import Bluebird from 'bluebird';
import env from './env';

const sxcuPath = path.join(__dirname, '..', 'sxcu');
const sxcuGeneratedPath = path.join(__dirname, '..', 'sxcu_generated');

async function generate(): Promise<void> {
  const sxcuPathDir = await fs.readdir(sxcuPath);

  await Bluebird.map(sxcuPathDir, async sxcuFile => {
    const filePath = path.join(sxcuPath, sxcuFile);
    const fileObj = await fs.readJSON(filePath);

    const newFileObj = {
      ...fileObj,
      RequestURL: fileObj.RequestURL.replace('https://your.url', env.uploadUrl),
    };

    if (fileObj.URL) {
      newFileObj.URL = fileObj.URL.replace('https://your.url', env.returnUrl);
    }

    if (fileObj.ThumbnailURL) {
      newFileObj.ThumbnailURL = fileObj.ThumbnailURL.replace(
        'https://your.url',
        env.returnUrl,
      );
    }

    if (fileObj.DeletionURL) {
      newFileObj.DeletionURL = fileObj.DeletionURL.replace(
        'https://your.url',
        env.returnUrl,
      );
    }

    newFileObj.Headers['X-API-Key'] = newFileObj.Headers['X-API-Key'].replace(
      'hunter1',
      env.apiKey,
    );

    await mkdirp(sxcuGeneratedPath);

    const outputFilePath = path.join(sxcuGeneratedPath, `${fileObj.Name}.sxcu`);

    await fs.writeJSON(outputFilePath, newFileObj, {
      spaces: '  ',
    });
  });
}

if (env.sxcu === 'true') {
  generate().catch(err => {
    console.error('error generating configs');
    console.error(err);
  });
}
