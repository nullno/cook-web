import STATE from '@/db/state';

export default {
  tableName: 'dom_sate',
  fixedId: 'cooker',
  myStore() {
    return new Promise((resolve, reject) => {
      STATE.MyDB.query_by_primaryKey({
        tableName: this.tableName,
        target: this.fixedId,
        success: (res) => {
          res && (res.dom_tree = JSON.parse(res.dom_tree));
          resolve(res)
        },
        failed(err) {
          reject(null)
        }
      })
    })
  },
  setStore() {
    return new Promise((resolve, reject) => {
      STATE.MyDB.insert({
        tableName: this.tableName,
        data: {
          id: this.fixedId,
          page_use: STATE.PAGE_USE,
          dom_tree: JSON.stringify(STATE.DOM_DATA)
        },
        success: (res) => {
          resolve(true)
        },
        failed(err) {
          reject(false)
        }
      })
    });
  },
  updateStore() {
    return new Promise((resolve, reject) => {
      STATE.MyDB.update_by_primaryKey({
        tableName: this.tableName,
        target: this.fixedId,
        handle(val) {
          val.page_use = STATE.PAGE_USE
          val.dom_tree = JSON.stringify(STATE.DOM_DATA);
        },
        success: res => {
          resolve(res);
        }
      });
    });
  },

}
