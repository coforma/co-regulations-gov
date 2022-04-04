#!/usr/bin/env node
'use strict';

require('dotenv').config();

var fs = require('fs');
var jsonexport = require('jsonexport');
var minimist = require('minimist');
var path = require('path');

var commentsService = require('./services/comments.js');
var reqPath = path.join(__dirname, '../');
var args = minimist(process.argv.slice(2), {
  boolean: ['help'],
  string: ['documentId'],
});

(async function () {
  if (args.help) {
    return printHelp();
  } else if (!args.documentId) {
    console.error('A documentId argument is required.');
    console.log('');
    return printHelp();
  }

  var data = await commentsService.getDocumentComments({
    onReceiveComment: function (comment) {
      console.log(`received ${comment.objectId}`);
    },
    documentId: args.documentId,
  });
  if (data.error) {
    console.log({ error: data.error });
    return null;
  }

  console.log(`There are ${data.comments.length} comments`);

  fs.writeFile(
    fileName('json'),
    JSON.stringify(data.comments, null, 4),
    'utf8',
    function (err) {
      if (err) {
        console.log('An error occured while writing JSON Object to File.');
        return console.log(err);
      }
      console.log(
        `JSON file has been saved as ./output/${args.documentId}-output.json`
      );
    }
  );

  jsonexport(data.comments, { rowDelimiter: ',' }, function (err, csv) {
    if (err) return console.error(err);
    fs.writeFile(fileName('csv'), csv, 'utf8', function (err) {
      if (err) {
        console.log('An error occured while converting the JSON to CSV.');
        return console.log(err);
      }
      console.log(
        `CSV file has been saved as ./output/${args.documentId}-output.csv`
      );
    });
  });
})();

function fileName(type) {
  return `${reqPath}output/${args.documentId}-output.${type}`;
}

function printHelp() {
  console.log('cli usage:');
  console.log('  cli.js --documentId={DOCUMENT_ID}');
  console.log('');
  console.log('--help                 print this help');
  console.log('--documentId={STRING}  a regulations.gov Document ID');
  console.log('');
}
