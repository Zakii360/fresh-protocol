import axios from "axios";
import cheerio from "cheerio";

async function fetchAndConvert(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    // Remove junk
    $("script, style, nav, footer, header, aside").remove();

    const title = $("title").text() || "No title";

    // Grab main text (basic version)
    let content = "";
    $("p").each((i, el) => {
      content += $(el).text() + "\n";
    });

    // Grab links
    const links = [];
    $("a").each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr("href");

      if (text && href) {
        links.push({ text, href });
      }
    });

    const fresh = {
      protocol: "FRESH/1.0",
      source: url,
      title,
      content: content.trim(),
      links
    };

    return fresh;
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// CLI usage
const input = process.argv[2];

if (!input) {
  console.log("Usage: node index.js https://example.com");
} else {
  fetchAndConvert(input).then(data => {
    console.log(JSON.stringify(data, null, 2));
  });
}
