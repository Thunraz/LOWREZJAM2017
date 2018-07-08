import cleanTask         from './tasks/clean';
import compileMarkupTask from './tasks/compileMarkup';
import compileScriptTask from './tasks/compileScript';
import compileStyleTask  from './tasks/compileStyle';
import copyAssetsTask    from './tasks/copyAssets'
import gulp              from 'gulp';
import serverTask        from './tasks/server';
import watchTask         from './tasks/watch';
import zipTask           from './tasks/zip';

const clean = (done) => { return cleanTask(done); };

const compileMarkup = (done) => { return compileMarkupTask(done); };
const compileScript = (done) => { return compileScriptTask(done); };
const compileStyle  = (done) => { return compileStyleTask(done);  };

const copyAssets = (done) => { return copyAssetsTask(done); };
const server     = (done) => { return serverTask(done);     };
const watch      = (done) => { return watchTask(done);      };
const zip        = (done) => { return zipTask(done);        };

const compile = gulp.series(
    clean,
    gulp.parallel(
        compileMarkup,
        compileScript,
        compileStyle,
        copyAssets
    ),
    zip
);
compile.description = 'compile all sources';

const serve = gulp.series(compile, server);
serve.description = 'serve compiled source on local server at port 3000';

const defaultTasks = gulp.parallel(serve, watch);

export {
    clean,
    compile,
    
    watch
};
  
export default defaultTasks;