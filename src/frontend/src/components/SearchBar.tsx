const SearchBar = () => {
  return (
    <div className="bg-white shadow p-4 flex space-x-2">
    <div className="flex items-center border-2 rounded overflow-hidden">
      <select className="p-2 outline-none cursor-pointer">
        <option>By photographer</option>
        <option>Option 1</option>
        <option>Option 2</option>
      </select>
      <input type="text" className="p-2 outline-none" placeholder="Search Gallery" />
    </div>
    <div className="flex items-center border-2 rounded overflow-hidden">
      <input type="text" className="p-2 outline-none" placeholder="17 Sep - 18 Sep" />
      <button className="p-2 outline-none">
        <i className="far fa-calendar-alt"></i>
      </button>
    </div>
    <div className="flex items-center border-2 rounded overflow-hidden">
      <input type="text" className="p-2 outline-none" placeholder="Pathum Wan" />
      <button className="p-2 outline-none">
        <i className="fas fa-map-marker-alt"></i>
      </button>
    </div>
    <div className="flex items-center border-2 rounded overflow-hidden">
      <input type="text" className="p-2 outline-none" placeholder="1,400 - 2,000 THB" />
    </div>
    <button className="flex items-center justify-center px-4 bg-gray-500 text-white rounded">
      Search
    </button>
  </div>
  );
};

export default SearchBar;
