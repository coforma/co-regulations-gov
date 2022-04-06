import { ChangeEvent } from 'react';

interface SearchProps {
  filterTerm: string;
  handleSearchInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({
  filterTerm,
  handleSearchInput,
}: SearchProps): JSX.Element => (
  <div className="desktop:grid-col">
    <form>
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
  </div>
);

export default Search;
