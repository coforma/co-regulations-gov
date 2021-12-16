import React, { useEffect, useContext, useState } from 'react';
import { SocketContext } from '../context/socket';

const Form = () => {
  const socket = useContext(SocketContext);

  const [clientId, setClientId] = useState(null);
  const [comments, setComments] = useState([]);
  const [documentId, setDocumentId] = useState('');
  const [status, setStatus] = useState('Default');

  useEffect(() => {
    socket.on('connect', () => {
      setClientId(socket.id);
      console.log({ client: socket.id });
    });

    socket.on('comment', (data) => {
      // overwhelming the browser in this useEffect hook... consider alternatives
      // setComments([...comments, data]);
    });

    socket.on('complete', (data) => {
      setComments(data.comments);
      if (data?.error?.code === 'OVER_RATE_LIMIT') {
        setStatus('You have exceeded your rate limit. Try again later.');
      } else {
        setStatus(data.error ? data.error.message : 'Complete');
      }
    });
  }, [comments, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId || !documentId) return null;
    setComments([]);
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
      .catch((error) => console.error('Error:', error));
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
          placeholder="CMS-****-****-****"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
        />
        <input
          className="usa-button"
          type="submit"
          value="Submit"
          onClick={handleSubmit}
        />
      </form>

      {comments?.length ? (
        <div
          className="usa-table-container--scrollable margin-top-3"
          id="table-container"
          tabIndex="0"
        >
          <table className="usa-table" id="table">
            <thead>
              <tr>
                <td>ID</td>
                {/* <td>Address 1</td> */}
                {/* <td>Address 2</td> */}
                {/* <td>Agency ID</td> */}
                {/* <td>Category</td> */}
                {/* <td>City</td> */}
                <td>Comment</td>
                {/* <td>Comment On</td> */}
                <td>Comment On Document ID</td>
                {/* <td>Country</td> */}
                {/* <td>Display Properties</td> */}
                {/* <td>Doc Abstract</td> */}
                <td>Docket ID</td>
                <td>Document Type</td>
                {/* <td>Duplicate Comments</td> */}
                {/* <td>Email</td> */}
                {/* <td>Fax</td> */}
                {/* <td>Field 1</td> */}
                {/* <td>Field 2</td> */}
                {/* <td>File Formats</td> */}
                <td>First Name</td>
                {/* <td>Gov Agency</td> */}
                {/* <td>Gov Agency Type</td> */}
                <td>Last Name</td>
                {/* <td>Legacy ID</td> */}
                {/* <td>Modify Date</td> */}
                {/* <td>Object ID</td> */}
                {/* <td>Open For Comment</td> */}
                <td>Organization</td>
                {/* <td>Original Document ID</td> */}
                {/* <td>Page Count</td> */}
                {/* <td>Phone</td> */}
                <td>Posted Date</td>
                {/* <td>Postmark Date</td> */}
                {/* <td>Reason Withdrawn</td> */}
                <td>Receive Date</td>
                {/* <td>Restrict Reason</td> */}
                {/* <td>Restrict Reason Type</td> */}
                {/* <td>State Province Region</td> */}
                {/* <td>Submitter Rep</td> */}
                {/* <td>Submitter Rep Address</td> */}
                {/* <td>Submitter Rep City State</td> */}
                {/* <td>Subtype</td> */}
                <td>Title</td>
                {/* <td>Tracking Number</td> */}
                {/* <td>Withdrawn</td> */}
                {/* <td>Zip</td> */}
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => {
                if (!comment.objectId) return null;
                return (
                  <tr key={comment.objectId}>
                    <td>{comment.objectId}</td>
                    {/* <td>{comment.category}</td> */}
                    {/* <td>{comment.city}</td> */}
                    <td>{comment.comment}</td>
                    {/* <td>{comment.commentOn}</td> */}
                    <td>{comment.commentOnDocumentId}</td>
                    {/* <td>{comment.country}</td> */}
                    {/* <td>{comment.displayProperties}</td> */}
                    {/* <td>{comment.docAbstract}</td> */}
                    <td>{comment.docketId}</td>
                    <td>{comment.documentType}</td>
                    {/* <td>{comment.duplicateComments}</td> */}
                    {/* <td>{comment.email}</td> */}
                    {/* <td>{comment.fax}</td> */}
                    {/* <td>{comment.field1}</td> */}
                    {/* <td>{comment.field2}</td> */}
                    {/* <td>{comment.fileFormats}</td> */}
                    <td>{comment.firstName}</td>
                    {/* <td>{comment.govAgency}</td> */}
                    {/* <td>{comment.govAgencyType}</td> */}
                    <td>{comment.lastName}</td>
                    {/* <td>{comment.legacyId}</td> */}
                    {/* <td>{comment.modifyDate}</td> */}
                    {/* <td>{comment.objectId}</td> */}
                    {/* <td>{comment.openForComment}</td> */}
                    <td>{comment.organization}</td>
                    {/* <td>{comment.originalDocumentId}</td> */}
                    {/* <td>{comment.pageCount}</td> */}
                    {/* <td>{comment.phone}</td> */}
                    <td>{comment.postedDate}</td>
                    {/* <td>{comment.postmarkDate}</td> */}
                    {/* <td>{comment.reasonWithdrawn}</td> */}
                    <td>{comment.receiveDate}</td>
                    {/* <td>{comment.restrictReason}</td> */}
                    {/* <td>{comment.restrictReasonType}</td> */}
                    {/* <td>{comment.stateProvinceRegion}</td> */}
                    {/* <td>{comment.submitterRep}</td> */}
                    {/* <td>{comment.submitterRepAddress}</td> */}
                    {/* <td>{comment.submitterRepCityState}</td> */}
                    {/* <td>{comment.subtype}</td> */}
                    <td>{comment.title}</td>
                    {/* <td>{comment.trackingNbr}</td> */}
                    {/* <td>{comment.withdrawn}</td> */}
                    {/* <td>{comment.zip}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Form;
