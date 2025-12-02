document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const titleInput = document.getElementById("titleInput");
  const bodyInput = document.getElementById("bodyInput");
  const buttonTextInput = document.getElementById("buttonTextInput");
  const buttonLinkInput = document.getElementById("buttonLinkInput");
  const imageSelect = document.getElementById("imageSelect");
  const imageUpload = document.getElementById("imageUpload");
  const resetBtn = document.getElementById("resetBtn");

  const previewTitle = document.querySelector(".preview-title");
  const previewBody = document.querySelector(".preview-body");
  const previewButton = document.querySelector(".preview-button");
  const previewImage = document.querySelector(".preview-image");

  // state
  let uploadedImageBase64 = "";

  // default placeholder
  function setPlaceholder() {
    previewImage.src = "";
    previewImage.style.background = "#e5e7eb";
    previewImage.style.width = "100%";
    previewImage.style.height = "150px";
    previewImage.style.objectFit = "cover";
  }

  setPlaceholder();

  // update preview function
  function updatePreview() {
    previewTitle.textContent = titleInput.value || "Your Title Here";
    previewBody.textContent =
      bodyInput.value || "Your email body text will appear here.";
    previewButton.textContent = buttonTextInput.value || "Button";
    previewButton.href = buttonLinkInput.value || "#";

    if (uploadedImageBase64) {
      previewImage.src = uploadedImageBase64;
      previewImage.style.background = "transparent";
    } else if (imageSelect.value) {
      const images = {
        img1: "https://via.placeholder.com/400x150?text=Image+1",
        img2: "https://via.placeholder.com/400x150?text=Image+2",
        img3: "https://via.placeholder.com/400x150?text=Image+3",
      };
      previewImage.src = images[imageSelect.value];
      previewImage.style.background = "transparent";
    } else {
      setPlaceholder();
    }
  }

  // Events
  [titleInput, bodyInput, buttonTextInput, buttonLinkInput].forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  imageSelect.addEventListener("change", () => {
    uploadedImageBase64 = ""; // clear uploaded if dropdown changes
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

  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset all fields?")) return;

    titleInput.value = "";
    bodyInput.value = "";
    buttonTextInput.value = "";
    buttonLinkInput.value = "";
    imageSelect.value = "";
    imageUpload.value = "";
    uploadedImageBase64 = "";

    updatePreview();
  });

  // initial render
  updatePreview();
});
