import { type NextRequest, NextResponse } from "next/server";
import { blobService } from "@/lib/blob-service";

// 🔗 Python AI model microservice — configured via MODEL_API_URL env var.
// The Python server (cervix-model-api.py) runs as a SEPARATE, standalone service.
// For local dev: set MODEL_API_URL=http://localhost:5000/predict in .env.local
//   and run: python cervix-model-api.py  (in Cancer_Detection_source_code/Cancer_Detection-main/)
// For production: set MODEL_API_URL to your deployed Render/Cloud Run URL.
const MODEL_API_URL =
  process.env.MODEL_API_URL ||
  "https://cancer-detection-1-2uz2.onrender.com/predict";

export async function POST(request: NextRequest) {
  try {
    // 🧩 Step 1: Get image from the form data
    const formData = await request.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      console.error("[v0] ❌ No image found in request.");
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    // 🧠 Step 2: Convert image to buffer
    const imageBuffer = await image.arrayBuffer();
    console.log(`[v0] ✅ Received image: ${image.name} (${image.size} bytes)`);

    // 🪣 Step 3: Upload to Blob Storage (optional but keeps image reference)
    const imageBlob = new Blob([imageBuffer], { type: image.type });
    let blobUrl = "";
    try {
      blobUrl = await blobService.uploadCervixImage(imageBlob, "temp-" + Date.now());
      console.log("[v0] ✅ Image uploaded to Blob:", blobUrl);
    } catch (uploadError) {
      console.warn("[v0] ⚠️ Blob upload failed, continuing anyway:", uploadError);
    }

    // 🔍 Step 4: Send image to Python model backend for prediction
    if (!MODEL_API_URL) {
      console.error("[v0] ❌ MODEL_API_URL is not configured.");
      return NextResponse.json(
        {
          success: false,
          error: "Model API not configured. Set MODEL_API_URL in your environment variables.",
        },
        { status: 503 }
      );
    }

    const backendForm = new FormData();
    backendForm.append("file", new Blob([imageBuffer], { type: image.type }), image.name);

    let response;
    try {
      response = await fetch(MODEL_API_URL, {
        method: "POST",
        body: backendForm,
      });
    } catch (networkError) {
      console.error("[v0] ❌ Network error connecting to model backend:", networkError);
      return NextResponse.json(
        { success: false, error: "Cannot reach prediction server. Is the Python model running?", details: String(networkError) },
        { status: 502 }
      );
    }

    if (!response.ok) {
      const text = await response.text();
      console.error("[v0] ❌ Backend returned error:", text);
      return NextResponse.json(
        { success: false, error: "Model prediction failed", details: text },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("[v0] ✅ Prediction received from backend:", result);

    // 🧾 Step 5: Return combined final response
    return NextResponse.json({
      success: true,
      imageUrl: blobUrl,
      prediction: result.prediction,
      confidence: result.score,
      threshold: result.threshold,
      class: result.class,
      message: "Prediction successful",
    });

  } catch (error) {
    console.error("[v0] ❌ Unexpected API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
