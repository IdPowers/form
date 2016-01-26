var gulp = require('gulp'),
    watch = require('gulp-watch'),
    stylus = require('gulp-stylus'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    mainBowerFiles = require('gulp-main-bower-files'),
    fs = require('fs'),
    csso = require('gulp-csso');

gulp.task('stylus', function() {
    var appName= process.argv[4];
    var appFile = JSON.parse(fs.readFileSync('./apps/' + appName +'.json'));
    var getFileNames = require('html2bl').getFileNames(appFile);
    getFileNames.then(function(files) {
        var stylus_files = [];
        var path = '/';
        if (files.dirs[files.dirs.length - 1].search(/\\/) !== -1) {
            path = '\\';
        }
        for (var i = 0; i < files.dirs.length; i++) {
            stylus_files[i] = files.dirs[i] + path + '*.styl';
        }
        if (files.addBlocks) {
            for (var j = 0; j < files.addBlocks.length; j++) {
                stylus_files.push(files.addBlocks[j]);
            }
        }
        stylus_files.push('fonts/**/*.styl');
        gulp.src(stylus_files)
            .pipe(stylus({
                paths: ['./mixins/'],
                import: ['mixins.styl'],
                compress: true,
                'inline css': true,
                url: 'embedurl'
            }))
            .pipe(autoprefixer({
                browsers: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie 10', 'ie 9', 'ie 8']
            }))
            .pipe(csso())
            .pipe(concat(files.out + '.css'))
            .pipe(gulp.dest(files.outSrc));
        });
});

gulp.task('watch', function () {
    gulp.watch('blocks/**/*.styl', ['stylus']);
    gulp.watch('bower_components/**/*', ['main-bower-files']);
});

gulp.task('svgo', function () {
    return gulp.src('./icons/img/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('../apps/common/static/img/'))
});

gulp.task('copy_fonts', function () {
    return gulp.src('./fonts/**/*.{eot,svg,ttf,woff,woff2}')
        .pipe(copy('../apps/common/static/'));
});

gulp.task('main-bower-files', function () {
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                "jquery.inputmask": {
                    main: [
                        'dist/min/jquery.inputmask.bundle.min.js'
                    ]
                },
                "mdl-jquery-modal-dialog": {
                    main: [
                        'mdl-jquery-modal-dialog.css',
                        'mdl-jquery-modal-dialog.js'
                    ]
                },
                "font-awesome": {
                    main: [
                        'css/font-awesome.min.css',
                        'fonts/*'
                    ]
                }
            }
        }))
        .pipe(gulp.dest('../applications/companies/static/vendor/'));
});