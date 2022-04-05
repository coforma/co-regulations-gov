import dotenv from 'dotenv';
import axios from 'axios';
const parsedDotEnv = dotenv.config().parsed;
const { API_KEY, COMMENTS_URL, DELAY } = parsedDotEnv;

export async function makeRequest(url) {
  try {
    const res = await axios({ method: 'get', url });
    return res.data;
  } catch (error) {
    return error.response;
  }
}

export async function getDocumentCommentsService({
  onReceiveComment,
  documentId,
}) {
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
}

export async function getAllCommentsData(documentId) {
  const result = await requestDocumentCommentsPage(documentId, 1);
  const firstPageData = result?.data;

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
      const result = await requestDocumentCommentsPage(documentId, pageNumber);
      return result?.data;
    })
  );
  return [...firstPageData, ...subsequentPageData].flatMap((comment) => ({
    id: comment.id,
    link: comment.links?.self,
  }));
}

async function requestComment(url) {
  return await makeRequest(`${url}?include=attachments&api_key=${API_KEY}`);
}

async function requestDocumentCommentsPage(documentId, pageNumber) {
  return await makeRequest(
    `${COMMENTS_URL}?filter[searchTerm]=${documentId}&api_key=${API_KEY}&page[number]=${pageNumber}`
  );
}
