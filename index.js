#!/usr/bin/env node
require('dotenv').config()

const axios = require('axios');
const fs = require('fs');
const jsonexport = require('jsonexport');

const COMMENTS_URL = 'https://api.regulations.gov/v4/comments';
const DELAY = process.env.DELAY;
const API_KEY = process.env.API_KEY;

// generates comments list URL based on API_KEY, DOCUMENT_ID, and a page number
const comments_url = page => `${COMMENTS_URL}?filter[searchTerm]=${DOCUMENT_ID}&api_key=${API_KEY}&page[number]=${page}`;

// creates an array of remaining pages based on the current page
const getRemainingPages = totalPages => Array.from(Array(totalPages - 1).keys(), (_,x) => x + 2);

// splits an array into chunks
const chunk = (inputArray, perChunk) => inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index/perChunk)
    if(!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [] // start a new chunk
    }
    resultArray[chunkIndex].push(item)
    return resultArray
}, []); // chunk

let args = process.argv.slice(2);
let DOCUMENT_ID = args[0];

let pages = [];
let all_comments = [];

const cleanCommentData = (c) => {
    let comment = c.data.data.attributes;
    comment.id = c.data.data.id;
    comment.public_url = `https://www.regulations.gov/document/${comment.id}`;
    ['displayProperties'].forEach(prop => delete(comment[prop])); // properties to remove because they are unnecessary
    return comment;
}; // cleanCommentData

const getPages = async (page) => {
    const resp = await axios.get(comments_url(page));
    if(!resp.statusText=='OK') throw new Error(`Response not OK for ${comments_url(page)}`);
    if(page===1) { // if the first time through, get the total number of pages and add to queue
        pages = chunk(getRemainingPages(resp.data.meta.totalPages), 2);
        console.log(`There are ${resp.data.meta.totalPages} pages`);
    }

    // get the comment JSON for each comment
    console.log(`Getting comments for Page: #${page}`);
    let res = await Promise.all(resp.data.data.map(comment => { return axios.get(`${comment.links.self}?api_key=${API_KEY}`); }));
    let comment_data = await Promise.all(res.map(cleanCommentData));
    // let comment_data = resp.data.data.map(comment => comment.links.self); // for testing to avoid API hits
    return comment_data;
}; // getPages

const getComments = async (pages) => {
    let comments = await Promise.all(pages.map(getPages));
    return comments.flat();
}; // getComments

// Let's go!
(async () => {
    // first, let's get the first page of results
    all_comments = await getComments([1]);

    while(pages.length>0) {
        let next_pages = pages.shift();
        await new Promise(resolve => setTimeout(resolve, DELAY)); // wait a bit
        let more_comments = await getComments(next_pages);
        all_comments = all_comments.concat(more_comments);
    }
    all_comments.sort();
    console.log(`There are ${all_comments.length} comments`);

    // write the results to JSON
    fs.writeFile('output.json', JSON.stringify(all_comments, null, 4), 'utf8', function(err) {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
        console.log('JSON file has been saved.');
    });

    // write the results to CSV
    jsonexport(all_comments, {rowDelimiter: ','}, function(err, csv) {
        if (err) return console.error(err);
        fs.writeFile('output.csv', csv, 'utf8', function(err) {
            if (err) {
                console.log('An error occured while converting the JSON to CSV.');
                return console.log(err);
            }
            console.log('CSV file has been saved.');
        });
    });
})();

