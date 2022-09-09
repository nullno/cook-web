/*
 * @Author: weijundong wx_dda6ed3e7d4049b18953aab41af2bcd1@git.code.tencent.com
 * @Date: 2022-05-20 10:05:32
 * @LastEditors: weijundong wx_dda6ed3e7d4049b18953aab41af2bcd1@git.code.tencent.com
 * @LastEditTime: 2022-05-26 15:47:31
 * @FilePath: \ty-cooking\src\utils\idb.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState, useEffect } from 'react';
const dbp = new Promise((resolve, reject) => {
  const openreq = window.indexedDB.open('use-idb', 1);
  openreq.onerror = () => reject(openreq.error);
  openreq.onsuccess = () => resolve(openreq.result);
  openreq.onupgradeneeded = () => openreq.result.createObjectStore('idb');
});

const call = async (type, method, ...args) => {
  const db = await dbp;
  const transaction = db.transaction('idb', type);
  const store = transaction.objectStore('idb');

  return new Promise((resolve, reject) => {
    const req = store[method](...args);
    transaction.oncomplete = () => resolve(req);
    transaction.onabort = transaction.onerror = () => reject(transaction.error);
  });
};

const get = async (key) => (await call('readonly', 'get', key)).result;
const set = (key, value) =>
  value === undefined ? call('readwrite', 'delete', key) : call('readwrite', 'put', value, key);
const useIdb = (key, initialState) => {
  const [item, setItem] = useState(initialState);
  useEffect(() => {
    get(key).then((value) => value === undefined || setItem(value));
  }, [key]);

  return [
    item,
    (value) => {
      setItem(value);
      return set(key, value);
    },
  ];
};
export default useIdb;
