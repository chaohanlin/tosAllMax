## 前置需求

- [Node.js](https://nodejs.org/en)

## 環境設定

```sh
npm i
```

## 執行測試

```sh
npm run dev
```

- 按指示連線到[localhost:5173](http://localhost:5173/tosAllMax/)

## 發布網站

```sh
npm run deploy
```

## 資料編輯

### 封面、製作人員名單

- 檔案位置：`src/App.jsx`
- 在函數`App`的回傳值編輯

### 可選卡片內容

- 檔案位置：`src/poolData.js`
- 常數名稱：`AM_pool`
- 資料型態：`number[]`
- 註記：
  - 參考現在的寫法，把往年的資料留下來

### 可以壓龍刻的卡

- 檔案位置：`src/poolData.js`
- 常數名稱：`craftMaterialCandidate`
- 資料型態：`number[]`

### 抓背包用的帳號

- 檔案位置：`src/checkup.jsx`
- 常數名稱：`uid`、`auth`
- 資料型態：`string`

### 卡片資料

- 檔案位置：`src/data/generated/cardData.json`
- 警語：由`src/data/generated/parse.js`自動生成，請勿編輯

### 卡片評分、評語

- 檔案位置：`src/data/rate.json`
- 總之照著現在的格式去寫
  - `score`：基本分數
  - `reason`：評分，字串內是markdown格式
    - 換行是兩個空白
    - `**blah**`可以當強調格式用
  - `value`：受其他卡片影響的分數
