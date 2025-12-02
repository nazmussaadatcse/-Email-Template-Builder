const PreviewActions = (function () {
  let titleEl, bodyEl, buttonEl, imageEl;
  let uploadedImage = "";

  function init() {
    titleEl = document.querySelector(".preview-title");
    bodyEl = document.querySelector(".preview-body");
    buttonEl = document.querySelector(".preview-button");
    imageEl = document.querySelector(".preview-image");
  }

  function updateTitle(val) {
    if (titleEl) titleEl.textContent = val || "Your Title Here";
  }
  function updateBody(val) {
    if (bodyEl)
      bodyEl.textContent = val || "Your email body text will appear here.";
  }
  function updateButtonText(val) {
    if (buttonEl) buttonEl.textContent = val || "Button";
  }
  function updateButtonLink(val) {
    if (buttonEl) buttonEl.href = val || "#";
  }
  function updateImageSrc(src) {
    if (imageEl) imageEl.src = src || "";
    uploadedImage = src || "";
  }

  function getLastHtml() {
    return `
      <div style="text-align:center;">
        <h3>${titleEl.textContent}</h3>
        <img src="${uploadedImage}" style="max-width:100%;border-radius:6px;" />
        <p>${bodyEl.textContent}</p>
        <a href="${buttonEl.href}" target="_blank">${buttonEl.textContent}</a>
      </div>
    `;
  }

  return {
    init,
    updateTitle,
    updateBody,
    updateButtonText,
    updateButtonLink,
    updateImageSrc,
    getLastHtml,
  };
})();
