(function () {
  const resetBtn = document.getElementById("resetBtn");

  const titleInput = document.getElementById("titleInput");
  const bodyInput = document.getElementById("bodyInput");
  const buttonTextInput = document.getElementById("buttonTextInput");
  const buttonLinkInput = document.getElementById("buttonLinkInput");
  const imageSelect = document.getElementById("imageSelect");
  const imageUpload = document.getElementById("imageUpload");

  const previewTitle = document.querySelector(".preview-title");
  const previewBody = document.querySelector(".preview-body");
  const previewButton = document.querySelector(".preview-button");
  const previewImage = document.querySelector(".preview-image");

  let uploadedImageBase64 = ""; // need to reset uploaded image

  function setPlaceholder() {
    previewImage.src = "";
    previewImage.style.background = "#e5e7eb";
    previewImage.style.width = "100%";
    previewImage.style.height = "150px";
    previewImage.style.objectFit = "cover";
  }

  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset all fields?")) return;

    titleInput.value = "";
    bodyInput.value = "";
    buttonTextInput.value = "";
    buttonLinkInput.value = "";
    imageSelect.value = "";
    imageUpload.value = "";
    uploadedImageBase64 = "";

    previewTitle.textContent = "Your Title Here";
    previewBody.textContent = "Your email body text will appear here.";
    previewButton.textContent = "Button";
    previewButton.href = "#";

    setPlaceholder();
  });
})();
