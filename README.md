# gulp-archive-generator

```js
gulp.task('default',function () {
    return gulp.src('./target/**')
        .pipe(zip('target.zip'))
        .pipe(gulp.dest('./'))
})
```

