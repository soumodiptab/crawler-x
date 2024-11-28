const cheerio = require('cheerio');

class CheerioParser {
    parse(html) {
        const $ = cheerio.load(html);
        return {
            title: $('title').text(),
            description: $('meta[name="description"]').attr('content'),
            body: $('body').text()
        };
    }
}

module.exports = CheerioParser; 