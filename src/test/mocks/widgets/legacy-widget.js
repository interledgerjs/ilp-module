"use strict"
module.exports = class LegacyWidget {
    constructor(options, services) {
        this.options = options;
        this.log = services.log;
    }
}