import React from "react";
import { SearchIcon, User, Pill } from "lucide-react";

const Search = () => {
  return (
    <div className="flex flex-1 overflow-auto">
      <div className="w-full">
        <div className="flex  gap-4">
          <div className="relative flex-1 ">
            <input
              type="text"
              // value={searchTerm}
              // onChange={handleSearch}
              placeholder="Search "
              className="w-full p-3 pl-10 border bg-white border-gray-300 rounded-md focus:outline-none focus:border-2 focus:border-teal-500"
            />
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button className="bg-teal-500 px-5 text-white rounded-md cursor-pointer shadow-inner tracking-wider shadow-teal-300">Search</button>
        </div>
      </div>
    </div>
  );
};

export default Search;
