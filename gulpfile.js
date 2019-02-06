var gulp = require('gulp');
var util = require('gulp-util');
var gulpConnect = require('gulp-connect');
var connect = require('connect');
var cors = require('cors');
var path = require('path');
var exec = require('child_process').exec;
var portfinder = require('portfinder');
var swaggerRepo = require('swagger-repo');

var DIST_DIR = 'web_deploy';

gulp.task('edit', function(done) {
  portfinder.getPort({port: 5000}, function (err, port) {
    var app = connect();
    app.use(swaggerRepo.swaggerEditorMiddleware());
    app.listen(port);
    util.log(util.colors.green('swagger-editor started http://localhost:' + port));
  });
  done();
});

gulp.task('build', function (done) {
  exec('npm run build', function (err, stdout, stderr) {
    console.log(stderr);
    done(err);
  });
});

gulp.task('reload', gulp.series('build', function (done) {
  gulp.src(DIST_DIR).pipe(gulpConnect.reload());
  done();
}));

gulp.task('watch', function (done) {
  gulp.watch(['spec/**/*', 'web/**/*'], gulp.series('reload'));
  done();
});

gulp.task('serve', gulp.series('build', 'edit', 'watch', function() {
    portfinder.getPort({port: 3000}, function (err, port) {
        gulpConnect.server({
            debug: true,
            root: [DIST_DIR],
            livereload: true,
            port: port,
            middleware: function (gulpConnect, opt) {
                return [
                    cors()
                ]
            }
        });
    });
}));
