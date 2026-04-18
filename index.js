require("dotenv").config();

const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🔐 Cloudinary config
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET,
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
res.send("Backend is running 🚀");
});

// ✅ UPLOAD ROUTE (FINAL FIX)
app.post("/upload", async (req, res) => {
try {
console.log("📥 Incoming request...");

```
const file = req.body?.file;

// ❗ Check if file exists
if (!file) {
  console.log("❌ No file received");
  return res.status(400).json({ error: "No file received" });
}

// ❗ Validate format
if (!file.startsWith("data:image")) {
  console.log("❌ Invalid image format");
  return res.status(400).json({ error: "Invalid image format" });
}

console.log("📤 Uploading to Cloudinary...");

const result = await cloudinary.uploader.upload(file, {
  folder: "reports",
  resource_type: "image", // 🔥 IMPORTANT FIX
});

console.log("✅ Upload success:", result.secure_url);

res.json({ url: result.secure_url });
```

} catch (err) {
console.error("❌ Upload error:", err);
res.status(500).json({ error: err.message });
}
});

// ✅ PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
