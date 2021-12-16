import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../context/socket';

const Form = () => {
  const socket = useContext(SocketContext);

  const [clientId, setClientId] = useState(null);
  const [comments, setComments] = useState([]);
  const [documentId, setDocumentId] = useState('CMS-2021-0168-0001');
  const [status, setStatus] = useState('Default');

  useEffect(() => {
    socket.on('connect', () => {
      setClientId(socket.id);
      console.log({ client: socket.id });
    });

    socket.on('comment', (data) => {
      addTableRow(data);
    });

    socket.on('complete', (data) => {
      console.log({ complete: data });
      const { error } = data;
      if (error) {
        setStatus(error.message);
      } else {
        setStatus('Complete');
      }
    });
  }, [socket]);

  const setupTable = () => {
    // $table.innerHTML = '';
    // const header = $table.createTHead();
    // const row = header.insertRow(0);
    // keys.forEach((key, index) => {
    //   const column = row.insertCell(index);
    //   column.innerHTML = key.label;
    // });
    // $table.createTBody();
    // if (!$tableContainer.classList.contains('border-1px')) {
    //   $tableContainer.classList.add('border-1px');
    // }
  };

  const addTableRow = (data) => {
    setComments([...comments, data]);
    // const $tbody = $table.getElementsByTagName('tbody')[0];
    // const row = $tbody.insertRow();
    // keys.forEach((key, index) => {
    //   const column = row.insertCell(index);
    //   column.innerHTML = data[key.value];
    // });
  };

  useEffect(() => {
    console.log({ comments });
  }, [comments]);

  const handleInput = (e) => {
    setDocumentId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientId || !documentId) return null;

    fetch('/comments', {
      body: JSON.stringify({
        clientId,
        documentId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => console.log({ data }))
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="grid-container">
      <h1>Retrieve Document Comments</h1>
      <div>
        <span className="status" id="status">
          Status: {status}
        </span>
      </div>

      <form className="usa-form" id="form">
        <label className="usa-label" htmlFor="documentId">
          Document ID
        </label>
        <input
          className="usa-input"
          id="input"
          required
          type="text"
          name="documentId"
          value={documentId}
          onChange={handleInput}
        />
        <input
          className="usa-button"
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        />
      </form>

      <div
        className="usa-table-container--scrollable margin-top-3"
        id="table-container"
        tabIndex="0"
      >
        <table className="usa-table" id="table"></table>
      </div>
    </div>
  );
};

export default Form;
