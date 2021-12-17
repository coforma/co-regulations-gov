import React from 'react';
import { commentProperties, formatDate } from '../utils';

const Table = ({ comments = [], selectedProperties = [] }) => {
  return (
    <div className="usa-table--compact" tabIndex="0">
      <table className="usa-table">
        <thead>
          <tr>
            {selectedProperties.map((prop) => (
              <td key={prop}>{commentProperties[prop]}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.objectId}>
              {selectedProperties.map((prop, i) => {
                if (
                  typeof comment[prop] === 'object' &&
                  comment[prop] !== null
                ) {
                  return (
                    <td key={prop}>
                      {formatDate(comment[prop])}
                      {prop}
                    </td>
                  );
                }
                return <td key={prop}>{comment[prop]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
