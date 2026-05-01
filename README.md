# 🔬 NeuroLens
### AI-Powered Image Analysis & Description System

<p>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini_API-Integrated-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active-4ade80?style=flat-square" />
  <img src="https://img.shields.io/badge/Version-1.0.0-f59e0b?style=flat-square" />
</p>

> NeuroLens is a web-based image analysis system that uses the **Google Gemini API** to automatically generate structured, human-readable descriptions of any uploaded image — covering objects, people, actions, environment, mood, and context.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Input & Output](#-input--output)
- [Methodology](#-methodology)
- [File Structure](#-file-structure)
- [Requirements](#-requirements)
- [Installation & Usage](#-installation--usage)
- [Results](#-results)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

## 🧠 Overview

**NeuroLens** is a lightweight, browser-based image intelligence tool built with **Node.js** on the backend and **vanilla HTML/CSS/JavaScript** on the frontend. Users upload an image, provide their Gemini API key, and receive a clean, structured description of everything visible in the image — all within seconds.

The final output screen presents:

1. **Input Image** — the original uploaded image
2. **Resulted Output** — the Gemini-generated structured description

| | |
|---|---|
| **Project Type** | Image Understanding and Description System |
| **API Used** | Google Gemini (`generateContent` endpoint) |
| **Date** | May 1, 2026 |
| **Runtime** | Node.js (built-in modules only — no extra packages) |

---

## 🎯 Problem Statement

Users often need clear, organized explanations of images for purposes like:

- **Documentation** — describing visuals in reports or wikis
- **Accessibility** — generating alt-text for visually impaired users
- **Analysis** — quickly understanding the content of unfamiliar images
- **Education** — breaking down complex visuals into plain language

Manually writing image descriptions is time-consuming and inconsistent. **NeuroLens** solves this by accepting any image and returning a detailed, structured description automatically — with zero manual effort.

---

## ✨ Features

- 📤 **Upload any image** directly in the browser via file picker
- 🔍 **Instant image preview** before submitting for analysis
- 🤖 **Gemini API integration** for state-of-the-art multimodal image understanding
- 📄 **Structured output** — organized into 6 clearly labelled sections
- 🔑 **Bring your own API key** — paste your Gemini key directly in the UI
- 🖥️ **Clean result layout** — input image displayed above the generated description
- ⚡ **Zero npm dependencies** — uses only Node.js built-in modules
- 🚀 **Cloud-deployable** to Railway, Render, or Vercel

---

## 📥 Input & Output

### Input

| Input | Details |
|---|---|
| **Image File** | Uploaded via the browser file picker |
| **Supported Formats** | `.png` · `.jpg` · `.jpeg` · `.webp` · `.gif` |
| **Gemini API Key** | Pasted into the input field on the page |

### Output

The generated description is organized into six structured sections:

| Section | What It Covers |
|---|---|
| **Clear Summary** | A one-paragraph overview of the entire image |
| **Objects, People, Animals, or Items** | Everything identifiable in the frame |
| **Actions or Activities** | What is happening or being performed |
| **Background and Environment** | Setting, location, and surroundings |
| **Colors, Mood, and Visual Style** | Dominant colors, tone, and aesthetic feel |
| **Important or Notable Context** | Inferences, visible text, or special details |

### Final Output Screen Layout

```
┌─────────────────────────────────────────────┐
│               INPUT IMAGE                   │
│           [uploaded image here]             │
├─────────────────────────────────────────────┤
│              RESULTED OUTPUT                │
│                                             │
│  Clear Summary:                             │
│    A photograph showing...                  │
│                                             │
│  Objects, People, Animals, or Items:        │
│    A person, a wooden table, a coffee mug.. │
│                                             │
│  Actions or Activities:                     │
│    The person is reading a book while...    │
│                                             │
│  Background and Environment:                │
│    Indoor setting, appears to be a café...  │
│                                             │
│  Colors, Mood, and Visual Style:            │
│    Warm tones, soft lighting, calm mood...  │
│                                             │
│  Important or Notable Context:              │
│    A sign in the background reads...        │
└─────────────────────────────────────────────┘
```

---

## ⚙️ Methodology

### Step 1 — Image Upload

The user selects an image via the browser file picker. A live preview is rendered on the page immediately so the user can confirm the correct file before sending it for analysis.

### Step 2 — Image Processing

The browser's `FileReader` API reads the uploaded file and converts it into a **base64 data URL**. This encoded image is then sent to the local Node.js server via a `POST` request. The server extracts:

- The **MIME type** (e.g., `image/jpeg`, `image/png`)
- The **base64-encoded image content**

### Step 3 — Gemini API Integration

The server constructs a structured prompt and sends both the prompt and image data to the Gemini API:

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent
```

Gemini processes the image using its multimodal vision capabilities and returns a detailed text response.

### Step 4 — Result Display

The frontend receives the API response and renders the final screen in this order:

```
Input Image  →  Resulted Output
```

---

## 📁 File Structure

```
NeuroLens/
│
├── public/
│   ├── index.html          ←  Main UI page (upload form, preview, output)
│   ├── styles.css          ←  Page styling and responsive layout
│   └── app.js              ←  Frontend logic: upload, base64, fetch, render
│
├── server.js               ←  Node.js server + Gemini API request handler
├── package.json            ←  Project metadata and npm start script
└── README.md               ←  Project documentation (this file)
```

### File Responsibilities

| File | Role |
|---|---|
| `public/index.html` | Defines the page structure: upload form, preview area, output section |
| `public/styles.css` | Handles all visual design, layout, and responsive behavior |
| `public/app.js` | Reads image as base64, sends to server, renders result on page |
| `server.js` | Receives image from browser, calls Gemini API, returns description |
| `package.json` | Configures `npm start` to run `server.js` |

---

## 📦 Requirements

| Requirement | Details |
|---|---|
| **Node.js** | v18 or higher — download at [nodejs.org](https://nodejs.org) |
| **Gemini API Key** | Free key available at [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Browser** | Any modern browser: Chrome, Firefox, Edge, or Safari |
| **npm packages** | ❌ None required — built entirely on Node.js built-in modules |

> **No `npm install` step needed.** The project is intentionally dependency-free to stay simple, portable, and easy to run anywhere.

---

## 🚀 Installation & Usage

### 1. Get the Project

**Clone via Git:**
```bash
git clone https://github.com/your-username/neurolens.git
cd neurolens
```

**Or download** the zip and extract it to your desired location.

---

### 2. Navigate to the Project Folder

```bash
cd "/Users/sirisha/Documents/NeuroLens"
```

---

### 3. Start the Server

```bash
npm start
```

You should see:
```
NeuroLens is running at http://localhost:3000
```

---

### 4. Open in Your Browser

```
http://localhost:3000
```

---

### 5. Analyze an Image

1. Click **Choose File** and select any `.png`, `.jpg`, `.jpeg`, `.webp`, or `.gif` image
2. Paste your **Gemini API key** into the API key field
3. Click **Analyze Image**
4. Wait a moment — then view your **Input Image** and **Resulted Output** on screen

---

### Optional — Pre-set Your API Key

To skip pasting your key every time, set it as an environment variable before starting:

```bash
# macOS / Linux
GEMINI_API_KEY=your_key_here npm start

# Windows (Command Prompt)
set GEMINI_API_KEY=your_key_here && npm start

# Windows (PowerShell)
$env:GEMINI_API_KEY="your_key_here"; npm start
```

---

## 📊 Results

NeuroLens successfully processes uploaded images and returns well-structured, accurate descriptions through the Gemini API. The output is consistently organized, readable, and covers all major visual elements present in the image.

### Validated Use Cases

| Use Case | Description |
|---|---|
| 🖼️ **Image Understanding** | Quickly summarize and explain any image |
| ♿ **Accessibility Support** | Auto-generate alt-text for visually impaired users |
| 📄 **Visual Documentation** | Attach descriptions to images in reports or wikis |
| 🎓 **Educational Explanations** | Break down complex diagrams or scientific images |
| 🔍 **Content Analysis** | Identify and log objects, people, and context at scale |

---

## 🔮 Future Improvements

| Priority | Feature |
|---|---|
| ⭐ High | **PDF export** — download input image + description as a single PDF report |
| ⭐ High | **Multiple image upload** — analyze a batch of images in one session |
| 🔶 Medium | **History page** — browse and revisit all previous analyses |
| 🔶 Medium | **Description length selector** — Short / Medium / Detailed mode |
| 🔶 Medium | Improved **mobile layout** and fully responsive design |
| 🔷 Low | **Copy to clipboard** button for the generated output |
| 🔷 Low | **Language selector** for multilingual descriptions |
| 🔷 Low | **Confidence score** or structured JSON output option |

---
## Deployment:

Live Deployment: https://neurolens-ctry.onrender.com/

## 📄 License

```
MIT License

Copyright (c) 2026 NeuroLens

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

<p align="center">
  <strong>NeuroLens</strong> — See images the way AI does. · Built May 2026
</p>
