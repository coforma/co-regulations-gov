const axios = require("axios");
const dotenv = require("dotenv").config().parsed;

const COMMENTS_URL = "https://api.regulations.gov/v4/comments";
const DELAY = 10;
const { API_KEY } = dotenv;

const getComments = async (DOCUMENT_ID, emitResult) => {
  const getCommentUrlsByPage = async (page) => {
    try {
      const res = await axios({
        method: "get",
        url: `${COMMENTS_URL}?filter[searchTerm]=${DOCUMENT_ID}&api_key=${API_KEY}&page[number]=${page}`,
      });
      return res.data;
    } catch (error) {
      return error.response;
    }
  };

  const getCommentByUrl = async (url) => {
    try {
      const res = await axios({
        method: "get",
        url: `${url}?api_key=${API_KEY}`,
      });
      return res.data.data.attributes;
    } catch (error) {
      return error.response;
    }
  };

  const getCommentUrls = async () => {
    let comments = [];
    const pageOne = await getCommentUrlsByPage(1);
    comments = pageOne.data;
    if (pageOne.meta.totalPages > 1) {
      let currentPage = pageOne.meta.pageNumber;
      let remainingPages = pageOne.meta.totalPages;

      while (currentPage < remainingPages) {
        const nextPage = await getCommentUrlsByPage(currentPage + 1);
        comments = [...comments, ...nextPage.data];
        currentPage = nextPage.meta.pageNumber;
      }
    }
    return comments.map((comment) => comment.links.self);
  };

  const commentUrls = await getCommentUrls();
  const allComments = [];

  for (let i = 0; i < commentUrls.length; i++) {
    const comment = await getCommentByUrl(commentUrls[i]);
    emitResult(comment);
    allComments.push(comment);
    await new Promise((resolve) => setTimeout(resolve, DELAY));
  }

  return allComments;
};

module.exports = {
  getComments,
};
