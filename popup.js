const input = document.querySelector("#domain-input");
const button = document.querySelector("#download-button");

const getToast = () => {
  const showToast = (text, success) => {
    const div = document.createElement("div");
    const background = success ? "lightgreen" : "lightred";
    div.innerHTML = `
    <p style="background: ${background}">${text}</p>
    `;
    document.body.appendChild(div);
    setTimeout(() => {
      document.body.removeChild(div);
    }, 4000);
  };
  const api = {
    success: (text) => showToast(text, true),
    fail: (text) => showToast(text, false),
  };
  return api;
};

button.addEventListener("click", () => {
  const domain = input.value;
  chrome.runtime.sendMessage({ type: "get-cookie", domain }, (res) => {
    downloadAsFile(domain, res);
  });
});

const downloadAsFile = (domain, textData) => {
  const blob = new Blob([textData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const filename = `${domain}.json`;

  chrome.downloads.download(
    {
      url,
      filename,
      saveAs: false,
    },
    (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        console.log("Download started with ID:", downloadId);
        getToast().success("已下载：" + filename + "，八成在下载文件夹");
      }
    }
  );
};
