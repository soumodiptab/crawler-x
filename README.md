# Web Crawler System

## Overview

The Web Crawler System is designed to efficiently crawl web pages, extract metadata, and classify the content using the OpenAI API. It is built with scalability, reliability, and observability in mind, leveraging a microservices architecture, message queuing, and centralized logging and monitoring.

## Features

- **URL Ingestion**: Accepts file uploads containing URLs for processing.
- **Web Crawling**: Fetches web pages and extracts metadata.
- **Content Classification**: Classifies metadata using the OpenAI API.
- **Monitoring**: Provides real-time monitoring and alerting.
- **Retry Mechanism**: Handles rate limits and transient errors with retries.

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- RabbitMQ
- Prometheus and Grafana (for monitoring)
- OpenAI API Key

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/web-crawler-system.git
   cd web-crawler-system
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory with the following variables:

   ```plaintext
   MONGODB_URI=mongodb://localhost:27017/webcrawler
   RABBITMQ_URI=amqp://localhost
   QUEUE_NAME=urlQueue
   RETRY_QUEUE_NAME=retryQueue
   RECYCLER_QUEUE_NAME=recyclerQueue
   INSIGHT_QUEUE_NAME=insightQueue
   API_PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Running the Project

1. **Start MongoDB**:
   Ensure MongoDB is running on your local machine.

2. **Start RabbitMQ**:
   Ensure RabbitMQ is running on your local machine.

3. **Run the API Server**:
   ```bash
   node src/apiServer.js
   ```

4. **Run the Consumer**:

   ```bash
   node src/consumer.js
   ```

5. **Run the Watcher Service**:

   ```bash
   node src/watcher.js
   ```

6. **Set Up Monitoring**:
   - Start Prometheus and Grafana.
   - Configure Prometheus to scrape metrics from the API server.

## Monitoring

- Access Grafana at `http://localhost:3000` to view dashboards and metrics.
- Ensure Prometheus is configured to scrape metrics from the `/metrics` endpoint exposed by the API server.

## Design Document

For a detailed design document, please refer to [design/des.md](design/des.md).

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
