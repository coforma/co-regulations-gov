import React, { Fragment } from 'react';
import { commentProperties, formatDate } from '../utils';

const TableDataCell = ({ comment, property }) => {
  // handle dates
  if (typeof comment[property] === 'object' && comment[property] !== null) {
    return <td>{formatDate(comment[property])}</td>;
  }
  // handle attachments
  if (property === 'comment' && comment.attachments.length) {
    return (
      <td>
        <p>{comment.comment}</p>
        {comment.attachments.map((attachment) => {
          const { attributes } = attachment;
          if (attributes.fileFormats.length) {
            return attributes.fileFormats.map((file) => {
              return (
                <a
                  href={file.fileUrl}
                  key={file.format}
                  target="_blank"
                  rel="noreferrer"
                >
                  {attributes.title} ({file.format})
                </a>
              );
            });
          }
          return null;
        })}
      </td>
    );
  }
  return <td>{comment[property]}</td>;
};

const Table = ({ comments = [], selectedProperties = [] }) => {
  return (
    <div className="usa-table-container--scrollable" tabIndex="0">
      <table className="usa-table">
        <thead>
          <tr>
            <td>ID</td>
            {selectedProperties.map((prop) => (
              <td key={prop}>{commentProperties[prop]}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.objectId}>
              <td>
                <a
                  href={`https://www.regulations.gov/comment/${comment.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {comment.id}
                </a>
              </td>
              {selectedProperties.map((property) => (
                <TableDataCell
                  key={property}
                  comment={comment}
                  property={property}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
