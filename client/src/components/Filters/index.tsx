import React from 'react';

import PropertySelector from './PropertySelector';
import Search from './Search';

interface FiltersProps {
  filterTerm: string;
  handleSearchInput: (e: React.FormEvent<HTMLInputElement>) => void;
  handleSelectColumn: (e: React.FormEvent<HTMLInputElement>) => void;
  selectedProperties: string[];
}

const Filters = ({
  filterTerm,
  handleSearchInput,
  handleSelectColumn,
  selectedProperties,
}: FiltersProps): JSX.Element => (
  <div className="display-flex bg-white padding-3 border-1px">
    <Search filterTerm={filterTerm} handleSearchInput={handleSearchInput} />
    <PropertySelector
      handleSelectColumn={handleSelectColumn}
      selectedProperties={selectedProperties}
    />
  </div>
);

export default Filters;
