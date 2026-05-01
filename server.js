const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const MAX_BODY_SIZE = 55 * 1024 * 1024;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8"
};

const analysisPrompt = `Carefully examine the uploaded image and provide a detailed description.

Use simple, structured language and do not assume anything that is not visible.

Return the answer with these sections:
1. Clear Summary
2. Objects, People, Animals, or Items Present
3. Actions or Activities
4. Background and Environment
5. Colors, Mood, and Visual Style
6. Important or Notable Context or Inference

If something is not visible or not happening, say that clearly.`;

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        reject(new Error("The image is too large. Please use an image under 50 MB."));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("The request could not be read."));
      }
    });

    req.on("error", () => reject(new Error("The request failed.")));
  });
}

function serveStatic(req, res) {
  const requestedPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, safePath === "/" ? "index.html" : safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function analyzeImage(req, res) {
  try {
    const { imageDataUrl, apiKey, model = "gemini-2.5-flash" } = await readJsonBody(req);
    const key = (apiKey || process.env.GEMINI_API_KEY || "").trim();

    if (!key) {
      sendJson(res, 400, { error: "Please enter a Gemini API key or set GEMINI_API_KEY." });
      return;
    }

    const imageMatch = imageDataUrl?.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

    if (!imageMatch) {
      sendJson(res, 400, { error: "Please upload a valid image." });
      return;
    }

    const [, mimeType, base64Image] = imageMatch;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "x-goog-api-key": key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: analysisPrompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ]
      })
    });

    const payload = await geminiResponse.json();

    if (!geminiResponse.ok) {
      sendJson(res, geminiResponse.status, {
        error: payload.error?.message || "The image could not be analyzed."
      });
      return;
    }

    const analysis = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .filter(Boolean)
      .join("\n\n");

    sendJson(res, 200, { analysis: analysis || "No description was returned." });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Something went wrong." });
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/analyze") {
    analyzeImage(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  res.writeHead(405);
  res.end("Method not allowed");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`NeuroLens is running at http://localhost:${PORT}`);
});
