import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SocketContext } from '../context/socket';

import RetrieveDocumentCommentsForm from './RetrieveDocumentCommentsForm';
import Table from './Table';
import TableFilters from './TableFilters';

const Home = () => {
  const socket = useContext(SocketContext);
  const [clientId, setClientId] = useState(null);
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('Default');

  useEffect(() => {
    socket.on('connect', () => {
      setClientId(socket.id);
    });

    socket.on('comment', (data) => {
      setComments((previous) => [...previous, data]);
    });

    socket.on('complete', (data) => {
      if (data?.error?.code === 'OVER_RATE_LIMIT') {
        setStatus('You have exceeded your rate limit. Try again later.');
      } else {
        setStatus(data.error ? data.error.message : 'Complete');
      }
    });
  }, [socket]);

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const commentString = JSON.stringify(
        Object.values(comment).filter((c) => c !== null)
      ).toLowerCase();
      return commentString.includes(searchTerm.toLowerCase());
    });
  }, [comments, searchTerm]);

  return (
    <>
      <h1>Retrieve Document Comments</h1>
      <span className="display-block text-primary-vivid">Status: {status}</span>

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

      {comments.length ? (
        <div className="usa-table--compact margin-top-3" tabIndex="0">
          <TableFilters
            onChange={(e) => setSearchTerm(e.target.value)}
            searchTerm={searchTerm}
          />
          <Table comments={filteredComments} />
        </div>
      ) : null}
    </>
  );
};

export default Home;
