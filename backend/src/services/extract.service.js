import axios from "axios";
import * as cheerio from "cheerio";



// Detect type

export const detectType = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "youtube";
  }

  if (url.includes("twitter.com") || url.includes("x.com")) {
    return "tweet";
  }

  if (url.includes(".pdf")) {
    return "pdf";
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
  title: `YouTube Video ${videoId}`,
  content: `YouTube video with id ${videoId}`,
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


// extract Twit
export const extractTweet = async (url) => {
  try {
    return {
      title: "Tweet",
      content: `Tweet from ${url}`,
    };
  } catch (error) {
    console.error("Tweet extraction failed:", error.message);

    return {
      title: "Tweet",
      content: "",
    };
  }
};

// extract PDF

export const extractPDF = async (url) => {
  try {
    let fileUrl = url;

    // 🔥 Convert Google Drive URL to direct download
    if (url.includes("drive.google.com")) {
      const fileId = url.split("/d/")[1]?.split("/")[0];
      fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
    });

    const pdfParse = (await import("pdf-parse")).default;

    const data = await pdfParse(response.data);

    return {
      title: "PDF Document",
      content: data.text.slice(0, 3000),
    };
  } catch (error) {
    console.error("PDF extraction failed:", error.message);

    return {
      title: "PDF Document",
      content: "",
    };
  }
};




