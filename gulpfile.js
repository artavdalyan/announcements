const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const htmlReaplce = require('gulp-html-replace');
const htmlMin = require('gulp-htmlmin');
const del = require('del');
const sequence = require('run-sequence');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');

const config = {
	dist: 'dist/',
	src: 'src/',
	cssin: 'src/css/**/*.css',
	jsin: 'src/js/**/*.js',
	imgin: 'src/img/**/*.{jpg,jpeg,png,gif}',
	htmlin: 'src/*.html',
	scssin: 'src/scss/**/*.scss',
	cssout: 'dist/css/',
	jsout: 'dist/js/',
	imgout: 'dist/img/',
	htmlout: 'dist/',
	scssout: 'src/css/',
	cssoutname: 'style.css',
	jsoutname: 'script.js',
	cssreplaceout: 'css/style.css',
	jsreplaceout: 'js/script.js'
};

gulp.task('reload', function () {
	browserSync.reload();
});
gulp.task('serve',['css', 'html'],  function () {
	browserSync({
		server: config.dist
	});
	gulp.watch([config.cssin], ['css', 'reload']);
	gulp.watch([config.htmlin], ['html', 'reload'])
	// gulp.watch(config.scssin, ['sass']);
});
gulp.task('sass', function () {
	return gulp.src(config.scssin)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 3 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.scssout))
		.pipe(browserSync.stream());
});

gulp.task('css', function () {
	return gulp.src(config.cssin)
		.pipe(autoprefixer())
		.pipe(concat(config.cssoutname))
		.pipe(cleanCSS())
		.pipe(gulp.dest(config.cssout))
		;
});

gulp.task('js', function () {
	return gulp.src(config.jsin)
		.pipe(concat(config.jsoutname))
		.pipe(gulp.dest(config.jsout));
});

gulp.task('img', function () {
	return gulp.src(config.imgin)
		.pipe(changed(config.imgout))
		.pipe(imagemin())
		.pipe(gulp.dest(config.imgout));
});

gulp.task('html', function () {
	return gulp.src('src/*.html')
		.pipe(useref())
		.pipe(gulpif('*.css', cleanCSS()))
		.pipe(htmlMin({
			sortAttributes: true,
			sortClassName: true,
			collapseWhitespace: true
		}))
		.pipe(gulp.dest(config.dist))
});

gulp.task('clean', function () {
	return del([config.dist]);
});

gulp.task('build', function () {
	return sequence('clean', ['css', 'js', 'html']);
});
gulp.task('default', ['serve']);
