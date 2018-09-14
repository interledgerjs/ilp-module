import { createPlugin } from './lib/main'
const plugin = createPlugin()
async function run () {
  await plugin.connect()
  plugin.sendData(Buffer.alloc(0)).then(console.log).catch(console.error)
  process.exit(0)
}
run()
