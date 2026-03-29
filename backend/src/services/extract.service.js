import axios from "axios";
import * as cheerio from "cheerio";

// ================== DETECT TYPE ==================
export const detectType = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "tweet";
  if (url.includes(".pdf")) return "pdf";
  return "article";
};

// ================== YOUTUBE ==================
const getYouTubeId = (url) => {
  const match = url.match(/(?:youtu\.be\/|v=)([^?&]+)/);
  return match ? match[1] : null;
};

export const extractYouTube = async (url) => {
  try {
    const match = url.match(/(?:youtu\.be\/|v=)([^?&]+)/);
    const videoId = match ? match[1] : null;

    if (!videoId) throw new Error("Invalid YouTube URL");

    // ✅ ALWAYS WORKING THUMBNAIL
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    let title = "YouTube Video";

    // Try to get real title
    try {
      const res = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );

      if (res.data?.title) {
        title = res.data.title;
      }
    } catch (err) {
      console.log("oembed failed, using fallback");
    }

    return {
      title,
      thumbnail,
      description: title,
      content: title,
    };

  } catch (err) {
    console.error("YouTube extraction failed:", err.message);

    return {
      title: "YouTube Video",
      thumbnail: "",
      description: "",
      content: "",
    };
  }
}

// ================== ARTICLE ==================
export const extractArticle = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 8000, // reduced timeout (faster fail)
    });

    const $ = cheerio.load(data);

    const title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text() ||
      "Untitled";

    //  THUMBNAIL 
    let thumbnail =
      $("meta[property='og:image']").attr("content") ||
      $("meta[name='twitter:image']").attr("content") ||
      $("img").first().attr("src") ||
      "";

    // Fix relative URL
    if (thumbnail && thumbnail.startsWith("/")) {
      const base = new URL(url).origin;
      thumbnail = base + thumbnail;
    }

    let content = "";
    $("p").each((i, el) => {
      content += $(el).text() + " ";
    });

    return {
      title,
      content: content.slice(0, 2000),
      thumbnail,
    };
  } catch (error) {
    console.error("Extraction failed:", error.message);

    return {
      title: "Content unavailable",
      content: "",
      thumbnail: "",
    };
  }
};



// ================== TWEET ==================
export const extractTweet = async (url) => {
  try {
    const res = await axios.get(
      `https://publish.twitter.com/oembed?url=${url}`
    );

    const html = res.data.html;

    // 🔥 EXTRACT IMAGE FROM HTML
    const imgMatch = html.match(/src="(https:\/\/pbs.twimg.com[^"]+)"/);

    const image = imgMatch ? imgMatch[1] : "";

    return {
      title: "Tweet",
      content: html,
      thumbnail: image, 
    };

  } catch (error) {
    console.error("Tweet extraction failed:", error.message);

    return {
      title: "Tweet",
      content: "",
      thumbnail: "",
    };
  }
};

// ================== PDF ==================
export const extractPDF = async (url) => {
  try {
    let fileUrl = url;

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
      content: data.text.slice(0, 1000),
      description: data.text.slice(0, 200),
      thumbnail: "",
    };
  } catch (error) {
    console.error("PDF extraction failed:", error.message);

    return {
      title: "PDF Document",
      content: "",
      thumbnail: "",
    };
  }
};