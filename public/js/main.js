(function () {
  const form = document.querySelector("#url-form");
  const input = document.querySelector("#url-input");
  const aliasInput = document.querySelector("#alias");
  const output = document.querySelector("#output");
  const shortUrl = document.querySelector("#short-url");
  const h3 = document.querySelector("#h3");
  const redo = document.querySelector("#redo");
  const undo = document.querySelector("#undo");
  const shortenBTN = document.querySelector("#shorten");
  var toggle = document.getElementById("toggle-switch");
  var custom_title = document.getElementById("custom");
  var toggle_contain = document.getElementById("toggle_contain");
  const shortenedUrl = document.getElementById("short-url");
  const showAccessKeyBTN = document.getElementById("showAccessKeyBTN");
  const copyLinkButton = document.getElementById("copy-link");
  const delete_URL = document.getElementById("delete_URL");

  toggle.addEventListener("change", function () {
    if (this.checked) {
      aliasInput.style.display = "block";
      custom_title.style.display = "block";
    } else {
      $("#alias").hide();
      $("#custom").hide();
    }
  });

  delete_URL.addEventListener("click", async (event) => {
    event.preventDefault();
    Swal.fire({
      background: "black",
      html: `<h1 style="color:white">Enter the URL access key</h1>`,
      input: "text",
      inputPlaceholder: "URL access key",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter the URL Access Key";
        }
      },
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          background: "#000",
          icon: "warning",
          position: "center",
          title: "Delete?",
          html: `<h3 style="color:white">Delete the URL?</h3>`,
          confirmButtonText: "Yes, delete the URL",
          showCancelButton: true,
          cancelButtonText: `No`,
        }).then((confirmation) => {
          if (confirmation.isConfirmed) {
            delete_url(result.value);
          }
        });
      }
    });
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
    $("#delete_URL").hide();
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

        const shortId = JSON.parse(
          JSON.stringify(await response.json(), null, 4)
        );
        const accessKey = shortId.accessKey;
        const shortUrlString = `${window.location.href}${shortId.shortId}`;

        showAccessKeyBTN.addEventListener("click", async (event) => {
          Swal.fire({
            background: "#000",
            icon: "success",
            position: "center",
            title: "Access Key",
            html: `<h3 style="color:white">${accessKey}</h3><br> <h3 style="color:white">Note: Don't give this access key if you don't want anyone to use and delete the URL.</h3>`,
          });
        });

        undo.addEventListener("click", async (event) => {
          Swal.fire({
            background: "#000",
            icon: "warning",
            position: "center",
            title: "Delete?",
            html: `<h3 style="color:white">Delete the URL?</h3>`,
            confirmButtonText: "Yes, delete the URL",
            showCancelButton: true,
            cancelButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              delete_url(accessKey);
            }
          });
        });

        if (
          shortId === "THIS alias isn't available" ||
          shortId === "Invalid Alias"
        ) {
          shortUrl.textContent = shortId;
          output.style.display = "inline-block";
          $("#copy-link").hide();
          $("#redo").hide();
          $("#undo").hide();
          $("#h3").hide();
          $("#showAccessKeyBTN").hide();
          $("#shorten").hide();
          $("#toggle_contain").hide();
          $("#toggle-switch").hide();
        } else {
          copyLinkButton.style.display = "inline-block";
          shortUrl.textContent = shortUrlString;
          output.style.display = "inline-block";
          redo.style.display = "inline-block";
          undo.style.display = "inline-block";
          showAccessKeyBTN.style.display = "inline-block";
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

        const shortId = JSON.parse(
          JSON.stringify(await response.json(), null, 4)
        );
        const accessKey = shortId.accessKey;
        const shortUrlString = `${window.location.href}${shortId.shortId}`;

        if (
          shortId === "THIS alias isn't available" ||
          shortId === "Invalid Alias"
        ) {
          shortUrl.textContent = shortId;
          output.style.display = "inline-block";
          $("#redo").hide();
          $("#undo").hide();
          $("#copy-link").hide();
          $("#h3").hide();
          $("#showAccessKeyBTN").hide();
          $("#shorten").hide();
          $("#toggle_contain").hide();
          $("#toggle-switch").hide();
        } else {
          copyLinkButton.style.display = "inline-block";
          shortUrl.textContent = shortUrlString;
          output.style.display = "inline-block";
          showAccessKeyBTN.style.display = "inline-block";
          redo.style.display = "inline-block";
          undo.style.display = "inline-block";
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

  function delete_url(x) {
    axios
      .delete(`/short/delete?accessKey=${x}`)
      .then((response) => {
        Swal.fire({
          background: "#000",
          icon: "success",
          position: "center",
          title: "URL Deleted!",
          html: `<h3 style="color:white">${response.data.status}</h3></h3>`,
        }).then((result) => {
          redo.click();
        });
      })
      .catch((error) => {
        Swal.fire({
          background: "#000",
          icon: "error",
          position: "center",
          title: "Error!",
          html: `<h3 style="color:white">${error}</h3> <br> <h3 style="color:white">This Error may be because of an invalid access key.</h3>`,
        });
      });
  }
})();
