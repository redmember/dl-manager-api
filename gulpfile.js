'use strict';

const gulp = require('gulp');
const gls = require('gulp-live-server');
const apidoc = require('gulp-apidoc');

const config = {
  server: {
    js: 'src/**/*.js',
    cfg: 'src/config/*.json',
    app: ['src/app.js']
  },
  doc: {
    opt: { cwd: '', igonreErrors: false },
    config: 'docs/config',
    src: 'src/controllers',
    template: 'docs/template/send_sample_request.js',
    dst: 'docs/manager'
  }
};

const complete = () => {};

gulp.task('doc:dev:compile', (done) => {
  const options = {
    src: config.doc.src,
    dest: config.doc.dst,
    config: config.doc.config
  };
  apidoc(options, complete);
  gulp.src(config.doc.template).pipe(gulp.dest(config.doc.dst + '/utils', { overwrite: true }));
  done();
});

gulp.task('server:dev', () => {
  const options = { env: { NODE_ENV: 'development' } };
  const server = gls(['--trace-warnings', config.server.app], options, false);
  server.start();
  gulp.watch([config.server.cfg, config.server.js], (done) => {
    server.start.bind(server)();
    done();
  });
  gulp.watch([config.server.js], gulp.series(['doc:dev:compile'], (done) => { done(); }));
});

gulp.task('serve:watch', gulp.series(['doc:dev:compile', 'server:dev']));
gulp.task('serve:dev', gulp.series(['server:dev']));
gulp.task('default', gulp.series(['serve:watch']));
