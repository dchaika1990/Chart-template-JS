const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglifyjs');
const concat = require('gulp-concat');

gulp.task('scripts', () =>
    gulp.src('js/modules/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe( concat('modules.min.js') )
        .pipe( uglify() )
        .pipe(gulp.dest('js/'))
);

gulp.task('watch', ['scripts'], () => {
   gulp.watch('js/modules/**/*.js', ['scripts'])
});

gulp.task('default', ['watch']);