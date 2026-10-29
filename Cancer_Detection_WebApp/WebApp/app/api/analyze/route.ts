import { type NextRequest, NextResponse } from "next/server";

// 🔗 Python model backend URL — set MODEL_API_URL in your .env.local
// e.g.  MODEL_API_URL=http://localhost:10000/predict
const MODEL_API_URL = process.env.MODEL_API_URL ?? "";

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] 🔥 Analyze API triggered");

    // 🧠 Parse request safely
    const body = await request.json().catch(() => ({}));
    const imageUrl = body?.imageUrl;
    console.log("[v0] 📩 Received imageUrl:", imageUrl);

    if (!imageUrl || typeof imageUrl !== "string") {
      console.error("[v0] ❌ Missing or invalid imageUrl");
      return NextResponse.json(
        { error: "No valid image URL provided" },
        { status: 400 }
      );
    }

    // 🚫 Reject blob: or local URLs
    if (imageUrl.startsWith("blob:") || imageUrl.startsWith("data:")) {
      console.error("[v0] ❌ Invalid image URL: browser-only blob/data URL");
      return NextResponse.json(
        {
          error:
            "Invalid image URL. Please upload to a public blob or storage first.",
        },
        { status: 400 }
      );
    }

    // 🧩 Fetch the image from public blob storage
    console.log("[v0] 📸 Fetching image from:", imageUrl);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error(
        "[v0] ❌ Failed to fetch image:",
        imageResponse.status,
        imageResponse.statusText
      );
      return NextResponse.json(
        { error: "Failed to fetch image", status: imageResponse.status },
        { status: 400 }
      );
    }

    // Convert to Blob
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });

    // 🔥 Send image to model backend
    console.log("[v0] 🚀 Sending to model:", MODEL_API_URL);
    const formData = new FormData();
    formData.append("file", imageBlob, "cervix.jpg");

    const modelResponse = await fetch(MODEL_API_URL, {
      method: "POST",
      body: formData,
    });

    if (!modelResponse.ok) {
      const errText = await modelResponse.text();
      console.error("[v0] ❌ Model API error:", modelResponse.status, errText);
      return NextResponse.json(
        { error: "Model API failed", details: errText },
        { status: modelResponse.status }
      );
    }

    // ✅ Success
    const prediction = await modelResponse.json();
    console.log("[v0] ✅ Model prediction:", prediction);

    return NextResponse.json({
      success: true,
      prediction,
    });
  } catch (error) {
    console.error("[v0] 💥 Fatal analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image", details: String(error) },
      { status: 500 }
    );
  }
}
