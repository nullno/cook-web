export default (page, jsStr) => {
  return `
  /*
   *@File js ${page.id}
   *@Date ${Date()}
   *@Plugins []
   */
  ${jsStr}
  `
}
