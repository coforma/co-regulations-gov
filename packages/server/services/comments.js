const dotenv = require('dotenv').config().parsed;
const utils = require('../utils');

const { API_KEY, COMMENTS_URL, DELAY } = dotenv;

const getDocumentComments = async ({ onReceiveComment, documentId }) => {
  const commentsData = await getAllCommentsData(documentId);

  // handles OVER_RATE_LIMIT
  if (commentsData.error) {
    return {
      comments: [],
      error: commentsData.error,
    };
  }

  const commentsLinks = getLinks(commentsData);

  const comments = await Promise.all(
    commentsLinks.map(async (link) => {
      const comment = await requestCommentDetails(link);
      onReceiveComment(comment);
      await new Promise((resolve) => setTimeout(resolve, DELAY));
      return comment;
    })
  );
  return {
    comments,
  };
};

const getAllCommentsData = async (documentId) => {
  const result = await requestCommentsPage({
    page: 1,
    documentId,
  });
  const firstPageData = result.data;

  if (firstPageData.error) {
    return {
      comments: [],
      error: firstPageData.error,
    };
  }

  const totalPages = result?.meta?.totalPages;

  const subsequentPages = totalPages
    ? Array(totalPages - 1)
        .fill()
        .map((_, i) => i + 2)
    : [];
  const subsequentPageData = await Promise.all(
    subsequentPages.flatMap(async (page) => {
      const result = await requestCommentsPage({
        page,
        documentId,
      });
      return result?.data;
    })
  );
  return [...firstPageData, ...subsequentPageData].flatMap(
    (comment) => comment
  );
};

const requestCommentDetails = async (url) => {
  const response = await utils.makeRequest(`${url}?api_key=${API_KEY}`);
  return response?.data?.attributes;
};

const requestCommentsPage = async ({ documentId, page }) => {
  return await utils.makeRequest(
    `${COMMENTS_URL}?filter[searchTerm]=${documentId}&api_key=${API_KEY}&page[number]=${page}`
  );
};

const getLinks = (comments) => comments.map((comment) => comment.links?.self);

module.exports = {
  getAllCommentsData,
  getDocumentComments,
  getLinks,
  requestCommentDetails,
  requestCommentsPage,
};
