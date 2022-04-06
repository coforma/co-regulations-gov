import { commentProperties } from '../utils';
import { Comment, CommentKeys } from 'types';

interface TableDataCellProps {
  comment: Comment;
  property: keyof Comment;
}

const TableDataCell = ({ comment, property }: TableDataCellProps) => {
  if (
    property === 'postedDate' ||
    property === 'modifyDate' ||
    property === 'receiveDate' ||
    property === 'postmarkDate'
  ) {
    const date = comment[property];
    if (date) return <td>{new Date(date).toLocaleString('en-US')}</td>;
  }
  // Attachments
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

interface TableProps {
  comments: Comment[];
  selectedProperties: Array<keyof CommentKeys>;
}

const Table = ({
  comments = [],
  selectedProperties = [],
}: TableProps): JSX.Element => (
  <div className="usa-table-container--scrollable" tabIndex={0}>
    <table className="usa-table">
      <thead>
        <tr>
          <td>ID</td>
          {selectedProperties.map((property) => (
            <td key={property}>{commentProperties[property]}</td>
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
                comment={comment}
                key={property}
                property={property}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
