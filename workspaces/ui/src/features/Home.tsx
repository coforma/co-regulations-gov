import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Socket } from "socket.io-client";
import { SocketContext } from '../context/socket';

import { Comment } from "types";
import Filters from '../components/Filters';
import RetrieveDocumentCommentsForm from '../components/RetrieveDocumentCommentsForm';
import Table from '../components/Table';

const Home = () => {
  const socket: Socket | undefined = useContext(SocketContext);

  const [clientId, setClientId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filterTerm, setfilterTerm] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<Array<keyof Comment>>([
    'title',
    'comment',
    'firstName',
    'lastName',
    'organization',
    'postedDate',
  ]);
  const [status, setStatus] = useState('Awaiting Connection');

  const handleConnect = useCallback(() => {
    setClientId(socket.id);
    setStatus('Ready');
  }, [socket]);

  const handleComment = useCallback((comment: Comment) => {
    setComments((previous: Comment[]) => [
      ...previous,
      comment,
    ]);
  }, []);

  const handleComplete = useCallback((data) => {
    if (data?.error?.code === 'OVER_RATE_LIMIT') {
      setStatus('You have exceeded your rate limit. Try again later.');
    } else {
      setStatus(data.error ? data.error.message : 'Complete');
    }
  }, []);

  useEffect(() => {
    socket.on('comment', handleComment);
    socket.on('complete', handleComplete);
    socket.on('connect', handleConnect);
    return () => {
      socket.off('comment', handleComment);
      socket.off('complete', handleComplete);
      socket.off('connect', handleConnect);
    };
  }, [handleComment, handleComplete, handleConnect, socket]);

  const filteredSortedComments = useMemo(() => {
    if (!comments) return [];
    return (
      comments
        .filter((comment) => {
          // removes properties with null values, and converts to lowercase string
          const commentString = JSON.stringify(
            Object.values(comment).filter((c) => c !== null)
          ).toLowerCase();
          // checks to see if any value contains the filter string
          return commentString.includes(filterTerm.toLowerCase());
        })
        .sort((a, b) => {
          if (a.postedDate && b.postedDate) {
            return +new Date(b.postedDate) - +new Date(a.postedDate);
          }
          return 0;
        }
        )
    );
  }, [comments, filterTerm]);

  // TODO
  const handleSelectColumn = (e: any): void => {
    const containsValue = selectedProperties.includes(e.target.value);
    if (containsValue) {
      setSelectedProperties((prev) => [
        ...prev.filter((v) => v !== e.target.value),
      ]);
    } else {
      setSelectedProperties((prev) => [...prev, e.target.value]);
    }
  };

  return (
    <div className="padding-10">
      <h1>Retrieve Document Comments</h1>
      <span className="display-block text-primary-vivid">Status: {status}</span>

      {clientId && (
        <RetrieveDocumentCommentsForm
          clientId={clientId}
          onError={(error) => {
            setStatus(`Error ${error}`);
          }}
          onSubmit={() => {
            setComments([]);
          }}
          onSuccess={() => {
            setStatus('Loading');
          }}
        />
      )}

      {comments.length ? (
        <div className="margin-top-5 padding-top-1">
          <Filters
            handleSearchInput={(e: any) => {
              // TODO: ^^^
              setfilterTerm(e.target.value);
            }}
            handleSelectColumn={handleSelectColumn}
            filterTerm={filterTerm}
            selectedProperties={selectedProperties}
          />
          {filteredSortedComments.length ? (
            <Table
              comments={filteredSortedComments}
              selectedProperties={selectedProperties}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Home;
