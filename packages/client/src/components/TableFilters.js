import React from 'react';
import { commentProperties } from '../utils';

const TableFilters = ({
  filterTerm,
  handleSearchInput,
  handleSelectColumn,
  selectedProperties,
}) => {
  return (
    <div className="display-flex bg-white padding-3 border-1px">
      <form style={{ width: '50%' }}>
        <fieldset className="usa-fieldset">
          <label
            className="usa-label margin-top-0 margin-bottom-3"
            htmlFor="filterTerm"
          >
            Filter
          </label>
          <input
            className="usa-input"
            id="filterTerm"
            name="filterTerm"
            onChange={handleSearchInput}
            placeholder=""
            required
            type="text"
            value={filterTerm}
          />
        </fieldset>
      </form>
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
    </div>
  );
};

export default TableFilters;
