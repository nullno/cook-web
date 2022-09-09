export default (page, cssStr) => {
  return `
  /*
   *@File css ${page.id}
   *@Date ${Date()}
   */
  ${cssStr}
  `
}
