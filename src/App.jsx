import React, { useState, useRef, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import { IconBrandDiscord, IconBrandGithub, IconBrandYoutube, IconHelpSquareRounded } from "@tabler/icons-react";

import Provider, { useCheckup } from "./checkup";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { CardInfo } from "./components/CardInfo";
import { getCardIconUrl, getAttrIconUrl, getRaceIconUrl } from "./iconutil";
import { needTimeWarning } from "./util";

import cardData from "./data/cardData";
import { AM_pool, AM_total, AM_due_time, craftMaterialCandidate } from "./data/poolData";
import { DEBUG_FLAG, DEBUG_HAS_ALL } from "./debug";

import bannerImg from "./assets/banner.png";
import "./App.css";

const iconWidth = 60;

if(DEBUG_FLAG) {
  // 只在開發過程中顯示
  console.log("AM可選總數：", AM_total);
  console.log("自選截止時間：", new Date(AM_due_time * 1000).toLocaleString());
}

const App = () => {
  const { queryInventory, updateInventory, hasCard, inventory } = useCheckup();
  const [loadingInventory, setLoadingInventory] = useState(false);
  const notMatchingKeys = useMemo(() => AM_pool.filter(key => !hasCard(key)), [hasCard]);
  const [uid, setUid] = useState("");
  const [auth, setAuth] = useState("");
  const [displayCount, setDisplayCount] = useState(15);
  const [showCardInfo, setShowCardInfo] = useState(null);
  const [cardInfoPosition, setCardInfoPosition] = useState({ top: 0, left: 0 });
  const cardInfoRef = useRef(null);

  useEffect(() => {
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
        window.alert("匯入成功！")
      } catch (error) {
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

  return (
    <div className="app-container">
      <div className="popup-container">
        <div id="imgCover">
          {<img
            src={bannerImg}
            alt="imgCover"
            style={{ maxWidth: "500px", width: "100%" }}
          />}
        </div>
        <div className="notice-title">
          {/*<h1>⚠️ 這是2025年的資料 ⚠️</h1>*/}
        </div>
        <div className="credits">
          <div className="credit-section">
            <a className="icon-link" title="說明" href="https://forum.gamer.com.tw/Co.php?bsn=23805&sn=4096563" target="_blank" rel="noopener noreferrer">
              <IconHelpSquareRounded size="1.25em" />
            </a>
            <a className="icon-link" title="原始碼" href="https://github.com/chaohanlin/tosAllMax" target="_blank" rel="noopener noreferrer">
              <IconBrandGithub size="1.25em" />
            </a>
          </div>
          <div className="credit-section">
            原作者：微醺盜賊
            <a className="icon-link" href="https://www.youtube.com/@%E5%BE%AE%E9%86%BA%E7%9B%9C%E8%B3%8A" target="_blank" rel="noopener noreferrer">
              <IconBrandYoutube size="1.25em" />
            </a>
          </div>
          <div className="credit-section">
            評價者：TW2417
            <a className="icon-link" href="https://discord.gg/KmJ69xNysj" target="_blank" rel="noopener noreferrer">
              <IconBrandDiscord size="1.25em" />
            </a>
            </div>
          <div className="credit-section">協作：Hiteku、璇</div>
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
            /*<div className="warning-text">⚠️目前分數、評價還是2025年版，請謹慎使用。</div>*/
            <div />
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
      {notMatchingKeys.length > 0 && !DEBUG_HAS_ALL && (
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
                      src={getAttrIconUrl(cardData[key]?.attribute)}
                      alt={`Attr-${cardData[key]?.attribute}`}
                      style={{ width: "25px" }}
                    />
                  </td>
                  <td style={{ width: "13px" }}>
                    <img
                      src={getRaceIconUrl(cardData[key]?.race)}
                      alt={`Race-${cardData[key]?.race}`}
                      style={{ width: "25px" }}
                    />
                  </td>
                  <td className="card-list--left-align card-list__score">{score === 0 ? "暫無評" : score}分</td>
                </tr>
                <tr>
                  <td colSpan="2">
                    {key}
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
        </>
      )}
      {(DEBUG_HAS_ALL || notMatchingKeys.length === 0 && inventory !== undefined) && (
        <table>
          <tbody>
            <tr>
              <td className="card-list--left-align">
                <div className="rainbow-title">
                  你已經持有所有 All Max 可選的卡片！
                </div>
                請隨喜好選擇想複製的卡片。<br />
                本次 All Max 自選機會將於 {new Date(AM_due_time * 1000).toLocaleDateString()} 到期。
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

const WrappedApp = () => {
  return (
    <Provider>
      <App />
      <ScrollToTopButton />
    </Provider>
  );
};

export default WrappedApp;
