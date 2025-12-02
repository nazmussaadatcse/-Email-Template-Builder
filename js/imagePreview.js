(function () {
  const imageSelect = document.getElementById("imageSelect");
  const imageUpload = document.getElementById("imageUpload");
  const previewImage = document.querySelector(".preview-image");

  let uploadedImageBase64 = "";
  let removeBtn = null;

  // Disable upload initially
  imageUpload.disabled = true;

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
      removeBtn.type = "button";
      removeBtn.id = "removeImageBtn";
      removeBtn.textContent = "Remove Image";
      removeBtn.style.marginTop = "8px";
      removeBtn.style.display = "inline-block";
      removeBtn.style.padding = "6px 12px";
      removeBtn.style.border = "1px solid #ef4444";
      removeBtn.style.background = "#ef4444";
      removeBtn.style.color = "white";
      removeBtn.style.borderRadius = "6px";
      removeBtn.style.cursor = "pointer";

      previewImage.insertAdjacentElement("afterend", removeBtn);

      removeBtn.addEventListener("click", () => {
        uploadedImageBase64 = "";
        imageSelect.value = "";
        imageUpload.value = "";
        imageUpload.disabled = true; // disable upload again
        setPlaceholder();
      });
    } else {
      removeBtn.style.display = "inline-block";
    }
  }

  function updateImagePreview() {
    if (uploadedImageBase64) {
      previewImage.src = uploadedImageBase64;
      previewImage.style.background = "transparent";
      showRemoveBtn();
    } else if (imageSelect.value) {
      const images = {
        img1: "https://via.placeholder.com/400x150?text=Image+1",
        img2: "https://via.placeholder.com/400x150?text=Image+2",
        img3: "https://via.placeholder.com/400x150?text=Image+3",
      };
      previewImage.src = images[imageSelect.value];
      previewImage.style.background = "transparent";
      showRemoveBtn();

      // Enable upload now
      imageUpload.disabled = false;
    } else {
      setPlaceholder();
      imageUpload.disabled = true;
    }
  }

  // Events
  imageSelect.addEventListener("change", () => {
    uploadedImageBase64 = ""; // clear any uploaded image
    updateImagePreview();
  });

  imageUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
      uploadedImageBase64 = evt.target.result;
      updateImagePreview();
    };
    reader.readAsDataURL(file);
  });

  setPlaceholder();
})();
