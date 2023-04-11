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
  const toggle = document.getElementById("toggle-switch");
  const custom_title = document.getElementById("custom");
  const toggle_contain = document.getElementById("toggle_contain");
  const shortenedUrl = document.getElementById("short-url");
  const showAccessKeyBTN = document.getElementById("showAccessKeyBTN");
  const copyLinkButton = document.getElementById("copy-link");
  const delete_URL = document.getElementById("delete_URL");
  const download = document.getElementById("download");

  const now = new Date();
  const date = now.toUTCString(); // GMT timezone

  toggle.addEventListener("change", function () {
    if (this.checked) {
      aliasInput.style.display = "block";
      custom_title.style.display = "block";
    } else {
      aliasInput.value = "";
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
      showCancelButton: true,
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

  function getDateTimeString() {
    const d = new Date();
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0];
    return `${date}-${time}`;
  }

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
    try {
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
            )}&ip=${ip}&date=${date}`
          );

          const res = JSON.parse(
            JSON.stringify(await response.json(), null, 4)
          );
          const accessKey = res.accessKey;
          const shortId = res.shortId;
          const shortUrlString = `${window.location.href}${res.shortId}`;

          download.addEventListener("click", async (event) => {
            let a = document.createElement("a");
            let download = [res.shortId, res.accessKey, res.shortened_url, res.original_url];
            a.href =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(download, null, 1));
            a.download = "Saved-URL_" + getDateTimeString() + ".txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          });

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
            shortId === "Invalid Alias" ||
            shortId === "Invalid URL"
          ) {
            shortUrl.textContent = shortId;
            output.style.display = "inline-block";
            $("#copy-link").hide();
            $("#redo").hide();
            $("#download").hide();
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
            download.style.display = "inline-block";
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
            )}&alias=${alias}&date=${date}&ip=${ip}`
          );

          const res = JSON.parse(
            JSON.stringify(await response.json(), null, 4)
          );
          const accessKey = res.accessKey;
          const shortId = res.shortId;
          const shortUrlString = `${window.location.href}${res.shortId}`;

          showAccessKeyBTN.addEventListener("click", async (event) => {
            Swal.fire({
              background: "#000",
              icon: "success",
              position: "center",
              title: "Access Key",
              html: `<h3 style="color:white">${accessKey}</h3><br> <h3 style="color:white">Note: Don't give this access key if you don't want anyone to use and delete the URL.</h3>`,
            });
          });

          download.addEventListener("click", async (event) => {
            let a = document.createElement("a");
            let download = [res.shortId, res.accessKey, res.shortened_url, res.original_url];
            a.href =
              "data:text/json;charset=utf-8," +
              encodeURIComponent(JSON.stringify(download, null, 1));
            a.download = "Saved-URL_" + getDateTimeString() + ".txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
            shortId === "Invalid Alias" ||
            shortId === "Invalid URL"
          ) {
            shortUrl.textContent = shortId;
            output.style.display = "inline-block";
            $("#redo").hide();
            $("#download").hide();
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
            download.style.display = "inline-block";
            $("#shorten").hide();
            $("#toggle_contain").hide();
            $("#toggle-switch").hide();
          }
        }
      } else {
        $("#copy-link").hide();
        $("#redo").hide();
        $("#download").hide();
        $("#undo").hide();
        $("#h3").hide();
        $("#showAccessKeyBTN").hide();
        $("#shorten").hide();
        $("#toggle_contain").hide();
        $("#toggle-switch").hide();
        shortUrl.textContent = "Invalid URL";
        output.style.display = "inline-block";
      }
    } catch (err) {
      Swal.fire({
        background: "#000",
        icon: "error",
        position: "center",
        title: "ERROR",
        html: `<h3 style="color:white">${err}</h3>`,
      });
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
          html: `<h3 style="color:white">${response.data.status}</h3>`,
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
