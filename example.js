// Requires 'ilp-plugin-btp' to already be installed
const plugin = require('.').createPlugin()
async function run () {
  await plugin.connect()
  plugin.sendData(Buffer.alloc(0)).then(console.log).catch(console.error)
  process.exit(0)
}
run()