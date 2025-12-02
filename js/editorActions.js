// Editor -> Preview Live Update
(function () {
  // DOM Elements
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

  let uploadedImageBase64 = "";

  // Update Preview Function
  function updatePreview() {
    previewTitle.textContent = titleInput.value || "Your Title Here";
    previewBody.textContent =
      bodyInput.value || "Your email body text will appear here.";
    previewButton.textContent = buttonTextInput.value || "Button";
    previewButton.href = buttonLinkInput.value || "#";

    if (uploadedImageBase64) {
      previewImage.src = uploadedImageBase64;
      previewImage.style.display = "block";
    } else if (imageSelect.value) {
      // Sample images, replace with your paths or data URLs
      const images = {
        img1: "https://via.placeholder.com/400x150?text=Image+1",
        img2: "https://via.placeholder.com/400x150?text=Image+2",
        img3: "https://via.placeholder.com/400x150?text=Image+3",
      };
      previewImage.src = images[imageSelect.value];
      previewImage.style.display = "block";
    } else {
      previewImage.src = "";
      previewImage.style.display = "none";
    }
  }

  // Event listeners for live update
  [titleInput, bodyInput, buttonTextInput, buttonLinkInput].forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  imageSelect.addEventListener("change", () => {
    uploadedImageBase64 = ""; // reset uploaded image if user selects dropdown
    updatePreview();
  });

  imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      uploadedImageBase64 = evt.target.result;
      updatePreview();
    };
    reader.readAsDataURL(file);
  });

  // Initial render
  updatePreview();
})();
