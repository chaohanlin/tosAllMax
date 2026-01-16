import React, { useState, useRef, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import Provider, { useCheckup } from "./checkup";
import cardData from "./data/cardData";
import { AM_pool, AM_total, craftMaterialCandidate } from "./data/poolData";
import { getCardIconUrl } from "./util";
import "./App.css";

const iconWidth = 60;

if(process.env.NODE_ENV !== "production") {
  // 只在開發過程中顯示
  console.log("AM可選總數：", AM_total);
}
// var typeCountAll = {}, typeCountHas = {};

function CardInfo({ card, cardInfoRef, style }) {
  const {hasCard, inventory} = useCheckup();
  return (
    <div className="card-info" ref={cardInfoRef} style={style}>
      <strong>{inventory === undefined && "匯入背包後，將"}因以下卡片而改變分數</strong><hr/>
      {(cardData[card]?.value ?? []).map(([value, quantity], i) => (
        <span className="float-score__card" key={value}>
          <img
            src={getCardIconUrl(value)}
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
  const [uid, setUid] = useState("");
  const [auth, setAuth] = useState("");
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
    window.addEventListener("click", handleCardInfoClick);
    return () => {
      window.removeEventListener("click", handleCardInfoClick);
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
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert("請輸入正確的UID格式")
    else {
      try {
        setLoadingInventory(true);
        await queryInventory(uid);
        // notMatchingKeys.length = 0;
        // setImportFail(false);
        window.alert("匯入成功！")
      } catch (error) {
        // setImportFail(true);
        window.alert("更新失敗。請確認輸入是否正確，且已於神魔健檢中心公開背包。")
      }
      setLoadingInventory(false);
    }
  };

  const handleUpdate = async () => {
    if (!uid.match(/^[1-9]\d{6,9}$/)) window.alert("請輸入正確的UID格式")
    else if (!auth.match(/^\d{6}$/)) window.alert("請輸入正確的驗證碼")
    else {
      try {
        setLoadingInventory(true);
        await updateInventory(uid, auth);
        window.alert("更新成功！")
      } catch (error) {
        window.alert("更新失敗。請確認輸入是否正確，且已於神魔健檢中心公開背包。")
      }
      setLoadingInventory(false);
    }
  };

  const handleSelectChange = (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    setDisplayCount(selectedValue);
  };

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
        return "water";
      case 2:
        return "fire";
      case 3:
        return "earth";
      case 4:
        return "light";
      case 5:
        return "dark";
      default:
        return "";
    }
  };

  const imgUrlRace = (race) => {
    switch (race) {
      case 1:
        return "human";
      case 2:
        return "beast";
      case 3:
        return "elf";
      case 4:
        return "dragon";
      case 5:
        return "god";
      case 8:
        return "demon";
      case 10:
        return "machina";
      default:
        return "";
    }
  };

  // 判定時間是距離現在超過30天
  // 2592000000 = 30*24*60*60*1000 (ms)
  const needTimeWarning = time => new Date().getTime() - new Date(time).getTime() > 2592000000;

  return (
    <div className="app-container">
      <div className="popup-container">
        <div id="imgCover">
          {<img
            src={`https://files.catbox.moe/wzhcd4.png`}
            alt="imgCover"
            style={{ maxWidth: "500px", width: "100%" }}
          />}
        </div>
        <div className="notice-title">
          {/*<h1>⚠️ 這是2025年的資料 ⚠️</h1>*/}
        </div>
        <div className="credits">
          <span className="credit-section">
            原作者：微醺盜賊
            <a className="icon-link" href="https://www.youtube.com/@%E5%BE%AE%E9%86%BA%E7%9B%9C%E8%B3%8A" target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hiteku.vercel.app/static/assets/icon/youtube.png`}
                alt="YouTube"
              />
            </a>
            <a className="icon-link" href="https://github.com/chaohanlin/tosAllMax" target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hiteku.vercel.app/static/assets/icon/github.png`}
                alt="GitHub"
              />
            </a>
          </span>
          <span className="credit-section">
            評價者：TW2417
            <a className="icon-link" href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4096563" target="_blank" rel="noopener noreferrer">
              <img
                src={`https://hiteku.vercel.app/static/assets/icon/bahamut.png`}
                alt="Bahamut"
              />
            </a>
            <a className="icon-link" href="https://discord.gg/KmJ69xNysj" target="_blank" rel="noopener noreferrer">
              <img
                src={`https://files.catbox.moe/y49j4t.png`}
                alt="Discord"
              />
            </a>
            </span>
          <span className="credit-section">協作：Hiteku、璇</span>
        </div>
        <label>
          UID<input type="text" value={uid} onChange={(e) => setUid(e.target.value)} />
          <button onClick={handleImport} disabled={loadingInventory}>匯入背包</button>
        </label>
        <details>
          <summary style={{fontSize: "14px", marginTop: "-14px", marginBottom: "4px"}}>資料太舊？</summary>
          <div className="details-content">
            <label>
              活動驗證碼<input type="text" value={auth} onChange={(e) => setAuth(e.target.value)} />
              <button onClick={handleUpdate} disabled={loadingInventory}>重新獲取</button>
            </label>
            <div className="auth-id-alternative-tip">你也可以自行前往<a href="https://checkup.tosgame.com/" target="_blank" rel="noopener noreferrer">神魔健檢中心</a>，只要登入即可刷新背包資料。</div>
          </div>
        </details>
        <div className="custom-select-container">
          {((inventory !== undefined && !loadingInventory) && (
            <div>
              {inventory?._id}
              &nbsp;的背包最後更新於&nbsp;
              <output className={`inventory-info__update-time${needTimeWarning(inventory?.cardsUpdatedAt) ? "--warning" : ""}`}>{new Date(inventory?.cardsUpdatedAt).toLocaleString(undefined, { hour12: false })}</output>
            </div>
          )) || (loadingInventory && (
            <div className="loader-container">
              <div className="loader"></div>
              <label>正在讀取背包資料…</label>
            </div>
          )) || (
            <div className="warning-text">{⚠️目前分數、評價還是2025年版，請謹慎使用。}</div>
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
                  <td style={{ width: "77px" }} rowSpan="2">
                    <img
                      src={getCardIconUrl(key)}
                      alt={key}
                      style={{ width: iconWidth + "px", borderRadius: "9%" }}
                      onClick={(event) => handleImageHover(event, key)}
                      onMouseEnter={(event) => handleImageHover(event, key)}
                    />
                  </td>
                  <td style={{ width: "13px" }}>
                    <img
                      src={`https://hiteku.github.io/img/tos/-/${imgUrlAttr(cardData[key]?.attribute)}.png`}
                      alt={`Attr-${cardData[key]?.attribute}`}
                      style={{ width: "25px" }}
                    />
                  </td>
                  <td style={{ width: "13px" }}>
                    <img
                      src={`https://hiteku.github.io/img/tos/-/${imgUrlRace(cardData[key]?.race)}.png`}
                      alt={`Race-${cardData[key]?.race}`}
                      style={{ width: "25px" }}
                    />
                  </td>
                  <td className="card-list--left-align card-list__score">{score === 0 ? "暫無評" : score}分</td>
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
              src={getCardIconUrl(key)}
              alt={key}
              style={{ width: "60px", borderRadius: "9%", opacity: 0.3 }}
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
                      src={getCardIconUrl(id)}
                      alt={`icon_${id}`}
                      style={{ width: `${iconWidth}px`, borderRadius: "9%" }}
                    />
                    {index !== highestMaterialCandidate.length - 1 && " "}
                  </React.Fragment>
                ))}
                <br />
              </td>
            </tr>
            <tr>
              <td className="card-list--left-align">
                武裝原料候選：
                {craftMaterialCandidate.map((id, index) => (
                  <React.Fragment key={index}>
                    <img
                      src={getCardIconUrl(id)}
                      alt={`icon_${id}`}
                      style={{ width: `${iconWidth}px`, borderRadius: "9%" }}
                    />
                    {index !== highestMaterialCandidate.length - 1 && " "}
                  </React.Fragment>
                ))}
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
      <ScrollToTopButton />
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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const buttonStyles = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    borderRadius: "50%",
    background: "#222",
    color: "#fff",
    width: "50px",
    height: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    opacity: showButton ? "1" : "0",
    transition: "opacity 0.3s ease-in-out"
  };

  return (
    <div style={buttonStyles} onClick={scrollToTop} >
      <i className="fa-solid fa-angle-up"></i>
    </div>
  );
};

export default AppWithCheckup;
