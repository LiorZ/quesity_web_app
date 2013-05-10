({
   appDir: ".",
   baseUrl: "./",
   dir: "dist",
   modules: [
        {
            name: './node_modules/almond/almond',
            include:'app',
        }
    ],
    paths: {
       // libraries path
      "jade": "empty:"
//      "jquery": "lib/jquery",
//      "underscore": "lib/underscore",
//      "bootstrap": "lib/bootstrap",
//      "backbone": "lib/backbone",
//      "hogan": "lib/hogan",
//
//       // require plugins
//      "css": "lib/css",
//      "hgn": "lib/hgn",
//      "text": "lib/text"
   }
})