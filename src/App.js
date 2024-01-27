import React, { useState, useEffect } from 'react';
import Provider, { useCheckup } from './checkup';
import cardData from './cardData';
import './App.css';

const AM_pool = [2049, 2052, 2054, 2056, 2058, 2060, 2062, 2064, 2066, 10270, 10271, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 10278, 10279, 10284, 10285, 10309, 10310, 2131, 2130, 2132, 2129, 2133, 2134, 2135, 2136, 10372, 2181, 2182, 2183, 2184, 2185, 10373, 10408, 2217, 2219, 10409, 2221, 2223, 10416, 2225, 10417, 2227, 2229, 2231, 2259, 2261, 2262, 2263, 2264, 2265, 2266, 10455, 2268, 2269, 10456, 2271, 2272, 2273, 2274, 2275, 2276, 2277, 10480, 10481, 10489, 10490, 2306, 2307, 2308, 2309, 2310, 2311, 2312, 2313, 10519, 10520, 10233, 10235, 2381, 2382, 2383, 2384, 2385, 2386, 2387, 2388, 2431, 2432, 2433, 2434, 2435, 2481, 2482, 2483, 2484, 2485, 2486, 2487, 2488, 2496, 2497, 2498, 2499, 2500, 2501, 2502, 2503, 2546, 2547, 2548, 2549, 2550, 2551, 2552, 2553, 2554, 2555, 2566, 2567, 2568, 2569, 2570, 2571, 2572, 2573, 2602, 2604, 2606, 2608, 2610, 2636, 2637, 2638, 2639, 2640, 2641, 2642, 2643, 2686, 2687, 2688, 2689, 2690, 2691, 2692, 2693, 2731, 2732, 2733, 2734, 2735, 2740, 2741, 2742, 2743, 2744, 2745, 2746, 2747, 2756, 2757, 2758, 2759, 2760, 2762, 2763, 2764, 2765, 2766, 2767, 2768, 2769, 2796, 2798, 2800, 2803, 2804, 2805, 2806, 2807, 2808, 2809, 2810, 2820, 2821, 2822, 2823, 2824, 2827, 2828, 2829, 2830, 2831, 2832, 2833, 2834, 2838, 2839, 2840, 2841, 2842, 2843, 2844, 2845, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 1041, 1042, 1043, 1044, 1045, 1126, 1127, 1128, 1129, 1130, 1181, 1182, 1183, 1184, 1185, 1191, 1192, 1193, 1194, 1195, 1261, 1262, 1263, 1264, 1265, 1266, 1267, 1268, 1269, 1270, 1311, 1312, 1313, 1314, 1315, 1327, 1329, 1331, 1333, 1335, 1336, 1337, 1338, 1339, 1340, 1366, 1367, 1368, 1369, 1370, 1375, 1376, 1377, 1378, 1379, 1390, 1391, 1392, 1393, 1394, 1406, 1407, 1408, 1409, 1410, 1666, 1667, 1668, 1669, 1670, 1701, 1702, 1703, 1704, 1705, 1706, 1707, 1708, 1720, 1721, 1722, 1723, 1724, 1837, 1839, 1841, 1843, 1845, 1847, 1849, 1851, 10047, 10048, 10049, 10050, 10100, 10101, 10102, 10103, 1926, 1922, 1928, 1924, 1930, 10118, 1932, 10119, 1934, 1936, 10137, 10138, 10146, 10147, 10165, 10166, 10170, 10171, 2001, 2002, 2003, 2004, 2005, 10197, 2007, 10198, 2009, 2011, 2013, 2015, 2017, 2019, 2021, 2043, 10236, 2045, 2047]
var typeCountAll = {}, typeCountHas = {};

const App = () => {
  const { queryInventory, updateInventory, hasCard } = useCheckup();
  // const [matchingKeys, setMatchingKeys] = useState([]);
  const [notMatchingKeys, setNotMatchingKeys] = useState([]);
  const [uid, setUid] = useState('');
  const [auth, setAuth] = useState('');

  const handleImport = async () => {
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert('請輸入正確的UID格式')
    else {
      try {
        await queryInventory(uid);
        notMatchingKeys.length = 0;
        window.alert('匯入成功！')
      } catch (error) {
        window.alert('匯入失敗，請確認有於神魔健檢中心公開背包。')
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
        window.alert('更新成功！')
      } catch (error) {
        window.alert('更新失敗，請確認有於神魔健檢中心公開背包。')
      }
    }
  };

  const handleResult = async () => {
    const foundKeys = [], notFoundKeys = [];
    typeCountAll = {};
    typeCountHas = {};
    AM_pool.forEach(key => {
      if (cardData.hasOwnProperty(key)) {
        const type = cardData[key].attribute * 100 + cardData[key].race;
        // 判斷type是否已經存在，若不存在，初始化count為1，若存在，增加count
        if (typeCountAll[type] === undefined) typeCountAll[type] = 1;
        else typeCountAll[type]++;
      }
    });
    for (const key in cardData) {
      if (AM_pool.includes(Number(key))) {
        if (hasCard(key)) foundKeys.push(key);
        else notFoundKeys.push(key);
      }
    }
    // setMatchingKeys(foundKeys);
    foundKeys.forEach(key => {
      if (cardData.hasOwnProperty(key)) {
        const type = cardData[key].attribute * 100 + cardData[key].race;
        if (typeCountHas[type] === undefined) typeCountHas[type] = 1;
        else typeCountHas[type]++;
      }
    });
    // console.log(typeCountAll, typeCountHas);
    setNotMatchingKeys(notFoundKeys);
  };

  useEffect(() => {
    handleResult();
  }, []);

  let resultKey = [];
  notMatchingKeys.forEach(key => {
    if (cardData.hasOwnProperty(key)) {
      let score = cardData[key].score;
      cardData[key].value.forEach(([cardId, value]) => {
        if (cardData.hasOwnProperty(cardId)) {
          score += value;
        }
      });
      resultKey.push([key, score]);
    }
  });

  resultKey = resultKey
  .slice()
  .sort((a, b) => b[1] - a[1])
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
          <button onClick={handleImport}>匯入背包</button>
        </label>
        <label>
          活動驗證碼<input type="text" value={auth} onChange={(e) => setAuth(e.target.value)} />
          <button onClick={handleUpdate}>重新獲取</button>
        </label>
        <label>
          <button onClick={handleResult}>更新列表</button>
          <small style={{ textAlign: 'right' }}>評價者：<a className="src" href="https://www.youtube.com/@user-oq4nb1df7w/videos" target="_blank" rel="noreferrer">微醺盜賊</a></small>
        </label>
        <label>
          ⚠️數字僅供參考，小於５為必中。開過圖鑑卻刪除，或擁有進化前的不在此考量，審慎選擇。
        </label>
      </div>

      <div className="matching-keys-container">
      {notMatchingKeys.length > 0 && (
        <>
        {/* <div>閣下無該些卡片，以下依推薦排序：</div> */}
        <table>
          <tbody>
            {resultKey.map(([key, score]) => (
              <React.Fragment key={key}>
                <tr>
                  <td style={{ width: '77px' }} rowSpan="2">
                    <img
                      src={`https://web-assets.tosconfig.com/gallery/icons/${String(key).padStart(4, '0')}.jpg`}
                      alt={key}
                      style={{ width: '60px', borderRadius: '9%' }}
                    />
                  </td>
                  <td style={{ width: '13px' }}>
                    <img
                      src={`https://hiteku.github.io/img/tos/-/${imgUrlAttr(cardData[key]?.attribute)}.png`}
                      alt={`Attr-${cardData[key]?.attribute}`}
                      style={{ width: '25px' }}
                    />
                  </td>
                  <td style={{ width: '13px' }}>
                    <img
                      src={`https://hiteku.github.io/img/tos/-/${imgUrlRace(cardData[key]?.race)}.png`}
                      alt={`Race-${cardData[key]?.race}`}
                      style={{ width: '25px' }}
                    />
                  </td>
                  <td id="td_left">{score === 0 ? '暫無評' : score}分</td>
                </tr>
                <tr>
                <td colSpan="2">
                  {(() => {
                    const type = cardData[key]?.attribute * 100 + cardData[key]?.race;
                    const result = typeCountAll[type] - typeCountHas[type];
                    return isNaN(result) ? typeCountAll[type] : result;
                  })()}
                </td>
                <td rowSpan="2" id="td_left">{cardData[key]?.reason}</td>
                </tr>
                <tr>
                  <td colSpan="3">{cardData[key]?.name}</td>
                </tr>
              </React.Fragment>
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
