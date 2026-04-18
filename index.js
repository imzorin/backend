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

// ✅ FINAL UPLOAD ROUTE (STABLE)
app.post("/upload", async (req, res) => {
try {
console.log("📥 Incoming request...");

```
const file = req.body?.file;

// ❗ Validate input
if (!file) {
  console.log("❌ No file received");
  return res.status(400).json({ error: "No file received" });
}

if (!file.startsWith("data:image")) {
  console.log("❌ Invalid image format");
  return res.status(400).json({ error: "Invalid image format" });
}

console.log("📤 Uploading to Cloudinary...");

// 🔥 FINAL FIX HERE
const result = await cloudinary.uploader.upload(file, {
  folder: "reports",
  resource_type: "auto", // 💥 KEY FIX
  use_filename: true,
  unique_filename: true,
});

console.log("✅ Upload success:", result.secure_url);

return res.json({ url: result.secure_url });
```

} catch (err) {
console.error("❌ Upload error:", err);
return res.status(500).json({
error: err.message || "Upload failed",
});
}
});

// ✅ PORT (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
