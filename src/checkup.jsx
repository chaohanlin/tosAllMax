import { useState, useRef, useMemo, useCallback, createContext, useContext } from 'react';
import axios from 'axios';
import cardData from "./data/cardData";

const [uid, auth] = ["1026888446", "139126"];

async function getToken(uid, auth) {
  return await axios.post('https://website-api.tosgame.com/api/checkup/login', null, {
    params: {uid, auth}
  })
  .then(res => res.data?.token)
  .catch(err => {
    console.error(err?.message);
    throw err;
  });
}

async function getCommonToken() {
  return await getToken(uid, auth);
}

async function getInventory(token, targetUid) {
  return await axios.get('https://website-api.tosgame.com/api/checkup/getUserProfile', {
    params: {token, targetUid}
  })
  .then(res => res.data?.userData)
  .catch(err => {
    console.error(err?.message);
    throw err;
  });
}

const CheckupContext = createContext({});

const Provider = ({children}) => {
  const commonToken = useRef(undefined);
  const [inventory, setInventory] = useState(undefined);
  const reducedInventory = useMemo(() => {
    const entries = {};
    inventory?.cards.forEach(card => {
      if(card.id in entries) {
        const existing = entries[card.id];
        if(existing.lv > card.level) return;
        if(existing.slv > card.skillLevel) return;
        if(existing.enhance > card.enhanceLevel) return;
      }
      entries[card.id] = {
        lv: card.level,
        slv: card.skillLevel,
        enhance: card.enhanceLevel
      };
    });
    return entries;
  }, [inventory]);
  const inventorySet = useMemo(() => {
    return new Set(inventory?.cards.map(card => card.id));
  }, [inventory]);

  const queryInventory = async targetUid => {
    if(commonToken.current === undefined) {
      commonToken.current = await getCommonToken();
    }
    setInventory(await getInventory(commonToken.current, targetUid));
  }
  const updateInventory = async (targetUid, targetAuth) => {
    const token = await getToken(targetUid, targetAuth);
    setInventory(await getInventory(token, targetUid));
  }

  const hasCard = useCallback(id => {
    // type of id may be string
    if(id in cardData) {
      return inventorySet.has(parseInt(id)) || cardData[id].equivalences.some(eqId => inventorySet.has(eqId));
    }
    return false;
  }, [inventorySet]);

  return (
    <CheckupContext.Provider
      value={{
        queryInventory,
        updateInventory,
        inventory,
        reducedInventory,
        hasCard
      }}
    >
      {children}
    </CheckupContext.Provider>
  );
}

const useCheckup = () => useContext(CheckupContext);

export default Provider;
export { useCheckup };
