# Web Crawler Project

This project is a scalable web crawler built using Node.js, RabbitMQ, and MongoDB. It features centralized logging, monitoring, and a microservices architecture to handle large-scale web crawling tasks efficiently.

## Features

- **Microservices Architecture**: Separates the API server and queue processor for independent scaling.
- **Dockerized**: Uses Docker and Docker Compose for easy deployment.
- **Centralized Logging**: Utilizes `winston` for logging, with support for centralized log aggregation.
- **Monitoring**: Exposes metrics via Prometheus and visualizes them with Grafana.
- **Rate Limiting and Retry Mechanism**: Ensures compliance with web server limits and handles failures gracefully.

## Prerequisites

- **Docker** and **Docker Compose**: Ensure Docker and Docker Compose are installed on your system.
- **Node.js**: Required for local development and running scripts.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/web-crawler.git
   cd web-crawler
   ```

2. **Create a `.env` File**:
   Create a `.env` file in the root directory with the following content:
   ```plaintext
   MONGODB_URI=mongodb://mongo:27017/webcrawler
   RABBITMQ_URI=amqp://rabbitmq
   QUEUE_NAME=urlQueue
   API_PORT=3000
   ```

3. **Build and Run with Docker Compose**:
   Use Docker Compose to build and run the services:
   ```bash
   docker-compose up --build
   ```

   This will start the API server, queue processor, MongoDB, and RabbitMQ.

## Usage

1. **Upload URLs**:
   - Use the API server to upload a text file containing URLs to crawl.
   - The API endpoint is available at `http://localhost:3000/upload`.
   - Use a tool like `curl` or Postman to upload the file.

   Example using `curl`:
   ```bash
   curl -F 'file=@urls.txt' http://localhost:3000/upload
   ```

2. **Monitor Metrics**:
   - Metrics are exposed at `http://localhost:3000/metrics`.
   - Configure Prometheus to scrape this endpoint and use Grafana for visualization.

3. **View Logs**:
   - Logs are stored in the `logs` directory.
   - Use a centralized logging solution to aggregate and analyze logs.

## Scaling

- **Queue Processor**: Scale the queue processor by running multiple instances:
  ```bash
  docker-compose scale queue-processor=3
  ```

## Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run API Server Locally**:
   ```bash
   node src/apiServer.js
   ```

3. **Run Queue Processor Locally**:
   ```bash
   node src/crawler.js
   ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
