import React, { useState } from 'react';
import { YsGlobal } from '@global/handleGlobal';

const UserListSearch = props => {
  const { userListInner } = YsGlobal.languageInfo;
  const { search } = props;
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = e => {
    setInputValue(e.target.value);
    search(e.target.value);
  };
  return (
    <div className="userlist-search">
      <span className="searchBtn icon-search"></span>
      <input className="searchInput" type="text" onChange={handleInputChange} value={inputValue} placeholder={userListInner.searchPlacehoder} />
    </div>
  );
};
export default UserListSearch;
