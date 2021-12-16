import React from 'react';

const TableFilters = ({ onChange, searchTerm }) => {
  return (
    <form>
      <label className="usa-label" htmlFor="searchTerm">
        Search
      </label>
      <input
        className="usa-input"
        id="searchTerm"
        name="searchTerm"
        onChange={onChange}
        placeholder=""
        required
        type="text"
        value={searchTerm}
      />
    </form>
  );
};

export default TableFilters;
