// Uses built-in mirror plugin unless ilp-plugin-btp is installed
const plugin = require('.').createPlugin()
async function run () {
  plugin.registerDataHandler((data) => { return Promise.resolve(data)})
  await plugin.connect()
  const response = await plugin.sendData(Buffer.from('Hello World', 'utf-8'))
  console.log(response.toString('utf-8'))
  process.exit(0)
}
run()