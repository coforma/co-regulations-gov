import React from 'react';
import { formatDate } from '../utils';

const Table = ({ comments = [] }) => {
  return (
    <table className="usa-table">
      <thead>
        <tr>
          <td>ID</td>
          <td>Title</td>
          <td>Comment</td>
          <td>Comment On Document ID</td>
          <td>Docket ID</td>
          <td>Document Type</td>
          <td>First Name</td>
          <td>Last Name</td>
          <td>Organization</td>
          <td>Posted Date</td>
          <td>Receive Date</td>
          {/* <td>Address 1</td> */}
          {/* <td>Address 2</td> */}
          {/* <td>Agency ID</td> */}
          {/* <td>Category</td> */}
          {/* <td>City</td> */}
          {/* <td>Comment On</td> */}
          {/* <td>Country</td> */}
          {/* <td>Display Properties</td> */}
          {/* <td>Doc Abstract</td> */}
          {/* <td>Duplicate Comments</td> */}
          {/* <td>Email</td> */}
          {/* <td>Fax</td> */}
          {/* <td>Field 1</td> */}
          {/* <td>Field 2</td> */}
          {/* <td>File Formats</td> */}
          {/* <td>Gov Agency</td> */}
          {/* <td>Gov Agency Type</td> */}
          {/* <td>Legacy ID</td> */}
          {/* <td>Modify Date</td> */}
          {/* <td>Object ID</td> */}
          {/* <td>Open For Comment</td> */}
          {/* <td>Original Document ID</td> */}
          {/* <td>Page Count</td> */}
          {/* <td>Phone</td> */}
          {/* <td>Postmark Date</td> */}
          {/* <td>Reason Withdrawn</td> */}
          {/* <td>Restrict Reason</td> */}
          {/* <td>Restrict Reason Type</td> */}
          {/* <td>State Province Region</td> */}
          {/* <td>Submitter Rep</td> */}
          {/* <td>Submitter Rep Address</td> */}
          {/* <td>Submitter Rep City State</td> */}
          {/* <td>Subtype</td> */}
          {/* <td>Tracking Number</td> */}
          {/* <td>Withdrawn</td> */}
          {/* <td>Zip</td> */}
        </tr>
      </thead>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.objectId}>
            <td>{comment.objectId}</td>
            <td>{comment.title}</td>
            <td>{comment.comment}</td>
            <td>{comment.commentOnDocumentId}</td>
            <td>{comment.docketId}</td>
            <td>{comment.documentType}</td>
            <td>{comment.firstName}</td>
            <td>{comment.lastName}</td>
            <td>{comment.organization}</td>
            <td>{formatDate(comment.postedDate)}</td>
            <td>{formatDate(comment.receiveDate)}</td>
            {/* <td>{comment.category}</td> */}
            {/* <td>{comment.city}</td> */}
            {/* <td>{comment.commentOn}</td> */}
            {/* <td>{comment.country}</td> */}
            {/* <td>{comment.displayProperties}</td> */}
            {/* <td>{comment.docAbstract}</td> */}
            {/* <td>{comment.duplicateComments}</td> */}
            {/* <td>{comment.email}</td> */}
            {/* <td>{comment.fax}</td> */}
            {/* <td>{comment.field1}</td> */}
            {/* <td>{comment.field2}</td> */}
            {/* <td>{comment.fileFormats}</td> */}
            {/* <td>{comment.govAgency}</td> */}
            {/* <td>{comment.govAgencyType}</td> */}
            {/* <td>{comment.legacyId}</td> */}
            {/* <td>{comment.modifyDate}</td> */}
            {/* <td>{comment.objectId}</td> */}
            {/* <td>{comment.openForComment}</td> */}
            {/* <td>{comment.originalDocumentId}</td> */}
            {/* <td>{comment.pageCount}</td> */}
            {/* <td>{comment.phone}</td> */}
            {/* <td>{comment.postmarkDate}</td> */}
            {/* <td>{comment.reasonWithdrawn}</td> */}
            {/* <td>{comment.restrictReason}</td> */}
            {/* <td>{comment.restrictReasonType}</td> */}
            {/* <td>{comment.stateProvinceRegion}</td> */}
            {/* <td>{comment.submitterRep}</td> */}
            {/* <td>{comment.submitterRepAddress}</td> */}
            {/* <td>{comment.submitterRepCityState}</td> */}
            {/* <td>{comment.subtype}</td> */}
            {/* <td>{comment.trackingNbr}</td> */}
            {/* <td>{comment.withdrawn}</td> */}
            {/* <td>{comment.zip}</td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
