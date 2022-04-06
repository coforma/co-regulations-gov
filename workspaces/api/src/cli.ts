import fs from 'fs';
import jsonexport from 'jsonexport';
import minimist from 'minimist';
import path from 'path';

import { getDocumentComments } from './services/comments.js';

const args = minimist(process.argv.slice(2), {
  boolean: ['help'],
  string: ['documentId'],
});

const reqPath = path.join(__dirname, '../../../');

const messages = {
  errorWriting: (fileType: string) =>
    `An error occured while converting the JSON to ${fileType}.`,
  successWriting: (fileType: string) =>
    `${fileType} file has been saved as ./output/${
      args.documentId
    }-output.${fileType.toLowerCase()}`,
};

const filePath = (type: string) =>
  `${reqPath}output/${args.documentId}-output.${type}`;

(async function () {
  if (args.help) {
    return printHelp();
  } else if (!args.documentId) {
    console.error('A documentId argument is required.');
    console.log('');
    return printHelp();
  }

  const data = await getDocumentComments({
    onReceiveComment: (comment) => {
      console.log(`received ${comment.objectId}`);
    },
    documentId: args.documentId,
  });

  if (data.error) return console.error(data.error);

  console.log(`There are ${data.comments.length} comments`);

  fs.writeFile(
    filePath('json'),
    JSON.stringify(data.comments, null, 4),
    'utf8',
    (err) => {
      if (err) {
        console.error(messages.errorWriting('File'));
      } else {
        console.log(messages.successWriting('JSON'));
      }
    }
  );

  jsonexport(data.comments, { rowDelimiter: ',' }, (err, csv) => {
    if (err) return console.error(err);
    fs.writeFile(filePath('csv'), csv, 'utf8', (err) => {
      if (err) {
        console.error(messages.errorWriting('CSV'));
      } else {
        console.log(messages.successWriting('CSV'));
      }
    });
  });
})();

function printHelp() {
  console.log('cli usage:');
  console.log('  cli.js --documentId={DOCUMENT_ID}');
  console.log('');
  console.log('--help                 print this help');
  console.log('--documentId={STRING}  a regulations.gov Document ID');
  console.log('');
}
