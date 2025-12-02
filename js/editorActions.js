(function () {
  const titleInput = document.getElementById("titleInput");
  const bodyInput = document.getElementById("bodyInput");
  const buttonTextInput = document.getElementById("buttonTextInput");
  const buttonLinkInput = document.getElementById("buttonLinkInput");

  const previewTitle = document.querySelector(".preview-title");
  const previewBody = document.querySelector(".preview-body");
  const previewButton = document.querySelector(".preview-button");

  function updateTextPreview() {
    previewTitle.textContent = titleInput.value || "Your Title Here";
    previewBody.textContent =
      bodyInput.value || "Your email body text will appear here.";
    previewButton.textContent = buttonTextInput.value || "Button";
    previewButton.href = buttonLinkInput.value || "#";
  }

  [titleInput, bodyInput, buttonTextInput, buttonLinkInput].forEach((el) => {
    el.addEventListener("input", updateTextPreview);
  });

  // initial render
  updateTextPreview();
})();
