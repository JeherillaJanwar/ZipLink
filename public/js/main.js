const form = document.querySelector("#url-form");
const input = document.querySelector("#url-input");
const aliasInput = document.querySelector("#alias");
const output = document.querySelector("#output");
const shortUrl = document.querySelector("#short-url");
const h3 = document.querySelector("#h3");

function valid(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

async function getPublicIp() {
  const response = await fetch("https://api.ipify.org/?format=json");
  const data = await response.json();
  return data.ip;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const copyLinkButton = document.getElementById("copy-link");
  const url = input.value;
  const alias = aliasInput.value;
  var ip = await getPublicIp();

  if (valid(url)) {
    if (!alias) {
      const response = await fetch(
        `/shorten?url=${encodeURIComponent(url)}&ip=${ip}`
      );
      const shortId = await response.text();
      const shortUrlString = `${window.location.href}${shortId}`;

      if (shortId === "THIS alias isn't available") {
        shortUrl.textContent = shortId;
        output.style.display = "inline-block";
        copyLinkButton.style.display = "none";
        h3.style.display = "none";
      } else {
        copyLinkButton.textContent = "Copy";
        copyLinkButton.style.display = "inline-block";
        shortUrl.textContent = shortUrlString;
        output.style.display = "inline-block";
      }
    } else {
      const response = await fetch(
        `/shorten?url=${encodeURIComponent(url)}&alias=${alias}&ip=${ip}`
      );
      const shortId = await response.text();
      const shortUrlString = `${window.location.href}${shortId}`;

      if (shortId === "THIS alias isn't available") {
        shortUrl.textContent = shortId;
        h3.style.display = "none";
        output.style.display = "inline-block";
        copyLinkButton.style.display = "none";
      } else {
        copyLinkButton.textContent = "Copy";
        copyLinkButton.style.display = "inline-block";
        shortUrl.textContent = shortUrlString;
        output.style.display = "inline-block";
      }
    }
  } else {
    h3.style.display = "none";
    copyLinkButton.style.display = "none";
    shortUrl.textContent = "Invalid URL";
    output.style.display = "inline-block";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const copyLinkButton = document.getElementById("copy-link");

  copyLinkButton.addEventListener("click", () => {
    const shortenedUrl = document.getElementById("short-url");
    copyToClipboard(shortenedUrl);
    copyLinkButton.textContent = "Link Copied!";
  });
});

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text.innerHTML)
    .then(() => {
      console.log(`Copied "${text}" to clipboard`);
    })
    .catch((error) => {
      console.error(`Failed to copy "${text}" to clipboard: ${error}`);
    });
}