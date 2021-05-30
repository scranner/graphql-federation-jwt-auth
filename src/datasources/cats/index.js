const { RESTDataSource } = require('apollo-datasource-rest');

class CatFactsAPI extends RESTDataSource {
    CircuitOptions;

    constructor() {
        // Always call super()
        super();
        this.CircuitOptions = {};
        this.baseURL = 'https://catfact.ninja/';
    }

    async getFact() {
        return await this.get(`fact`);
    }
}

module.exports = CatFactsAPI;