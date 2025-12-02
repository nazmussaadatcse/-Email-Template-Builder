const PreviewActions = (function () {
    let titleEl, bodyEl, buttonEl, imageEl;

    function init() {
        titleEl = document.querySelector(".preview-title");
        bodyEl = document.querySelector(".preview-body");
        buttonEl = document.querySelector(".preview-button");
        imageEl = document.querySelector(".preview-image");
    }

    function updateTitle(e) { if(titleEl) titleEl.textContent = e.target.value || "Your Title Here"; }
    function updateBody(e) { if(bodyEl) bodyEl.textContent = e.target.value || "Your email body text will appear here."; }
    function updateButtonText(e) { if(buttonEl) buttonEl.textContent = e.target.value || "Button"; }
    function updateButtonLink(e) { if(buttonEl) buttonEl.href = e.target.value || "#"; }
    function updateImage(e) {
        if(!imageEl) return;
        const images = {
            img1: "https://via.placeholder.com/250?text=Image+1",
            img2: "https://via.placeholder.com/250?text=Image+2",
            img3: "https://via.placeholder.com/250?text=Image+3"
        };
        imageEl.src = images[e.target.value] || "";
    }

    return {
        init,
        updateTitle,
        updateBody,
        updateButtonText,
        updateButtonLink,
        updateImage
    };
})();
