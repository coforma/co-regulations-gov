import React, { useCallback, useEffect, useContext, useState } from 'react';
import { SocketContext } from '../context/socket';

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

const keys = [
  // { value: "address1", label: "Address 1" },
  // { value: "address2", label: "Address 2" },
  // { value: "agencyId", label: "Agency ID" },
  { value: 'category', label: 'Category' },
  // { value: "city", label: "City" },
  { value: 'comment', label: 'Comment' },
  // { value: "commentOn", label: "Comment On" },
  { value: 'commentOnDocumentId', label: 'Comment On Document ID' },
  { value: 'country', label: 'Country' },
  // { value: "displayProperties", label: "Display Properties" },
  // { value: "docAbstract", label: "Doc Abstract" },
  { value: 'docketId', label: 'Docket ID' },
  { value: 'documentType', label: 'Document Type' },
  // { value: "duplicateComments", label: "Duplicate Comments" },
  { value: 'email', label: 'Email' },
  // { value: "fax", label: "Fax" },
  // { value: "field1", label: "Field 1" },
  // { value: "field2", label: "Field 2" },
  // { value: "fileFormats", label: "File Formats" },
  { value: 'firstName', label: 'First Name' },
  { value: 'govAgency', label: 'Gov Agency' },
  { value: 'govAgencyType', label: 'Gov Agency Type' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'legacyId', label: 'Legacy ID' },
  // { value: "modifyDate", label: "Modify Date" },
  // { value: "objectId", label: "Object ID" },
  // { value: "openForComment", label: "Open For Comment" },
  { value: 'organization', label: 'Organization' },
  { value: 'originalDocumentId', label: 'Original Document ID' },
  // { value: "pageCount", label: "Page Count" },
  { value: 'phone', label: 'Phone' },
  { value: 'postedDate', label: 'Posted Date' },
  // { value: "postmarkDate", label: "Postmark Date" },
  // { value: "reasonWithdrawn", label: "Reason Withdrawn" },
  { value: 'receiveDate', label: 'Receive Date' },
  // { value: "restrictReason", label: "Restrict Reason" },
  { value: 'restrictReasonType', label: 'Restrict Reason Type' },
  // { value: "stateProvinceRegion", label: "State Province Region" },
  // { value: "submitterRep", label: "Submitter Rep" },
  // { value: "submitterRepAddress", label: "Submitter Rep Address" },
  // { value: "submitterRepCityState", label: "Submitter Rep City State" },
  // { value: "subtype", label: "Subtype" },
  { value: 'title', label: 'Title' },
  // { value: "trackingNbr", label: "Tracking Number" },
  // { value: "withdrawn", label: "Withdrawn" },
  // { value: "zip", label: "Zip" },
];

const Form = () => {
  const socket = useContext(SocketContext);

  const [clientId, setClientId] = useState(null);
  const [comments, setComments] = useState([]);
  const [documentId, setDocumentId] = useState('CMS-2021-0168-0001');
  const [status, setStatus] = useState('Default');

  const addTableRow = useCallback(
    (data) => {
      setComments([...comments, data]);
      // const $tbody = $table.getElementsByTagName('tbody')[0];
      // const row = $tbody.insertRow();
      // keys.forEach((key, index) => {
      //   const column = row.insertCell(index);
      //   column.innerHTML = data[key.value];
      // });
    },
    [comments]
  );

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
  }, [addTableRow, socket]);

  const handleInput = (e) => {
    setDocumentId(e.target.value);
  };

  console.log(comments[0]);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!clientId || !documentId) return null;

    fetch(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/comments`, {
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
        <table className="usa-table" id="table">
          {/* {comments.map((comment, i) => {
            return (
              <tr>
                <td>{comment?.id}</td>
              </tr>
            );
          })} */}
        </table>
      </div>
    </div>
  );
};

export default Form;
