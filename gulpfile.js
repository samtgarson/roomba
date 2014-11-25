var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    argv            = require('yargs').argv,
    bower           = require('bower'),
    mainBowerFiles  = require('main-bower-files'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload;


var jsFiles = mainBowerFiles().concat(['src/*/**/*.js', 'src/templates.js', 'src/app.js']);
console.log(jsFiles);

var mario = function(err) {
    
};

gulp.task('browser-sync', function() {
    return browserSync({
      proxy: 'staging-app.gojimo.net:8888',
      open: false,
      minify: false,
      files: ['build/script.js'],
      injectChanges: true
    });
});

gulp.task('tpl', function () {
    gulp.src("src/**/*.html")
        .pipe($.angularTemplatecache({'standalone': true}))
        .pipe(gulp.dest('./src/'));
});

// Javascript build
gulp.task('js', function() {
    gulp.src(jsFiles)
        .pipe($.ngAnnotate())
        // .pipe($.angularFilesort())
        .pipe($.uglify())
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('build/'));
});

// Javascript build development
gulp.task('jsDev', function() {
    gulp.src(jsFiles)
        // .pipe($.angularFilesort())
        .pipe($.uglify({
            'mangle': false,
            'compress': false,
            'output': {
                'beautify': true
            }
        }))
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('build/'));
});



// SASS build
gulp.task('sass', function () {
    gulp.src('src/**/*.scss')
        .pipe($.cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe($.sass())
        .pipe($.concat('style.css'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest('build/'));
});

// SASS Development
gulp.task('sassDev', function () {
    gulp.src('src/**/*.scss')
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe($.sass())
        .pipe($.concat('style.css'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/'))
        .pipe($.filter('*.css'))
        .pipe(browserSync.reload({stream:true}));
});

// Set up watchers
gulp.task('default', ['sassDev', 'jsDev', 'browser-sync'], function() {
    gulp.watch('./src/**/*.scss', ['sassDev']);
    gulp.watch('src/**/*.html', ['tpl']);
    gulp.watch(jsFiles, ['jsDev']);
});

// Build JS and SASS
gulp.task('build', ['js', 'sass']);

// Build then add and commit
gulp.task('commit', ['build'], function(){
    gulp.src(['build/script.js', 'build/style.css'])
        .pipe($.git.add())
        .pipe($.git.commit('Build'));
});

gulp.task('newfeature', function() {
    var name = argv.name;
    gulp.src('src/features/_feature/*')
        .pipe($.clone())
        .pipe($.template({'name': name, 'bigname': name.charAt(0).toUpperCase() + name.slice(1)}))
        .pipe($.rename(function(path) {
            path.dirname = name;
            path.basename = '_' + name;
        }))
        .pipe(gulp.dest('src/features/'));
});

gulp.task('newpattern', function() {
    var name = argv.name;
    gulp.src('src/patterns/_pattern/*')
        .pipe($.clone())
        .pipe($.template({'name': name, 'bigname': name.charAt(0).toUpperCase() + name.slice(1)}))
        .pipe($.rename(function(path) {
            path.dirname = name;
            path.basename = '_' + name;
        }))
        .pipe(gulp.dest('src/patterns/'));
});

// gulp.task('push', ['commit'], function(){
//     var branch = argv.b;
//     $.git.push('origin', branch!==undefined?branch:'develop').on('error', errorHandler);
// });}