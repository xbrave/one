import typescript from '@rollup/plugin-typescript';

module.exports = {
  input: './src/index.ts',
  output: {
    dir: "lib",
    format: 'cjs'
  },
  plugins:[typescript({
    exclude: 'node_modules/**'
  })]
}