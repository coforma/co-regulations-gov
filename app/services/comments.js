const dotenv = require("dotenv").config().parsed;
const utils = require("./utils");

const { API_KEY, COMMENTS_URL, DELAY } = dotenv;

const getDocumentComments = async ({ callback, clientId, documentId }) => {
  const commentsData = await getAllCommentsData(documentId);
  const commentsLinks = getLinks(commentsData);
  const comments = await Promise.all(
    commentsLinks.map(async (link) => {
      const comment = await requestCommentDetails(link);
      // updates UI with each new Comment as they become available
      callback({ clientId, comment });
      await new Promise((resolve) => setTimeout(resolve, DELAY));
      return comment;
    })
  );
  return comments;
};

const getAllCommentsData = async (documentId) => {
  const { data: firstPageData, meta } = await requestCommentsPage({
    page: 1,
    documentId,
  });
  const { totalPages } = meta;
  const subsequentPages = Array(totalPages - 1)
    .fill()
    .map((_, i) => i + 2);
  const subsequentPageData = await Promise.all(
    subsequentPages.flatMap(async (page) => {
      const { data } = await requestCommentsPage({
        page,
        documentId,
      });
      return data;
    })
  );
  return [...firstPageData, ...subsequentPageData].flatMap(
    (comment) => comment
  );
};

const requestCommentDetails = async (url) => {
  const { data } = await utils.makeRequest(`${url}?api_key=${API_KEY}`);
  return data.attributes;
};

const requestCommentsPage = async ({ documentId, page }) => {
  return await utils.makeRequest(
    `${COMMENTS_URL}?filter[searchTerm]=${documentId}&api_key=${API_KEY}&page[number]=${page}`
  );
};

const getLinks = (comments) => comments.map((comment) => comment.links.self);

module.exports = {
  getAllCommentsData,
  getDocumentComments,
  getLinks,
  requestCommentDetails,
  requestCommentsPage,
};
