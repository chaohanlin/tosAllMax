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
        await queryInventory(uid);
        notMatchingKeys.length = 0;
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

  const imgUrlAttr = (attribute) => {
    switch (attribute) {
      case 1:
        return 'water';
      case 2:
        return 'fire';
      case 3:
        return 'wood';
      case 4:
        return 'light';
      case 5:
        return 'dark';
      default:
        return '';
    }
  };
  
  const imgUrlRace = (race) => {
    switch (race) {
      case 1:
        return 'human';
      case 2:
        return 'beast';
      case 3:
        return 'fairy';
      case 4:
        return 'dragon';
      case 5:
        return 'god';
      case 8:
        return 'demon';
      case 10:
        return 'machine';
      default:
        return '';
    }
  };

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
          <button onClick={handleResult}>列出推薦</button>
        </label>
      </div>

      <div className="matching-keys-container">
      {notMatchingKeys.length > 0 && (
        <>
        {/* <div>閣下無該些卡片，以下依推薦排序：</div> */}
        <table>
          <tbody>
          {sortedKeys.map((key) => (
            <>
            <tr key={key}>
              <td style={{ width: '70px' }} rowSpan="2">
                <img
                  src={`https://web-assets.tosconfig.com/gallery/icons/${String(key).padStart(4, '0')}.jpg`}
                  alt={key}
                  style={{ width: '60px', borderRadius: '9%' }}
                />
              </td>
              <td style={{ width: '15px' }}>
                <img
                  src={`https://hiteku.github.io/img/tos/-/${imgUrlAttr(cardData[key]?.attribute)}.png`}
                  alt={`Attr-${cardData[key]?.attribute}`}
                  style={{ width: '25px' }}
                />
              </td>
              <td style={{ width: '15px' }}>
                <img
                  src={`https://hiteku.github.io/img/tos/-/${imgUrlRace(cardData[key]?.race)}.png`}
                  alt={`Race-${cardData[key]?.race}`}
                  style={{ width: '25px' }}
                />
              </td>
              <td id="td_left">綜合評分：{cardData[key]?.point}</td>
            </tr>
            <tr key={key}>
              <td colSpan="2">{key}</td>
              <td rowSpan="2" id="td_left">{cardData[key]?.reason}</td>
            </tr>
            <tr key={key}>
              <td style={{ width: '60px' }} colSpan="3">
                {cardData[key]?.name}
              </td>
            </tr>
            </>
          ))}
          </tbody>
        </table>
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
