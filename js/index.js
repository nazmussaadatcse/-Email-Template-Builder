document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  if (typeof RichTextEditor !== "undefined") {
    RichTextEditor.init();
  }
  if (typeof EditorActions !== "undefined") {
    EditorActions.init();
  }
  if (typeof PreviewActions !== "undefined") {
    PreviewActions.init();
  }

  console.log("Email Template Builder with Rich Text Editor initialized!");
});
