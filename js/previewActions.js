(function () {
  const imageSelect = document.getElementById("imageSelect");
  const imageUpload = document.getElementById("imageUpload");
  const previewImage = document.querySelector(".preview-image");

  let uploadedImageBase64 = "";
  let defaultWidth = 400;
  let defaultHeight = 200;

  // Initialize placeholder
  function setPlaceholder() {
    previewImage.src = "";
    previewImage.style.width = defaultWidth + "px";
    previewImage.style.height = defaultHeight + "px";
    previewImage.style.objectFit = "cover";
    previewImage.style.background =
      "#e5e7eb url('https://via.placeholder.com/400x200?text=Preview') center center no-repeat";
  }

  setPlaceholder();

  function updateImagePreview() {
    if (uploadedImageBase64) {
      previewImage.src = uploadedImageBase64;
      previewImage.style.background = "transparent";
    } else if (imageSelect.value) {
      const images = {
        img1: "https://via.placeholder.com/400x200?text=Image+1",
        img2: "https://via.placeholder.com/400x200?text=Image+2",
        img3: "https://via.placeholder.com/400x200?text=Image+3",
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
