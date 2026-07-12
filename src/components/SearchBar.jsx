import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field w-full pl-12 pr-10 py-3 rounded-xl"
        placeholder="Search transactions..."
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;