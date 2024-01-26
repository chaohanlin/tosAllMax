import React, { useState } from 'react';
import Provider, { useCheckup } from './checkup';
import cardData from './cardData';
import './App.css';

const App = () => {
  const { queryInventory, updateInventory, hasCard } = useCheckup();
  // const [matchingKeys, setMatchingKeys] = useState([]);
  const [notMatchingKeys, setNotMatchingKeys] = useState([]);
  const [uid, setUid] = useState(''); // 1014202320
  const [auth, setAuth] = useState(''); // 647781

  const handleImport = async () => {
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert('請輸入正確的UID格式')
    else {
      try {
        notMatchingKeys.length = 0
        await queryInventory(uid);
        window.alert('匯入成功')
      } catch (error) {
        window.alert('匯入失敗')
      }
    }
  };

  const handleUpdate = async () => {
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert('請輸入正確的UID格式')
    else if (!auth.match(/^\d{6}$/)) window.alert('請輸入正確的驗證碼')
    else {
      try {
        notMatchingKeys.length = 0
        await updateInventory(uid, auth);
        window.alert('更新成功')
      } catch (error) {
        window.alert('更新失敗')
      }
    }
  };

  const handleResult = async () => {
    const foundKeys = [], notFoundKeys = [];
    for (const key in cardData) {
      if (hasCard(key)) foundKeys.push(key);
      else notFoundKeys.push(key);
    }
    // setMatchingKeys(foundKeys);
    setNotMatchingKeys(notFoundKeys);
  };

  const sortedKeys = notMatchingKeys
  .slice()
  .sort((a, b) => cardData[b]?.point - cardData[a]?.point)
  .slice(0, 20); // 只列出前20高分的

  return (
    <div className="app-container">
      <div className="popup-container">
        <label>
          UID<input type="text" value={uid} onChange={(e) => setUid(e.target.value)} />
          <button onClick={handleImport}>匯入</button>
        </label>
        <label>
          活動驗證碼<input type="text" value={auth} onChange={(e) => setAuth(e.target.value)} />
          <button onClick={handleUpdate}>更新</button>
        </label>
        <label>
          <button onClick={handleResult}>推薦</button>
        </label>
      </div>

      <div className="matching-keys-container">
      {notMatchingKeys.length > 0 && (
        <>
        <div>閣下無該些卡片，以下依推薦排序：</div>
        {sortedKeys.map((key) => (
          <div key={key} className="matching-key-item">
            <img
              src={`https://web-assets.tosconfig.com/gallery/icons/${String(key).padStart(4, '0')}.jpg`}
              alt={key}
              style={{ width: '60px', borderRadius: '9%' }}
            />
            {cardData[key]?.reason}
          </div>
        ))}
        {/* {matchingKeys.map((key) => (
          <div key={key} className="matching-key-item">
            <img
              src={`https://web-assets.tosconfig.com/gallery/icons/${String(key).padStart(4, '0')}.jpg`}
              alt={key}
              style={{ width: '60px', borderRadius: '9%', opacity: 0.3 }}
            />
          </div>
        ))} */}
        </>
      )}
      </div>
    </div>
  );
};

const AppWithCheckup = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};

export default AppWithCheckup;
