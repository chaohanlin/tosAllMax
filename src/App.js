import React, { useState, useRef, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import Provider, { useCheckup } from './checkup';
import cardData from './cardData';
import './App.css';

var iconWidth = 60;
const AM_pool_2024 = [597, 2796, 1041, 1336, 2041, 2259, 2274, 2740, 2766, 2762, 2273, 2268, 1701, 2017, 2381, 10417, 2820, 1406, 2843, 1922, 2129, 10048, 1191, 1390, 2087, 2803, 2827, 2832, 2052, 2217, 2636, 10103, 10236, 2181, 2602, 1181, 2838, 2306, 2311, 2686, 10197, 2431, 2001, 826, 827, 2731, 1261, 1311, 1375, 1916, 2082, 2481, 1837, 1847, 2496, 10409, 2546, 1327, 2551, 1126, 1266, 2756, 1666, 1811, 2566, 10101, 10372, 1366, 1720, 2007, 10138, 599, 2182, 2798, 2043, 2744, 2747, 2767, 2768, 2275, 2276, 2009, 2382, 10118, 10166, 10520, 1407, 1391, 1924, 2134, 2687, 10490, 1192, 2828, 2833, 2219, 2227, 10049, 10310, 2821, 1868, 2604, 1182, 2312, 2567, 10147, 10519, 2432, 2002, 816, 817, 1042, 2732, 1262, 1312, 1337, 1376, 1917, 2083, 2486, 2482, 2804, 2807, 1702, 1706, 1839, 1849, 2130, 2307, 2313, 2497, 2637, 2641, 10279, 10309, 2547, 1329, 2552, 1127, 1267, 2757, 1667, 1812, 2269, 2839, 2054, 2062, 2501, 10235, 1367, 1721, 601, 2800, 1043, 2045, 2261, 2741, 2745, 2763, 2263, 2383, 2386, 2183, 1408, 1392, 1668, 2483, 1926, 1932, 2308, 2568, 2691, 10102, 1193, 2829, 1869, 2056, 2221, 2229, 2571, 2638, 10480, 2822, 2606, 1183, 2810, 2688, 10278, 2433, 2003, 824, 825, 2733, 1263, 1313, 1338, 1377, 1918, 2084, 2487, 2808, 1707, 1841, 2131, 2135, 10171, 2548, 1331, 2553, 1128, 1268, 2758, 1813, 2088, 2840, 2498, 2502, 10137, 10481, 1368, 1722, 1703, 2011, 2019, 10373, 603, 1339, 2047, 2089, 2271, 2277, 2484, 2746, 2764, 2264, 2265, 2013, 2384, 10271, 10284, 2823, 1409, 2809, 2844, 1870, 1928, 1934, 2569, 2689, 2692, 10455, 1194, 1669, 2742, 2830, 2064, 2223, 2231, 2642, 10170, 2608, 1184, 1393, 2841, 2309, 10047, 2434, 2004, 2184, 820, 821, 822, 1044, 2734, 1269, 1264, 1314, 1378, 2085, 2805, 1704, 1708, 1843, 2132, 2136, 2499, 2503, 2572, 2639, 10100, 10119, 10489, 2549, 1333, 2554, 1129, 2759, 1814, 2769, 2058, 1369, 1723, 10408, 605, 2049, 2266, 2272, 2021, 2387, 2388, 2570, 10050, 10165, 10198, 1410, 2806, 2845, 1930, 1936, 2310, 10146, 10285, 2185, 1195, 2765, 2831, 2834, 2225, 10416, 2610, 1185, 1394, 2842, 2690, 2693, 2435, 2005, 2824, 818, 819, 823, 1045, 2735, 1270, 1265, 1315, 1340, 1379, 2488, 2485, 1705, 1845, 1851, 2133, 2385, 2640, 2643, 2550, 1335, 2555, 1130, 2760, 1670, 1815, 2086, 2262, 2743, 2060, 2066, 2500, 1370, 1724, 2015, 2573, 10270, 10456];
// 方便保留往年資料或使用其他測試資料
const AM_pool = AM_pool_2024;
const AM_total = AM_pool.length
if(process.env.NODE_ENV !== "production") {
  // 只在開發過程中顯示
  console.log('AM可選總數：', AM_total);
}
// var typeCountAll = {}, typeCountHas = {};

function CardInfo({ card, cardInfoRef, style }) {
  const {hasCard, inventory} = useCheckup();
  return (
    <div className="card-info" ref={cardInfoRef} style={style}>
      <strong>{inventory === undefined && "會"}因以下卡片而改變分數</strong><hr/>
      {(cardData[card]?.value ?? []).map(([value, quantity], i) => (
        <span className="float-score__card" key={value}>
          <img
            src={`https://web-assets.tosconfig.com/gallery/icons/${String(value).padStart(4, '0')}.jpg`}
            alt={value}
            className={`float-score__card-icon ${!(hasCard(value) || inventory === undefined) && "float-score__card-icon--disabled"}`}
          />
          <span className={`float-score__variation ${hasCard(value) ? "float-score__variation--enabled" : inventory !== undefined && "float-score__variation--disabled"}`}>{quantity >= 0 ? `+${quantity}` : quantity}</span>
        </span>
      ))}
    </div>
  );
}

const App = () => {
  const { queryInventory, updateInventory, hasCard, inventory } = useCheckup();
  const [loadingInventory, setLoadingInventory] = useState(false);
  // const [importFail, setImportFail] = useState(false);
  // const [matchingKeys, setMatchingKeys] = useState([]);
  const notMatchingKeys = useMemo(() => AM_pool.filter(key => !hasCard(key)), [hasCard]);
  const [uid, setUid] = useState('');
  const [auth, setAuth] = useState('');
  const [displayCount, setDisplayCount] = useState(15);
  const [showCardInfo, setShowCardInfo] = useState(null);
  const [cardInfoPosition, setCardInfoPosition] = useState({ top: 0, left: 0 });
  const cardInfoRef = useRef(null);

  useEffect(() => {
    // handleResult();
    const handleCardInfoClick = (event) => {
      if (cardInfoRef.current && !cardInfoRef.current.contains(event.target)) {
        setShowCardInfo(null);
      }
    };
    window.addEventListener('click', handleCardInfoClick);
    return () => {
      window.removeEventListener('click', handleCardInfoClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardInfoRef]);

  const handleImageHover = (event, key) => {
    event.stopPropagation();
    const imagePosition = event.target.getBoundingClientRect();
    setCardInfoPosition({
      top: `${imagePosition.bottom + window.scrollY - iconWidth - 3}px`,
      left: `${imagePosition.left + window.scrollX + iconWidth + 3}px`,
    });
    setShowCardInfo(key);
  };

  const handleImport = async () => {
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert('請輸入正確的UID格式')
    else {
      try {
        setLoadingInventory(true);
        await queryInventory(uid);
        // notMatchingKeys.length = 0;
        // setImportFail(false);
        window.alert('匯入成功！')
      } catch (error) {
        // setImportFail(true);
        window.alert('更新失敗。請確認輸入是否正確，且已於神魔健檢中心公開背包。')
      }
      setLoadingInventory(false);
    }
  };

  const handleUpdate = async () => {
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert('請輸入正確的UID格式')
    else if (!auth.match(/^\d{6}$/)) window.alert('請輸入正確的驗證碼')
    else {
      try {
        setLoadingInventory(true);
        await updateInventory(uid, auth);
        window.alert('更新成功！')
      } catch (error) {
        window.alert('更新失敗。請確認輸入是否正確，且已於神魔健檢中心公開背包。')
      }
      setLoadingInventory(false);
    }
  };

  const handleSelectChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setDisplayCount(selectedValue);
  };

  // 已棄用
  /* const handleResult = async () => {
    var AM_card = [[596, 597], [344, 345, 1046, 2795, 2796], [531, 532, 1041], [1056, 1057, 1336], [1166, 2041], [1276, 1277, 2259], [1286, 1287, 2274], [1446, 1447, 2740], [1471, 1472, 2766], [1481, 1482, 2762], [1671, 1672, 2273], [1681, 1682, 2268], [1701], [2016, 2017], [2381], [10417], [211, 212, 641, 1380, 1381, 2820], [1031, 1032, 1406], [1646, 1647, 2843], [1921, 1922], [2129], [10048], [861, 862, 1191], [1221, 1222, 1390], [1246, 1247, 2087], [1536, 1537, 2803], [1601, 1602, 2827], [1611, 1612, 2832], [2051, 2052], [2216, 2217], [2636], [10103], [10236], [221, 222, 591, 1081, 1082, 2181], [413, 414, 1066, 2601, 2602], [790, 791, 1181], [1636, 1637, 2838], [2306], [2311], [2686], [10197], [191, 192, 941, 1356, 1357, 2431], [201, 202, 506, 1021, 1022, 2001], [375, 376, 826], [377, 378, 827], [801, 802, 1216, 1821, 1822, 2731], [946, 947, 1261], [986, 987, 1311], [1136, 1137, 1375], [1916], [1236, 1237, 2082], [1416, 1417, 2481], [1836, 1837], [1846, 1847], [2496], [10409], [388, 389, 2546], [466, 467, 711, 1326, 1327], [716, 2551], [726, 727, 1126], [881, 882, 1266], [1101, 1102, 1351, 2756], [1666], [1811], [2566], [10101], [10372], [596, 1366], [1720], [2006, 2007], [10138], [598, 599], [223, 224, 592, 1083, 1084, 2182], [346, 347, 1047, 2797, 2798], [1168, 2043], [1448, 1449, 2744], [1456, 1457, 2747], [1473, 1474, 2767], [1483, 1484, 2768], [1673, 1674, 2275], [1683, 1684, 2276], [2008, 2009], [2382], [10118], [10166], [10520], [1033, 1034, 1407], [1223, 1224, 1391], [1923, 1924], [2134], [2687], [10490], [863, 864, 1192], [1603, 1604, 2828], [1613, 1614, 2833], [2218, 2219], [2226, 2227], [10049], [10310], [213, 214, 642, 1382, 1383, 2821], [1868], [415, 416, 1067, 2603, 2604], [792, 793, 1182], [2312], [2567], [10147], [10519], [193, 194, 942, 1358, 1359, 2432], [203, 204, 507, 1023, 1024, 2002], [355, 356, 816], [357, 358, 817], [533, 534, 1042], [803, 804, 1217, 1823, 1824, 2732], [948, 949, 1262], [988, 989, 1312], [1058, 1059, 1337], [1138, 1139, 1376], [1917], [1238, 1239, 2083], [1426, 1427, 2486], [1418, 1419, 2482], [1538, 1539, 2804], [1546, 1547, 2807], [1702], [1706], [1838, 1839], [1848, 1849], [2130], [2307], [2313], [2497], [2637], [2641], [10279], [10309], [390, 391, 2547], [468, 469, 712, 1328, 1329], [717, 2552], [728, 729, 1127], [883, 884, 1267], [1103, 1104, 1352, 2757], [1667], [1812], [1278, 1279, 2269], [1638, 1639, 2839], [2053, 2054], [2061, 2062], [2501], [10235], [598, 1367], [1721], [600, 601], [348, 349, 1048, 2799, 2800], [535, 536, 1043], [1170, 2045], [1280, 1281, 2261], [1450, 1451, 2741], [1458, 1459, 2745], [1475, 1476, 2763], [1675, 1676, 2263], [2383], [2386], [225, 226, 593, 1085, 1086, 2183], [1035, 1036, 1408], [1225, 1226, 1392], [1668], [1420, 1421, 2483], [1925, 1926], [1931, 1932], [2308], [2568], [2691], [10102], [865, 866, 1193], [1605, 1606, 2829], [1869], [2055, 2056], [2220, 2221], [2228, 2229], [2571], [2638], [10480], [215, 216, 643, 1384, 1385, 2822], [417, 418, 1068, 2605, 2606], [794, 795, 1183], [1548, 1549, 2810], [2688], [10278], [195, 196, 943, 1360, 1361, 2433], [205, 206, 508, 1025, 1026, 2003], [371, 372, 824], [373, 374, 825], [805, 806, 1218, 1825, 1826, 2733], [950, 951, 1263], [990, 991, 1313], [1060, 1061, 1338], [1140, 1141, 1377], [1918], [1240, 1241, 2084], [1428, 1429, 2487], [1540, 1541, 2808], [1707], [1840, 1841], [2131], [2135], [10171], [392, 393, 2548], [470, 471, 713, 1330, 1331], [718, 2553], [730, 731, 1128], [885, 886, 1268], [1105, 1106, 1353, 2758], [1813], [1248, 1249, 2088], [1640, 1641, 2840], [2498], [2502], [10137], [10481], [600, 1368], [1722], [1703], [2010, 2011], [2018, 2019], [10373], [602, 603], [1062, 1063, 1339], [1172, 2047], [1250, 1251, 2089], [1282, 1283, 2271], [1288, 1289, 2277], [1422, 1423, 2484], [1452, 1453, 2746], [1477, 1478, 2764], [1677, 1678, 2264], [1685, 1686, 2265], [2012, 2013], [2384], [10271], [10284], [217, 218, 644, 1386, 1387, 2823], [1037, 1038, 1409], [1542, 1543, 2809], [1648, 1649, 2844], [1870], [1927, 1928], [1933, 1934], [2569], [2689], [2692], [10455], [867, 868, 1194], [1669], [1460, 1461, 2742], [1607, 1608, 2830], [2063, 2064], [2222, 2223], [2230, 2231], [2642], [10170], [419, 420, 1069, 2607, 2608], [796, 797, 1184], [1227, 1228, 1393], [1642, 1643, 2841], [2309], [10047], [197, 198, 944, 1362, 1363, 2434], [207, 208, 509, 1027, 1028, 2004], [227, 228, 594, 1087, 1088, 2184], [363, 364, 820], [365, 366, 821], [367, 368, 822], [537, 538, 1044], [807, 808, 1219, 1827, 1828, 2734], [887, 888, 1269], [952, 953, 1264], [992, 993, 1314], [1142, 1143, 1378], [1242, 1243, 2085], [1550, 1551, 2805], [1704], [1708], [1842, 1843], [2132], [2136], [2499], [2503], [2572], [2639], [10100], [10119], [10489], [394, 395, 2549], [472, 473, 714, 1332, 1333], [719, 2554], [732, 733, 1129], [1107, 1108, 1354, 2759], [1814], [1485, 1486, 2769], [2057, 2058], [602, 1369], [1723], [10408], [604, 605], [1174, 2049], [1290, 1291, 2266], [1679, 1680, 2272], [2020, 2021], [2387], [2388], [2570], [10050], [10165], [10198], [1039, 1040, 1410], [1544, 1545, 2806], [1650, 1651, 2845], [1929, 1930], [1935, 1936], [2310], [10146], [10285], [229, 230, 595, 1089, 1090, 2185], [869, 870, 1195], [1479, 1480, 2765], [1609, 1610, 2831], [1615, 1616, 2834], [2224, 2225], [10416], [421, 422, 1070, 2609, 2610], [798, 799, 1185], [1229, 1230, 1394], [1644, 1645, 2842], [2690], [2693], [199, 200, 945, 1364, 1365, 2435], [209, 210, 510, 1029, 1030, 2005], [219, 220, 645, 1388, 1389, 2824], [359, 360, 818], [361, 362, 819], [369, 370, 823], [539, 540, 1045], [809, 810, 1220, 1829, 1830, 2735], [889, 890, 1270], [954, 955, 1265], [994, 995, 1315], [1064, 1065, 1340], [1144, 1145, 1379], [1430, 1431, 2488], [1424, 1425, 2485], [1705], [1844, 1845], [1850, 1851], [2133], [2385], [2640], [2643], [396, 397, 2550], [474, 475, 715, 1334, 1335], [720, 2555], [734, 735, 1130], [1109, 1110, 1355, 2760], [1670], [1815], [1244, 1245, 2086], [1284, 1285, 2262], [1454, 1455, 2743], [2059, 2060], [2065, 2066], [2500], [604, 1370], [1724], [2014, 2015], [2573], [10270], [10456]];
    var foundKeys = [], notFoundKeys = [];
    typeCountAll = {};
    typeCountHas = {};
    AM_card.map(subArray => subArray[subArray.length-1]).forEach(key => {
      if (cardData.hasOwnProperty(key)) {
        const type = cardData[key].attribute * 100 + cardData[key].race;
        // 判斷type是否已經存在，若不存在，初始化count為1，若存在，增加count
        if (typeCountAll[type] === undefined) typeCountAll[type] = 1;
        else typeCountAll[type]++;
      }
    });
    // 使用初版AM資料的篩選
    for (const key in cardData)
      if (hasCard(key)) 
        AM_card = AM_card.filter((subArray) => !subArray.includes(parseInt(key, 10)));
    setMatchingKeys(foundKeys);
    foundKeys.forEach(key => {
      if (cardData.hasOwnProperty(key)) {
        const type = cardData[key].attribute * 100 + cardData[key].race;
        if (typeCountHas[type] === undefined) typeCountHas[type] = 1;
        else typeCountHas[type]++;
      }
    });
    console.log(typeCountAll, typeCountHas);
    // 使用初版AM資料的篩選
    setNotMatchingKeys(AM_card.map(subArray => subArray[subArray.length-1]));
  };*/

  /*
  let resultKey = [];
  notMatchingKeys.forEach(key => {
    if (cardData.hasOwnProperty(key)) {
      let score = cardData[key].score;
      cardData[key].value.forEach(([cardId, value]) => {
        if (hasCard(cardId)) { // 檢查該使用者有無此卡片
          score += value;
        }
      });
      resultKey.push([key, score]);
    }
  });

  resultKey = resultKey
  .slice()
  .sort((a, b) => b[1] - a[1] || b[0] - a[0])  // [1]分數相同時，以[0]卡片ID決定順序
  .slice(0, displayCount);
  */
  const resultKey = useMemo(() => {
    return notMatchingKeys  // AM可選列表中，玩家未持有的卡
      .filter(cardId => cardId in cardData)  // 預防AM pool設定錯誤或資料有誤
      .map(cardId => {  // cardId -> [cardId, score]
        // 初始分數
        let score = cardData[cardId].score ?? 0;
        // 條件式分數變化
        cardData[cardId].value?.forEach(([conditionCardId, variation]) => {
          if(hasCard(conditionCardId)) {
            score += variation;
          }
        });
        return [cardId, score];
      })
      .sort((a, b) => b[1]-a[1] || b[0]-a[0])  // 以分數排序，同分時以卡片ID排序
      .slice(0, displayCount);  // 只顯示前displayCount個結果
  }, [notMatchingKeys, hasCard, displayCount]);

  const highestMaterialCandidate = useMemo(() => {
    const recordedAttributes = new Set();
    const result = [null, 0, 0, 0, 0, 0];
    AM_pool.some(cardId => {
      const data = cardData?.[cardId];
      if(data === undefined) return false;
      if(data.materialLevel2 && !recordedAttributes.has(data.attribute)) {
        result[data.attribute] = cardId;
        recordedAttributes.add(data.attribute);
      }
      return recordedAttributes.size >= 5;
    });
    return result.slice(1);
  }, []);

  const imgUrlAttr = (attribute) => {
    switch (attribute) {
      case 1:
        return 'water';
      case 2:
        return 'fire';
      case 3:
        return 'earth';
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
        return 'elf';
      case 4:
        return 'dragon';
      case 5:
        return 'god';
      case 8:
        return 'demon';
      case 10:
        return 'machina';
      default:
        return '';
    }
  };

  // 判定時間是距離現在超過30天
  // 2592000000 = 30*24*60*60*1000 (ms)
  const needTimeWarning = time => new Date().getTime() - new Date(time).getTime() > 2592000000;

  return (
    <div className="app-container">
      <div className="popup-container">
        <div id="imgCover">
          <img
            src={`https://hiteku.github.io/img/tos/tool/tosAllMax/cover.png`}
            alt="imgCover"
            style={{ maxWidth: '500px', width: '100%' }}
          />
        </div>
        <small style={{ textAlign: 'center', marginBottom: '13px' }}>
          評價者：微醺盜賊
          &nbsp;<a href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4096563" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.fly.dev/static/assets/logo/bahamut.png`}
              alt="imgBahamut"
              style={{ maxWidth: '15px', width: '100%', marginBottom: '-2px', borderRadius: '9%' }}
            />
          </a>
          &nbsp;<a href="https://www.youtube.com/@user-oq4nb1df7w" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.fly.dev/static/assets/logo/youtube.png`}
              alt="imgYoutube"
              style={{ maxWidth: '15px', width: '100%', marginBottom: '-2px', borderRadius: '9%' }}
            />
          </a>
          &nbsp;<a href="https://github.com/chaohanlin/tosAllMax" target="_blank" rel="noopener noreferrer">
            <img
              src={`https://hiteku.fly.dev/static/assets/logo/github.png`}
              alt="imgGithub"
              style={{ maxWidth: '15px', width: '100%', marginBottom: '-2px', borderRadius: '9%' }}
            />
          </a>
        </small>
        <label>
          UID<input type="text" value={uid} onChange={(e) => setUid(e.target.value)} />
          <button onClick={handleImport} disabled={loadingInventory}>匯入背包</button>
        </label>
        <details>
          <summary style={{fontSize: '14px', marginTop: '-14px', marginBottom: '4px'}}>資料太舊？</summary>
          <label>
            活動驗證碼<input type="text" value={auth} onChange={(e) => setAuth(e.target.value)} />
            <button onClick={handleUpdate} disabled={loadingInventory}>重新獲取</button>
          </label>
        </details>
        <div className="custom-select-container">
          {/* <div className="warning-text">
            <button onClick={handleResult}>更新列表</button>
            ⚠️數字僅供參考，必中為 ≤５。但若開過圖鑑後刪除，或擁有進化前的不在此考量，審慎選擇。
          </div> */}
          {((inventory !== undefined && !loadingInventory) && (
            <label>
              {inventory?._id}
              &nbsp;的背包最後更新於&nbsp;
              <output className={`inventory-info__update-time${needTimeWarning(inventory?.cardsUpdatedAt) ? "--warning" : ""}`}>{new Date(inventory?.cardsUpdatedAt).toLocaleString(undefined, { hour12: false })}</output>
            </label>
          )) || (loadingInventory && (
            <div className="loader-container">
              <div className="loader"></div>
              <label>正在讀取背包資料…</label>
            </div>
          )) || (
            <span>　</span>
          )}
          <select className="custom-select" value={displayCount} onChange={handleSelectChange}>
            <option value={15}>15</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={AM_total}>{AM_total}</option>
          </select>
        </div>
      </div>

      <div className="matching-keys-container">
      {notMatchingKeys.length > 0 && (
        <>
        {showCardInfo && (
          <CardInfo
            card={showCardInfo}
            cardInfoRef={cardInfoRef}
            style={{ top: cardInfoPosition.top, left: cardInfoPosition.left }}
          />
        )}
        <table>
          <tbody>
            {resultKey.map(([key, score]) => (
              <React.Fragment key={key}>
                <tr>
                  <td style={{ width: '77px' }} rowSpan="2">
                    <img
                      src={`https://web-assets.tosconfig.com/gallery/icons/${String(key).padStart(4, '0')}.jpg`}
                      alt={key}
                      style={{ width: iconWidth + 'px', borderRadius: '9%' }}
                      onClick={(event) => handleImageHover(event, key)}
                      onMouseEnter={(event) => handleImageHover(event, key)}
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
                  <td className="card-list--left-align card-list__score">{score === 0 ? '暫無評' : score}分</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    {key}
                    {/*(() => {
                      const type = cardData[key]?.attribute * 100 + cardData[key]?.race;
                      const result = typeCountAll[type] - typeCountHas[type];
                      return isNaN(result) ? typeCountAll[type] : result;
                    })()*/}
                  </td>
                  <td rowSpan="2" className="card-list--left-align card-list__reason">
                    {/*
                      在reason中讓markdown換行的格式：兩個空白後面加上\n
                      粗體字的格式：**粗體字**
                    */}
                    <Markdown>{cardData[key]?.reason}</Markdown>
                  </td>
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
      {(notMatchingKeys.length === 0 && inventory !== undefined) && (
        <table>
          <tbody>
            <tr>
              <td className="card-list--left-align">
                <div className="rainbow-title">
                  你已經持有所有 All Max 可選的卡片！
                </div>
                請隨喜好選擇想複製的卡片。<br />
                本次 All Max 自選機會將於 {new Date(1716134340000).toLocaleDateString()} 到期。
              </td>
            </tr>
            <tr>
              <td className="card-list--left-align">
                90精魄候選：
                {highestMaterialCandidate.map((id, index) => (
                  <React.Fragment key={index}>
                    <img
                      src={`https://web-assets.tosconfig.com/gallery/icons/${String(id).padStart(4, '0')}.jpg`}
                      alt={`icon_${id}`}
                      style={{ width: iconWidth + 'px', borderRadius: '9%' }}
                    />
                    {index !== highestMaterialCandidate.length - 1 && ' '}
                  </React.Fragment>
                ))}
                <br />
              </td>
            </tr>
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

const AppWithCheckup = () => {
  return (
    <Provider>
      <App />
      <ScrollToTopButton></ScrollToTopButton>
    </Provider>
  );
};

const ScrollToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const buttonStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    borderRadius: '50%',
    background: '#222',
    color: '#fff',
    width: '50px',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    opacity: showButton ? '1' : '0',
    transition: 'opacity 0.3s ease-in-out'
  };

  return (
    <div style={buttonStyles} onClick={scrollToTop} >
      <i className="fa-solid fa-angle-up"></i>
    </div>
  );
};

export default AppWithCheckup;
