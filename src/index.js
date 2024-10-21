import http from "http";
import { v4 as uuidv4 } from "uuid"; // Use import syntax for uuid with ES modules
const hostname = "127.0.0.1";
const port = 3000;

let data = [
  { id: uuidv4(), name: "Sample Data 1" },
  { id: uuidv4(), name: "Sample Data 2" },
];

const server = http.createServer((req, res) => {
  // Set the Content-Type to application/json for JSON responses
  res.setHeader("Content-Type", "application/json");

  // Read data - GET /api/data
  if (req.method === "GET" && req.url === "/api/data") {
    res.writeHead(200);
    res.end(JSON.stringify(data));
  }
  // Create data - POST /api/data
  else if (req.method === "POST" && req.url === "/api/data") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { name } = JSON.parse(body);
        if (!name) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: "Name is required" }));
          return;
        }

        const newData = { id: uuidv4(), name };
        data.push(newData);
        res.writeHead(201);
        res.end(JSON.stringify(newData));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Invalid JSON format" }));
      }
    });
  }
  // Update data - PUT /api/data/:id
  else if (req.method === "PUT" && req.url.startsWith("/api/data/")) {
    const id = req.url.split("/")[3];
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { name } = JSON.parse(body);
        const item = data.find((d) => d.id === id);
        if (!item) {
          res.writeHead(404);
          res.end(JSON.stringify({ message: "Data not found" }));
          return;
        }

        item.name = name || item.name;
        res.writeHead(200);
        res.end(JSON.stringify(item));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Invalid JSON format" }));
      }
    });
  }
  // Delete data - DELETE /api/data/:id
  else if (req.method === "DELETE" && req.url.startsWith("/api/data/")) {
    const id = req.url.split("/")[3];
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ message: "Data not found" }));
      return;
    }

    data.splice(index, 1);
    res.writeHead(204);
    res.end();
  }
  // Handle 404 - Not found
  else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Resource not found" }));
  }
});

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
