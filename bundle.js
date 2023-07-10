import ESBuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

// Is this a development run & should we serve public?
const _DEV_ = process.argv.some(env => env === 'dev')
const _SERVER_ = process.argv.some(env => env === 'server')

// Configuration for ESBuild
const esBuildConfig = {
  entryPoints: ['scss/sassStyle.scss'],
  bundle: true,
  color: true,
  logLevel: 'info',
  sourcemap: _DEV_,
  minify: !_DEV_,
  target: 'es6',
  outdir: 'public',
  plugins: [sassPlugin()]
}

try {
  // In development mode, we want to watch the files and serve them
  if (_DEV_) {
    const ctx = await ESBuild.context(esBuildConfig)
    await ctx.watch()
    if (_SERVER_) {
      // Dynamically serve changes
      await ctx.serve({
        port: 3000,
        servedir: 'public'
      })
    } else {
      // Watch and rebuild, but don't serve files
      await ESBuild.build(esBuildConfig)
    }
  } else {
    // In production mode, we just want to build the files once (no watch)
    await ESBuild.build(esBuildConfig)
  }
} catch (err) {
  console.error('An error occurred while building and/or serving the project.')
  console.error(err)
}
