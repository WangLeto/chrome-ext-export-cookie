const exportCookie = (domain) => {
  return new Promise((resolve) => {
    chrome.cookies.getAll(
      {
        domain: "coze.cn",
      },
      (res) => {
        const trans = formatCookies(res);
        resolve(trans);
      }
    );
  });
};

/**
 *
 * @param {{domain: string, name: string, path: string, value: string}[]} res
 */
const formatCookies = (res) => {
  const transformed = res.map((item) => ({
    name: item.name,
    value: item.value,
    domain: item.domain,
    path: item.path,
  }));
  return JSON.stringify(transformed, null, 2);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "get-cookie") {
    exportCookie(message.domain).then(sendResponse);
    return true;
  }
});
