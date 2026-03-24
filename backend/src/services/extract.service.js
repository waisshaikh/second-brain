import axios from "axios";
import * as cheerio from "cheerio";
// Detect type
export const detectType = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  if (url.includes("drive.google.com")) {
    return "file";
  }

  return "article";
};

// YOUTUBE EXTRACTION
export const extractYouTube = async (url) => {
  let videoId = "";

  if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else {
    videoId = url.split("v=")[1]?.split("&")[0];
  }

  return {
    title: "YouTube Video",
    thumbnail: videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "",
  };
};

// ARTICLE EXTRACTION
export const extractArticle = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const title = $("title").text() || "Untitled";

    let content = "";
    $("p").each((i, el) => {
      content += $(el).text() + " ";
    });

    return {
      title,
      content: content.slice(0, 3000),
    };
  } catch (error) {
    console.error("Extraction failed:", error.message);

    return {
      title: "Content unavailable",
      content: "",
    };
  }
};