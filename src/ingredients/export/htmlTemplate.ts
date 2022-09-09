export default (page, htmlStr) => {
  return `
  <!--
  @File html ${page.id}
  @Date ${Date()}
  -->
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta http-equiv="x-ua-compatible" content="ie=edge,chrome=1" />
      <meta name="viewport" content="width=device-width" />
      <link href="./css/normalize.css" rel="stylesheet" />
      <link href="./css/${page.id}.css" rel="stylesheet" />
      <title>${page.title}</title>
    </head>
    <body>
      <div id="cook-container">
       ${htmlStr}
      </div>
      <script src="./js/${page.id}.js"></script>
    </body>
  </html>
  `
}
