import React from 'react';

import PropertySelector from './PropertySelector';
import Search from './Search';

const Filters = ({
  filterTerm,
  handleSearchInput,
  handleSelectColumn,
  selectedProperties,
}) => {
  return (
    <div className="display-flex bg-white padding-3 border-1px">
      <Search filterTerm={filterTerm} handleSearchInput={handleSearchInput} />
      <PropertySelector
        handleSelectColumn={handleSelectColumn}
        selectedProperties={selectedProperties}
      />
    </div>
  );
};

export default Filters;
