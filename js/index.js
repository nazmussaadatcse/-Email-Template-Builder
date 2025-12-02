document.addEventListener("DOMContentLoaded", () => {
  if (window.PreviewActions) PreviewActions.init();
  if (window.EditorActions) EditorActions.init();
  console.log("Email Template Builder initialized!");
});
