const axios = require('axios');
const robotsParser = require('robots-parser');

async function checkRobotsTxt(url) {
    try {
        const { origin } = new URL(url);
        const robotsUrl = `${origin}/robots.txt`;
        const response = await axios.get(robotsUrl);
        const robots = robotsParser(robotsUrl, response.data);
        return robots.isAllowed(url);
    } catch (error) {
        console.error(`Error fetching robots.txt for ${url}:`, error);
        return false;
    }
}

module.exports = checkRobotsTxt; 