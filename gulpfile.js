var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin');
//JS压缩
gulp.task('uglify', function() {
    return gulp.src('././public/js/src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('././public/js/src/'));
});
//public-fancybox-js压缩
gulp.task('fancybox:js', function() {
    return gulp.src('././public/vendors/fancybox/source/jquery.fancybox.js')
        .pipe(uglify())
        .pipe(gulp.dest('././public/vendors/fancybox/source/'));
});
//public-fancybox-css压缩
gulp.task('fancybox:css', function() {
    return gulp.src('././public/vendors/fancybox/source/jquery.fancybox.css')
        .pipe(cssmin())
        .pipe(gulp.dest('././public/vendors/fancybox/source/'));
});
//public-fancyboxhelper-css压缩
gulp.task('fancyboxhelpers:css', function() {
    return gulp.src('././public/vendors/fancybox/source/helpers/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('././public/vendors/fancybox/source/helpers/'));
});
//public-fancyboxhelper-js压缩
gulp.task('fancyboxhelpers:js', function() {
    return gulp.src('././public/vendors/fancybox/source/helpers/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('././public/vendors/fancybox/source/helpers/'));
});
// jq_lazyload
gulp.task('lazyload:js', function() {
	return gulp.src('././public/vendors/jquery_lazyload/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('././public/vendors/jquery_lazyload/'))
})
//CSS压缩
gulp.task('cssmin', function() {
    return gulp.src('././public/css/main.css')
        .pipe(cssmin())
        .pipe(gulp.dest('././public/css/'));
});
//图片压缩
gulp.task('images', function() {
    gulp.src('././public/img.*')
        .pipe(imagemin({
            progressive: false
        }))
        .pipe(gulp.dest('././public/img/'));
});
gulp.task('build', ['uglify', 'cssmin', 'images', 'fancybox:js', 'fancybox:css', 'fancyboxhelpers:js', 'fancyboxhelpers:css', 'lazyload:js']);