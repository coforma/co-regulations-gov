import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SocketContext } from '../context/socket';

import RetrieveDocumentCommentsForm from './RetrieveDocumentCommentsForm';
import Table from './Table';
import TableFilters from './TableFilters';

const Home = () => {
  const socket = useContext(SocketContext);
  const [clientId, setClientId] = useState(null);
  const [comments, setComments] = useState([]);
  const [filterTerm, setfilterTerm] = useState('');
  const [status, setStatus] = useState('Ready');

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
        .map((comment) => ({
          ...comment,
          // convert dates for sortings and formatting
          postedDate: new Date(comment.postedDate),
          receiveDate: new Date(comment.receiveDate),
        }))
        // sorts by postedDate by default
        .sort((a, b) => b.postedDate - a.postedDate)
    );
  }, [comments, filterTerm]);

  return (
    <div className="padding-10">
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
        <div
          className="usa-table--compact margin-top-5 border-top-1px padding-top-1"
          tabIndex="0"
        >
          <TableFilters
            onChange={(e) => setfilterTerm(e.target.value)}
            filterTerm={filterTerm}
          />
          {filteredSortedComments.length ? (
            <Table comments={filteredSortedComments} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default Home;
