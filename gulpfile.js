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
  doc: [
    {
      opt: { cwd: '', igonreErrors: false },
      config: 'doc/config',
      src: 'src/controllers',
      template: 'doc/template/send_sample_request.js',
      dst: 'doc/html/manager'
    },
    {
      opt: { cwd: '', igonreErrors: false },
      config: 'doc/config',
      src: 'src/receiver',
      template: 'doc/template/send_sample_request.js',
      dst: 'doc/html/receiver'
    }
  ]
};

const complete = () => {};

gulp.task('doc:dev:compile', (done) => {
  for (let i = 0; i < config.doc.length; i++) {
    const options = {
      src: config.doc[i].src,
      dest: config.doc[i].dst,
      config: config.doc[i].config
    };
    apidoc(options, complete);
    gulp.src(config.doc[i].template).pipe(gulp.dest(config.doc[i].dst + '/utils', { overwrite: true }));
  }
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
