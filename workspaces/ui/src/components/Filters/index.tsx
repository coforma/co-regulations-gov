import { ChangeEvent } from 'react';

import PropertySelector from './PropertySelector';
import Search from './Search';

interface FiltersProps {
  filterTerm: string;
  handleSearchInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSelectColumn: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedProperties: string[];
}

const Filters = ({
  filterTerm,
  handleSearchInput,
  handleSelectColumn,
  selectedProperties,
}: FiltersProps): JSX.Element => (
  <div className="bg-white padding-3 border-1px">
    <div className="grid-row">
      <Search filterTerm={filterTerm} handleSearchInput={handleSearchInput} />
      <PropertySelector
        handleSelectColumn={handleSelectColumn}
        selectedProperties={selectedProperties}
      />
    </div>
  </div>
);

export default Filters;
