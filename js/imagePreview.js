(function () {
  const imageSelect = document.getElementById("imageSelect");
  const imageUpload = document.getElementById("imageUpload");
  const previewImage = document.querySelector(".preview-image");

  let uploadedImageBase64 = "";

  // Default placeholder
  function setPlaceholder() {
    previewImage.src = "";
    previewImage.style.background = "#e5e7eb";
    previewImage.style.width = "100%";
    previewImage.style.height = "150px";
    previewImage.style.objectFit = "cover";
  }

  setPlaceholder();

  function updateImagePreview() {
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
  imageSelect.addEventListener("change", () => {
    uploadedImageBase64 = ""; // clear uploaded if dropdown changes
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
})();
