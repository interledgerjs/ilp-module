module.exports = class MyWidget {

    constructor(options, services) {
        this.greeting = options.greeting
        this.log = services.log
    }

    hello(msg) {
        this.log.info(`Hello ${this.greeting}! ${msg}`)
    }

}