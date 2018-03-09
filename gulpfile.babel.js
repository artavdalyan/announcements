import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';
import htmlReaplce from 'gulp-html-replace';
import htmlMin from 'gulp-htmlmin';
import del from 'del';
import sequence from 'run-sequence';
import useref from 'gulp-useref';
import gulpif from 'gulp-if';

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

gulp.task('reload', () => {
	browserSync.reload();
});
gulp.task('serve', ['css', 'html'], () => {
	browserSync({
		server: config.dist
	});
	gulp.watch([config.cssin], ['css', 'reload']);
	gulp.watch([config.htmlin], ['html', 'reload'])
	// gulp.watch(config.scssin, ['sass']);
});
gulp.task('sass', () => {
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

gulp.task('css', () => {
	return gulp.src(config.cssin)
		.pipe(autoprefixer())
		.pipe(concat(config.cssoutname))
		.pipe(cleanCSS())
		.pipe(gulp.dest(config.cssout))
		;
});

gulp.task('js', () => {
	return gulp.src(config.jsin)
		.pipe(concat(config.jsoutname))
		.pipe(gulp.dest(config.jsout));
});

gulp.task('img', () => {
	return gulp.src(config.imgin)
		.pipe(changed(config.imgout))
		.pipe(imagemin())
		.pipe(gulp.dest(config.imgout));
});

gulp.task('html', () => {
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

gulp.task('clean', () => {
	return del([config.dist]);
});

gulp.task('build', () => {
	return sequence('clean', ['css', 'js', 'html']);
});
gulp.task('default', ['serve']);
