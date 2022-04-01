import React from 'react';
import { commentProperties } from '../../utils';

const PropertySelector = ({ handleSelectColumn, selectedProperties }) => {
  return (
    <form style={{ width: '50%' }}>
      <fieldset className="usa-fieldset">
        <legend className="usa-legend margin-bottom-3">Toggle Columns</legend>
        <div
          style={{
            display: 'grid',
            gridGap: '10px',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          {Object.entries(commentProperties).map((entry) => {
            const [key, label] = entry;
            return (
              <div className="usa-checkbox" key={key}>
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
  );
};

export default PropertySelector;
