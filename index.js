require("dotenv").config();

const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔐 Cloudinary config using .env
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.API_KEY,
api_secret: process.env.API_SECRET,
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
res.send("Backend is running 🚀");
});

// ✅ UPLOAD ROUTE
app.post("/upload", async (req, res) => {
try {
const { file } = req.body;

```
const result = await cloudinary.uploader.upload(file, {
  folder: "reports",
});

res.json({ url: result.secure_url });
```

} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
});

// ✅ PORT FIX (important for deployment)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
