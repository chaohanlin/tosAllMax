// 檢視「擁有所有卡片」視角的畫面
const HAS_ALL = false;


/* *************************************************************************** */


// export敘述
// 總之不需要碰
export const DEBUG_FLAG = (process.env.NODE_ENV !== "production");
export const DEBUG_HAS_ALL = DEBUG_FLAG && HAS_ALL;
