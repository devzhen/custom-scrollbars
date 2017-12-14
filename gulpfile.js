var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');

gulp.task('concat', function () {
    return gulp.src([
        'src/js/rails/rail.js',
        'src/js/rails/x-rail.js',
        'src/js/rails/y-rail.js',
        'src/js/scrollbars/custom-scrollbar.js',
        'src/js/scrollbars/custom-scrollbar-base.js',
        'src/js/scrollbars/custom-scrollbar-document.js',
        'src/js/scrollbars/custom-scrollbar-element.js',
        'src/js/sliders/slider.js',
        'src/js/sliders/x-slider.js',
        'src/js/sliders/y-slider.js'
    ])
        .pipe(concat('dg-custom-scrollbars.js'))
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('minify', function () {
    gulp.src('./dist/js/dg-custom-scrollbars.js')
        .pipe(uglify())
        .pipe(rename("dg-custom-scrollbars.min.js"))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', function () {
    return gulp.src('./dist/css/*.css')
        .pipe(cleanCSS())
        .pipe(rename("dg-custom-scrollbars.min.css"))
        .pipe(gulp.dest('./dist/css/'));
});

// Default Task
gulp.task('default', ['concat', 'minify', 'minify-css']);