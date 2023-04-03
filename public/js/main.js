(function () {
  const form = document.querySelector("#url-form");
  const input = document.querySelector("#url-input");
  const aliasInput = document.querySelector("#alias");
  const output = document.querySelector("#output");
  const shortUrl = document.querySelector("#short-url");
  const h3 = document.querySelector("#h3");
  const redo = document.querySelector("#redo");
  const shortenBTN = document.querySelector("#shorten");
  var toggle = document.getElementById("toggle-switch");
  var custom_title = document.getElementById("custom");
  var toggle_contain = document.getElementById("toggle_contain");
  const shortenedUrl = document.getElementById("short-url");
  const copyLinkButton = document.getElementById("copy-link");

  toggle.addEventListener("change", function () {
    if (this.checked) {
      aliasInput.style.display = "block";
      custom_title.style.display = "block";
    } else {
      $("#alias").hide();
      $("#custom").hide();
    }
  });

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

  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  aliasInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  redo.addEventListener("click", async (event) => {
    event.preventDefault();
    location.reload();
  });

  shortenBTN.addEventListener("click", async (event) => {
    event.preventDefault();
    shortenBTN.textContent = "Loading... Please Wait";

    $("#toggle_contain").hide();
    $("#toggle-switch").hide();
    const url = input.value;
    const alias = aliasInput.value;
    var ip = await getPublicIp();

    if (valid(url)) {
      if (!alias) {
        const response = await fetch(
          `/shorten?url=${encodeURIComponent(
            url
          )}&ip=${ip}`
        );

        const shortId = await response.text();
        const shortUrlString = `${window.location.href}${shortId}`;

        if (
          shortId === "THIS alias isn't available" ||
          shortId === "Invalid Alias"
        ) {
          shortUrl.textContent = shortId;
          output.style.display = "inline-block";
          $("#copy-link").hide();

          $("#redo").hide();
          $("#h3").hide();

          $("#shorten").hide();
          $("#toggle_contain").hide();
          $("#toggle-switch").hide();
        } else {
          copyLinkButton.style.display = "inline-block";
          shortUrl.textContent = shortUrlString;
          output.style.display = "inline-block";
          redo.style.display = "inline-block";
          $("#shorten").hide();
          $("#toggle_contain").hide();
          $("#toggle-switch").hide();
        }
      } else {
        const response = await fetch(
          `/shorten?url=${encodeURIComponent(
            url
          )}&alias=${alias}&ip=${ip}`
        );

        const shortId = await response.text();
        const shortUrlString = `${window.location.href}${shortId}`;

        if (
          shortId === "THIS alias isn't available" ||
          shortId === "Invalid Alias"
        ) {
          shortUrl.textContent = shortId;
          output.style.display = "inline-block";

          $("#redo").hide();
          $("#copy-link").hide();
          $("#h3").hide();

          $("#shorten").hide();
          $("#toggle_contain").hide();
          $("#toggle-switch").hide();
        } else {
          copyLinkButton.style.display = "inline-block";
          shortUrl.textContent = shortUrlString;
          output.style.display = "inline-block";
          redo.style.display = "inline-block";

          $("#shorten").hide();
          $("#toggle_contain").hide();
          $("#toggle-switch").hide();
        }
      }
    } else {
      $("#h3").hide();
      $("#copy-link").hide();
      $("#shorten").hide();
      shortUrl.textContent = "Invalid URL";
      output.style.display = "inline-block";
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    copyLinkButton.addEventListener("click", () => {
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
})();
