#!/usr/bin/env node
require('dotenv').config();

const fs = require('fs');
const jsonexport = require('jsonexport');
const { getDocumentComments } = require('./server/services/comments');

const documentId = process.argv.slice(2)[0];

// Let's go!
(async () => {
  try {
    const data = await getDocumentComments({
      onReceiveComment: (comment) =>
        console.log(`received ${comment.objectId}`),
      documentId,
    });
    if (data.error) {
      console.log({ error: data.error });
      return null;
    }

    console.log(`There are ${data.comments.length} comments`);

    // write the results to JSON
    fs.writeFile(
      'output.json',
      JSON.stringify(data.comments, null, 4),
      'utf8',
      function (err) {
        if (err) {
          console.log('An error occured while writing JSON Object to File.');
          return console.log(err);
        }
        console.log('JSON file has been saved.');
      }
    );

    // write the results to CSV
    jsonexport(data.comments, { rowDelimiter: ',' }, function (err, csv) {
      if (err) return console.error(err);
      fs.writeFile('output.csv', csv, 'utf8', function (err) {
        if (err) {
          console.log('An error occured while converting the JSON to CSV.');
          return console.log(err);
        }
        console.log('CSV file has been saved.');
      });
    });
  } catch (error) {
    throw error;
  }
})();
