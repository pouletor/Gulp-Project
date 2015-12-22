/****DIRECTORIES****/

var $app = "dev", //environnement de dev
    $dist = "prod"; //livrable


/****VARIABLES****/

var gulp = require("gulp"), 
    sass = require("gulp-sass"),
    browserSync = require("browser-sync"),
    useref = require("gulp-useref"),
    uglify = require("gulp-uglify"), //minification JS
    minifyCSS = require("gulp-minify-css"), //minification CSS
    gulpIf = require("gulp-if"),
    imagemin = require("gulp-imagemin"),
    util = require("gulp-util"), //debug
    cache = require("gulp-cache"),
    del = require("del"),
    runSequence = require("run-sequence"),
    fileinclude = require("gulp-file-include"),
    notify = require("gulp-notify");


/****TASKS****/

//conversion sass -> css
gulp.task("sass", function(){
    return gulp.src($app+"/scss/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest($app+"/css")) 
        .pipe(browserSync.reload({
              stream:true
        }))
        .pipe( notify({ message : "Les fichiers sass sont compilés" }))
});

gulp.task("browserSync", function(){
    browserSync({
        server:{
            baseDir : $app
        }
    })
});

//synchronisation/prévisualisation browser
gulp.task("watch", ["fileinclude", "browserSync", "sass"], function(){
    gulp.watch($app+"/scss/**/*.scss", ["sass"]);
    gulp.watch($app+"/*.html", ["fileinclude"]);
    gulp.watch($app+"/preview/*.html", browserSync.reload);//on ne recharge que les preview
    gulp.watch($app+"/js/**/*.js", browserSync.reload);    
});

//minification
gulp.task("minify", function(){
    return gulp.src($app+"/preview/*.html")
        .pipe(useref())
        .pipe(gulpIf("*.js", uglify()))
        .pipe(gulpIf("*.css", minifyCSS()))
        .pipe(gulp.dest($dist))
        .pipe( notify({ message : "Les fichiers css et js sont minifiés" }))
});


//optimiser images
gulp.task("images", function(){
    return gulp.src($app+"/images/**/*.+(png|jpg|gif|svg)")
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest($dist+"/images"))
        .pipe( notify({ message : "Les images sont optimisées" }))
});

//copier fonts
gulp.task("fonts", function(){
    return gulp.src($app+"/fonts/**/")
        .pipe(gulp.dest($dist+"/fonts"))
        .pipe( notify({ message : "Les font ont été copiées" }))
});

//supprimer tout sauf images
gulp.task("clean:dist", function(callback){
    del([$dist+"/**/*", "!"+$dist+"/images", "!"+$app+"/images/**/*"], callback); 
});

gulp.task("clean", function(callback){
    del($dist);
    return cache.clearAll(callback);
});

gulp.task("fileinclude", function(){
    gulp.src([$app+"/home.html"])
        .pipe(fileinclude({
            prefix:"@@",
            basepath:"@file"
        }))
        .pipe(gulp.dest("./dev/preview/"))
        .pipe( notify({ message : "La page home.html a été recompilée" }))
    
    /*gulp.src([$app+"/page_name.html"])
        .pipe(fileinclude({
            prefix:"@@",
            basepath:"@file"
        }))
        .pipe(gulp.dest("./dev/preview/"))
        .pipe( notify({ message : "La page page_name.html a été recompilée" }))*/
})

gulp.task("build", function(callback){
    runSequence("clean", [ "sass", "minify", "images", "fonts"], callback); 
    
});

gulp.task("default", function(callback){
    runSequence(["sass", "fileinclude", "browserSync", "watch"], callback); 
    
});
