const { minify } = require('html-minifier')
const fs = require('fs')
const path = require('path')

const originalHtml = fs.readFileSync(path.resolve(__dirname, 'creator.html'), 'utf8')
const minifiedHtml = minify(originalHtml, {
    collapseWhitespace: true,
    removeComments: true,
    collapseBooleanAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeOptionalTags: true,
    minifyJS: true
})

console.log('minifiedHtml', minifiedHtml)
fs.writeFileSync('creator.min.html', minifiedHtml);
