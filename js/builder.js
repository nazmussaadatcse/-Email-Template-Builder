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

  const uploadWrapper = document.getElementById("uploadWrapper"); // REQUIRED
  let removeBtn = null;

  // global state
  let uploadedImageBase64 = "";

  // placeholder
  function setPlaceholder() {
    previewImage.src = "";
    previewImage.style.background = "#e5e7eb";
    previewImage.style.width = "100%";
    previewImage.style.height = "150px";
    previewImage.style.objectFit = "cover";
    hideRemoveBtn();
  }

  function hideRemoveBtn() {
    if (removeBtn) removeBtn.style.display = "none";
  }

  function showRemoveBtn() {
    if (!removeBtn) {
      removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove Image";
      removeBtn.id = "removeImageBtn";

      removeBtn.style.marginTop = "8px";
      removeBtn.style.padding = "2px 6px";
      removeBtn.style.background = "#ef4444";
      removeBtn.style.color = "#fff";
      removeBtn.style.border = "none";
      removeBtn.style.borderRadius = "4px";
      removeBtn.style.cursor = "pointer";

      previewImage.insertAdjacentElement("afterend", removeBtn);

      removeBtn.addEventListener("click", removeImage);
    }
    removeBtn.style.display = "inline-block";
  }

  // Remove image action
  function removeImage() {
    uploadedImageBase64 = "";
    imageSelect.value = "";
    imageUpload.value = "";
    uploadWrapper.style.display = "none";
    setPlaceholder();
  }

  // PREVIEW UPDATE
  function updatePreview() {
    previewTitle.textContent = titleInput.value || "Your Title Here";
    previewBody.textContent =
      bodyInput.value || "Your email body text will appear here.";
    previewButton.textContent = buttonTextInput.value || "Button";
    previewButton.href = buttonLinkInput.value || "#";

    updateImagePreview();
  }

  // IMAGE PREVIEW HANDLER
  function updateImagePreview() {
    if (uploadedImageBase64) {
      previewImage.src = uploadedImageBase64;
      previewImage.style.background = "transparent";
      showRemoveBtn();
      uploadWrapper.style.display = "block";
    } else if (imageSelect.value) {
      const images = {
        img1: "https://via.placeholder.com/400x150?text=Image+1",
        img2: "https://via.placeholder.com/400x150?text=Image+2",
        img3: "https://via.placeholder.com/400x150?text=Image+3",
      };

      previewImage.src = images[imageSelect.value];
      previewImage.style.background = "transparent";
      uploadWrapper.style.display = "block";
      showRemoveBtn();
    } else {
      setPlaceholder();
      uploadWrapper.style.display = "none";
    }
  }

  // EVENTS
  [titleInput, bodyInput, buttonTextInput, buttonLinkInput].forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  imageSelect.addEventListener("change", () => {
    uploadedImageBase64 = "";
    updatePreview();
  });

  imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
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

  setPlaceholder();
  updatePreview();
});
