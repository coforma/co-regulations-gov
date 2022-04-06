import { ChangeEvent } from 'react';
import { commentProperties } from '../../utils';

interface PropertySelectorProps {
  handleSelectColumn: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedProperties: string[];
}

const PropertySelector = ({
  handleSelectColumn,
  selectedProperties,
}: PropertySelectorProps): JSX.Element => (
  <div className="desktop:grid-col">
    <form>
      <fieldset className="usa-fieldset">
        <legend className="usa-legend margin-bottom-3">Toggle Columns</legend>
        <div className="grid-row">
          {Object.entries(commentProperties).map((entry) => {
            const [key, label] = entry;
            if (['attachments', 'id'].includes(key)) return null;
            return (
              <div
                className="tablet:grid-col-4 usa-checkbox margin-bottom-1"
                key={key}
              >
                <input
                  checked={selectedProperties.includes(key)}
                  className="usa-checkbox__input"
                  id={key}
                  name="historical-figures"
                  onChange={handleSelectColumn}
                  type="checkbox"
                  value={key}
                />
                <label
                  className="usa-checkbox__label margin-top-0"
                  htmlFor={key}
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </form>
  </div>
);

export default PropertySelector;
