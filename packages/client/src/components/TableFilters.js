import React from 'react';

const TableFilters = ({ onChange, filterTerm }) => {
  return (
    <form>
      <label className="usa-label" htmlFor="filterTerm">
        Filter
      </label>
      <input
        className="usa-input"
        id="filterTerm"
        name="filterTerm"
        onChange={onChange}
        placeholder=""
        required
        type="text"
        value={filterTerm}
      />
    </form>
  );
};

export default TableFilters;
