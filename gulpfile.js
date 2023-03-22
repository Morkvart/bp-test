const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
// const del = require('del');
// const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
// const uglify = require('gulp-uglify-es').default;
const compressImages = require('compress-images');

function synhronize() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}

function watching() {
    watch(['app/**/*.html'], htmlProcessing);
    watch(['app/css/**/styledev.css'], styleProcessing);
    // watch(['src/js/**/*.js','!app/js/**/*.min.js'], jsProcessing);
    watch(['app/js/**/*.js'], jsProcessing);
    watch(['app/src-img/**/*'], imagesProcessing);
}

function htmlProcessing() {
    return src('app/*.html')
        .pipe(browserSync.stream())
}

function styleProcessing() {
    return src('app/css/styledev.css')
        // .pipe(sass({
        //     outputStyle: 'expanded'
        // }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid: true
        }))
        .pipe(rename('style.css'))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream())
}

function jsProcessing() {
    return src('app/js/**/*.js')
        .pipe(browserSync.stream())
}

async function imagesProcessing() {
    compressImages(
        "app/src-img/**/*",
        "app/images/",
        { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "75"] } },
        { png: { engine: "pngquant", command: ["--quality=75-100", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (err, completed) {
            if (err !== null) {
                compressImages(
                    "app/src-img/**/*",
                    "app/images/",
                    { compress_force: false, statistic: true, autoupdate: true }, false,
                    { jpg: { engine: "mozjpeg", command: false } },
                    { png: { engine: "pngquant", command: false } },
                    { svg: { engine: "svgo", command: false } },
                    { gif: { engine: "gifsicle", command: false } },
                    function (err, completed) { })
            }
        }
    )
}

// function cleanImages() {
//     return del('app/images/');
// }

// function createBuild() {
//     return src([
//         'app/css/**/*.css',
//         'app/scss/**/*.scss',
//         // 'app/js/**/*.min.js',
//         'app/js/**/*.js',
//         'app/fonts/**/*',
//         'app/images/**/*',
//         'app/**/*.html',
//     ], { base: 'app' })
//         .pipe(dest('build'))
// }

// function clearDirectory() {
//     return del('build/')
// }

exports.sync = synhronize;
exports.watch = watching;

exports.html = htmlProcessing;
exports.style = styleProcessing;
// exports.images = series(cleanImages, imagesProcessing);
exports.images = series(imagesProcessing);
exports.js = jsProcessing;

exports.default = parallel(
    htmlProcessing,
    styleProcessing,
    imagesProcessing,
    jsProcessing,
    synhronize,
    watching
);


// exports.clear = clearDirectory;
// exports.build = series(clearDirectory, createBuild)

