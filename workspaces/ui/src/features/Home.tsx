import { useContext, useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { SocketContext } from '../context/socket';

import { Comment, CommentsRequest } from 'types';
import Filters from '../components/Filters';
import RetrieveDocumentCommentsForm from '../components/RetrieveDocumentCommentsForm';
import Table from '../components/Table';

const Home = () => {
  const socket: Socket | undefined = useContext(SocketContext);

  const [clientId, setClientId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filterTerm, setfilterTerm] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<
    (keyof Comment)[]
  >([
    'title',
    'comment',
    'firstName',
    'lastName',
    'organization',
    'postedDate',
  ]);
  const [status, setStatus] = useState('Awaiting Connection');

  const io = useMemo(() => {
    return {
      comment: (comment: Comment) => {
        setComments((previous: Comment[]) => [...previous, comment]);
      },
      complete: (data: CommentsRequest) => {
        if (data.error === 'OVER_RATE_LIMIT') {
          setStatus('You have exceeded your rate limit. Try again later.');
        } else {
          setStatus(data.error ? data.error : 'Complete');
        }
      },
      connect: () => {
        setClientId(socket.id);
        setStatus('Ready');
      },
    };
  }, [socket]);

  useEffect(() => {
    socket.on('comment', io.comment);
    socket.on('complete', io.complete);
    socket.on('connect', io.connect);
    return () => {
      socket.off('comment', io.comment);
      socket.off('complete', io.complete);
      socket.off('connect', io.connect);
    };
  }, [io, socket]);

  const filteredSortedComments = useMemo(() => {
    if (!comments) return [];
    return comments
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
      });
  }, [comments, filterTerm]);

  const handleSelectColumn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as keyof Comment;
    const containsValue = selectedProperties.includes(value);
    if (containsValue) {
      setSelectedProperties((prev) => [
        ...prev.filter((v) => v !== e.target.value),
      ]);
    } else {
      setSelectedProperties((prev) => [...prev, value]);
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
            handleSearchInput={(e) => {
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
