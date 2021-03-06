import { SyntheticEvent, useState } from 'react';

interface RetrieveDocumentCommentsFormProps {
  clientId: string;
  onError: (error: string) => void;
  onSubmit: () => void;
  onSuccess: () => void;
}

const RetrieveDocumentCommentsForm = ({
  clientId,
  onError,
  onSubmit,
  onSuccess,
}: RetrieveDocumentCommentsFormProps): JSX.Element => {
  const [documentId, setDocumentId] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit();
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
      .then(onSuccess)
      .catch(onError);
  };

  return (
    <form className="usa-form">
      <label className="usa-label" htmlFor="documentId">
        Document ID
      </label>
      <input
        className="usa-input"
        id="documentId"
        name="documentId"
        onChange={(e) => setDocumentId(e.target.value)}
        placeholder="NHTSA-2021-0001"
        required
        type="text"
        value={documentId}
      />
      <input
        className="usa-button"
        disabled={!documentId}
        onClick={handleSubmit}
        type="submit"
        value="Submit"
      />
    </form>
  );
};

export default RetrieveDocumentCommentsForm;
