var gulp = require("gulp")
var gulpWebpack = require("gulp-webpack")
var ts = require("gulp-typescript")
var tsProject = ts.createProject("tsconfig.json")
var webpack = require("webpack")
var zip = require('gulp-zip');
var runSeq = require('run-sequence');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var clean = require('gulp-clean');
gulp.task('compileTsFile', () => {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist'));
})
gulp.task('copyXML', function () {
    return gulp.src(['./src/kanbanWidget.xml', './src/package.xml', './src/kanbanWidgetOffline.xml'])
        .pipe(gulp.dest('./dist/zip'))
})
gulp.task('cleanDist', () => {
    return gulp.src('./dist')
        .pipe(clean())
})
gulp.task('bundleCSS', () => {
    gulp.src('./src/components/views/css/kanbanWidget')
        .pipe(gulpWebpack({
            plugins: [
                new ExtractTextPlugin("./dist/zip/com/mendix/widget/custom/kanban/ui/kanban.css"),
            ],
            entry: "./src/components/views/css/kanbanWidget",
            output: {
                filename: "./dist/zip/com/mendix/widget/custom/kanban/ui/kanban.css"
            },
            module: {
                loaders: [{
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "css-loader",
                            options: { url: false }
                        }]
                    }),
                }]
            }
        }, webpack))
        .pipe(gulp.dest("./"))
})
gulp.task('bundleJsToDev', () =>
    gulp.src("./dist/kanbanWidget.js")
        .pipe(gulpWebpack({
            output: {
                filename: "./dist/zip/com/mendix/widget/custom/kanban/kanbanWidget.js",
                libraryTarget: "umd"
            },
            entry: "./dist/kanbanWidget.js",
            externals: ["react", "react-dom"]
        }, webpack))
        .pipe(gulp.dest("./"))
)
gulp.task('bundleJsToDevOffline', () =>
    gulp.src("./dist/kanbanWidget.js")
        .pipe(gulpWebpack({
            output: {
                filename: "./dist/zip/com/mendix/widget/custom/kanban/kanbanWidgetOffline.js",
                libraryTarget: "umd"
            },
            entry: "./dist/kanbanWidget.js",
            externals: ["react", "react-dom"]
        }, webpack))
        .pipe(gulp.dest("./"))
)
gulp.task('bundleJsToProduction', () =>
    gulp.src("./dist/kanbanWidget.js")
        .pipe(gulpWebpack({
            output: {
                filename: "./dist/zip/com/mendix/widget/custom/kanban/kanbanWidget.js",
                libraryTarget: "umd"
            },
            entry: "./dist/kanbanWidget.js",
            // devtool: "source-map",
            externals: ["react", "react-dom"]
        }, webpack))
        .pipe(gulp.dest("./"))
)
gulp.task('copyCSS', () => {
    gulp.src('./src/components/views/css/kanbanWidget.css')
        .pipe(gulp.dest("./dist/zip/com/mendix/widget/custom/kanban/ui"))
    gulp.src('./src/components/views/css/kanbanWidgetOffline.css')
        .pipe(gulp.dest("./dist/zip/com/mendix/widget/custom/kanban/ui"))
})
gulp.task('zipTung', () => {
    gulp.src('./dist/zip/**/*')
        .pipe(zip('kanbanWidget.mpk'))
        .pipe(gulp.dest("../TODO List-main/widgets"))
})
gulp.task('zipHa', () => {
    gulp.src('./dist/zip/**/*')
        .pipe(zip('kanbanWidget.mpk'))
        .pipe(gulp.dest("C:/Users/Ha Bui/Documents/Mendix/TODO List-main_2/widgets"))
})
gulp.task('zip', () => {
    gulp.src("D:/Code/Projects/Hello/src//**/*")
        .pipe(zip('HelloWorld.mpk'))
        .pipe(gulp.dest("C:/Users/Ha Bui/Documents/Mendix/App-main_2/widgets"))
})
gulp.task('default', (callback) => {
    runSeq(['cleanDist'], ['compileTsFile', 'copyXML', 'copyCSS'], ['bundleJsToDev', 'bundleJsToDevOffline'], ['zipHa'], callback)
})
gulp.task('production', (callback) => {
    runSeq(['cleanDist'], ['compileTsFile', 'copyXML', 'copyCSS'], ['bundleJsToProduction'], ['zipHa'], callback)
})
