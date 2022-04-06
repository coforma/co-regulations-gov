import dotenv from 'dotenv';
import axios from 'axios';
import { Comment, Nullable } from 'types';

dotenv.config();

const { API_KEY, COMMENTS_URL, DELAY } = process.env;

async function makeRequest(url: string) {
  try {
    const res = await axios({ method: 'get', url });
    return res.data;
  } catch (error) {
    if (typeof error === 'string') {
      return error.toUpperCase(); // works, `e` narrowed to string
    } else if (error instanceof Error) {
      return error.message;
    }
  }
}

export async function getDocumentCommentsService({
  onReceiveComment,
  documentId,
}: {
  onReceiveComment: (comment: Comment) => void;
  documentId: string;
}) {
  const data = await getAllCommentsData(documentId);

  // handle OVER_RATE_LIMIT
  if (data.error) {
    return {
      comments: [],
      error: data.error,
    };
  }

  const comments: Comment[] = await Promise.all(
    data.comments.map(async (comment) => {
      const { id, link } = comment;
      const { data, included } = await requestComment(link);
      const result = {
        attachments: included,
        id,
        ...data.attributes,
      };
      onReceiveComment(result);
      await new Promise((resolve) => setTimeout(resolve, Number(DELAY)));
      return result;
    })
  );

  return {
    comments,
  };
}

async function getAllCommentsData(documentId: string): Promise<{
  comments: { id: string; link: string }[];
  error: Nullable<string>;
}> {
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
        .fill(undefined)
        .map((_, i) => i + 2)
    : [];
  const subsequentPageData = await Promise.all(
    subsequentPages.flatMap(async (pageNumber) => {
      const result = await requestDocumentCommentsPage(documentId, pageNumber);
      return result?.data;
    })
  );
  return {
    comments: [...firstPageData, ...subsequentPageData].flatMap((comment) => ({
      id: comment.id,
      link: comment.links?.self,
    })),
    error: null,
  };
}

async function requestComment(url: string) {
  return await makeRequest(`${url}?include=attachments&api_key=${API_KEY}`);
}

async function requestDocumentCommentsPage(
  documentId: string,
  pageNumber: number
) {
  return await makeRequest(
    `${COMMENTS_URL}?filter[searchTerm]=${documentId}&api_key=${API_KEY}&page[number]=${pageNumber}`
  );
}