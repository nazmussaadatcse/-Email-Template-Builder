const EditorActions = (function () {
  const titleInput = document.getElementById("titleInput");
  const buttonTextInput = document.getElementById("buttonTextInput");
  const buttonLinkInput = document.getElementById("buttonLinkInput");

  const previewTitle = document.querySelector(".preview-title");
  const previewButton = document.querySelector(".preview-button");

  function updateTextPreview() {
    previewTitle.textContent = titleInput.value || "Your Title Here";
    previewButton.textContent = buttonTextInput.value || "Button";
    previewButton.href = buttonLinkInput.value || "#";
  }

  [titleInput, buttonTextInput, buttonLinkInput].forEach((el) => {
    el.addEventListener("input", updateTextPreview);
  });

  // initial render
  updateTextPreview();

  // Public API
  return {
    init: function () {
      // Initialization if needed
      updateTextPreview();
    },
  };
})();
