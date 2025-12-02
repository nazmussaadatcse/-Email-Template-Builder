const EditorActions = (function () {
  let titleInput, bodyInput, btnTextInput, btnLinkInput, imageSelect;

  function init() {
    titleInput = document.getElementById("titleInput");
    bodyInput = document.getElementById("bodyInput");
    btnTextInput = document.getElementById("buttonTextInput");
    btnLinkInput = document.getElementById("buttonLinkInput");
    imageSelect = document.getElementById("imageSelect");

    if (titleInput)
      titleInput.addEventListener("input", PreviewActions.updateTitle);
    if (bodyInput)
      bodyInput.addEventListener("input", PreviewActions.updateBody);
    if (btnTextInput)
      btnTextInput.addEventListener("input", PreviewActions.updateButtonText);
    if (btnLinkInput)
      btnLinkInput.addEventListener("input", PreviewActions.updateButtonLink);
    if (imageSelect)
      imageSelect.addEventListener("change", PreviewActions.updateImage);
  }

  return { init };
})();
