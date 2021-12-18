const dotenv = require('dotenv').config().parsed;
const utils = require('../utils');

const { API_KEY, COMMENTS_URL, DELAY } = dotenv;

const getDocumentComments = async ({ onReceiveComment, documentId }) => {
  const commentsData = await getAllCommentsData(documentId);

  // handle OVER_RATE_LIMIT
  if (commentsData.error) {
    return {
      comments: [],
      error: commentsData.error,
    };
  }

  const comments = await Promise.all(
    commentsData.map(async (comment) => {
      const { id, link } = comment;
      const { data, included } = await requestComment(link);
      const result = {
        attachments: included,
        id,
        ...data.attributes,
      };
      onReceiveComment(result);
      await new Promise((resolve) => setTimeout(resolve, DELAY));
      return result;
    })
  );

  return {
    comments,
  };
};

const getAllCommentsData = async (documentId) => {
  const result = await requestDocumentCommentsPage({
    documentId,
    pageNumber: 1,
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
    subsequentPages.flatMap(async (pageNumber) => {
      const result = await requestDocumentCommentsPage({
        documentId,
        pageNumber,
      });
      return result?.data;
    })
  );
  return [...firstPageData, ...subsequentPageData].flatMap((comment) => ({
    id: comment.id,
    link: comment.links?.self,
  }));
};

const requestComment = async (url) => {
  return await utils.makeRequest(
    `${url}?include=attachments&api_key=${API_KEY}`
  );
};

const requestDocumentCommentsPage = async ({ documentId, pageNumber }) => {
  return await utils.makeRequest(
    `${COMMENTS_URL}?filter[searchTerm]=${documentId}&api_key=${API_KEY}&page[number]=${pageNumber}`
  );
};

module.exports = {
  getAllCommentsData,
  getDocumentComments,
  requestComment,
  requestDocumentCommentsPage,
};
