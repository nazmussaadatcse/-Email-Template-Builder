// builder.js - Complete Email Builder with Rich Text Editor
let uploadedImageBase64 = "";

document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const titleInput = document.getElementById("titleInput");
  const buttonTextInput = document.getElementById("buttonTextInput");
  const buttonLinkInput = document.getElementById("buttonLinkInput");
  const imageSelect = document.getElementById("imageSelect");
  const imageUpload = document.getElementById("imageUpload");
  const resetBtn = document.getElementById("resetBtn");
  const saveTemplateBtn = document.getElementById("saveTemplateBtn");
  const templateNameInput = document.getElementById("templateName");
  const charCount = document.getElementById("charCount");

  const previewTitle = document.querySelector(".preview-title");
  const previewBody = document.querySelector(".preview-body");
  const previewButton = document.querySelector(".preview-button");
  const previewImage = document.querySelector(".preview-image");

  const uploadWrapper = document.getElementById("uploadWrapper");
  let removeBtn = null;

  // Rich text editor state
  let richTextEditor = null;
  let hiddenTextarea = null;
  let lastSelection = null;

  // Link dialog state
  let linkDialog = null;
  let linkUrlInput = null;
  let linkTextInput = null;

  // ============ IMAGE FUNCTIONS ============

  function setPlaceholder() {
    previewImage.src = "";
    previewImage.className = "preview-image placeholder";
    hideRemoveBtn();
  }

  function hideRemoveBtn() {
    const removeBtn = document.getElementById("removeImageBtn");
    if (removeBtn) {
      removeBtn.style.display = "none";
    }
  }

  // download button event listener
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    console.log("Adding download button listener in builder.js");
    downloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("Download button clicked from builder.js");

      // Call template manager download function
      if (
        window.templateManager &&
        window.templateManager.downloadCurrentTemplate
      ) {
        window.templateManager.downloadCurrentTemplate();
      } else {
        console.error("Template manager not available");
        alert("Template manager not available. Please save a template first.");
      }
    });
  } else {
    console.error("Download button not found!");
  }

  function showRemoveBtn() {
    // Check if button already exists
    let removeBtn = document.getElementById("removeImageBtn");

    if (!removeBtn) {
      removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove Image";
      removeBtn.id = "removeImageBtn";
      removeBtn.className = "btn-remove-image";

      // Add after the preview image
      const previewImage = document.querySelector(".preview-image");
      if (previewImage && previewImage.parentNode) {
        previewImage.parentNode.insertBefore(
          removeBtn,
          previewImage.nextSibling
        );
      } else {
        previewImage.insertAdjacentElement("afterend", removeBtn);
      }

      removeBtn.addEventListener("click", removeImage);
    }

    // Always show it
    removeBtn.style.display = "block";

    // Update the global reference
    window.removeBtnRef = removeBtn;
  }

  function removeImage() {
    uploadedImageBase64 = "";
    imageSelect.value = "";
    imageUpload.value = "";
    uploadWrapper.style.display = "none";
    setPlaceholder();
  }

  // ============ RICH TEXT EDITOR FUNCTIONS ============

  function setupRichTextEditor() {
    // Get the form group for body text
    const formGroup = document.querySelector(
      '.form-group label[for="bodyInput"]'
    ).parentElement;
    hiddenTextarea = document.getElementById("bodyInput");

    if (!formGroup || !hiddenTextarea) return;

    // Create toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "rich-text-toolbar";
    toolbar.innerHTML = `
      <button type="button" class="toolbar-btn" data-command="bold" title="Bold">
        <i class="fas fa-bold"></i>
      </button>
      <button type="button" class="toolbar-btn" data-command="italic" title="Italic">
        <i class="fas fa-italic"></i>
      </button>
      <button type="button" class="toolbar-btn" data-command="underline" title="Underline">
        <i class="fas fa-underline"></i>
      </button>
      <div class="toolbar-separator"></div>
      <button type="button" class="toolbar-btn" data-command="justifyLeft" title="Align Left">
        <i class="fas fa-align-left"></i>
      </button>
      <button type="button" class="toolbar-btn" data-command="justifyCenter" title="Center">
        <i class="fas fa-align-center"></i>
      </button>
      <button type="button" class="toolbar-btn" data-command="justifyRight" title="Align Right">
        <i class="fas fa-align-right"></i>
      </button>
      <div class="toolbar-separator"></div>
      <select class="font-select" id="fontFamilySelect" title="Font Family">
        <option value="">Font</option>
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times</option>
        <option value="Courier New">Courier</option>
        <option value="Verdana">Verdana</option>
      </select>
      <select class="font-select" id="fontSizeSelect" title="Font Size">
        <option value="">Size</option>
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="28px">28px</option>
        <option value="32px">32px</option>
      </select>
      <div class="toolbar-separator"></div>
      <button type="button" class="toolbar-btn" data-command="insertUnorderedList" title="Bullet List">
        <i class="fas fa-list-ul"></i>
      </button>
      <button type="button" class="toolbar-btn" data-command="insertOrderedList" title="Numbered List">
        <i class="fas fa-list-ol"></i>
      </button>
      <button type="button" class="toolbar-btn" id="insertLinkBtn" title="Insert Link">
        <i class="fas fa-link"></i>
      </button>
      <button type="button" class="toolbar-btn" id="removeLinkBtn" title="Remove Link">
        <i class="fas fa-unlink"></i>
      </button>
      <div class="toolbar-separator"></div>
      <input type="color" id="textColorPicker" title="Text Color" value="#000000">
      <button type="button" class="toolbar-btn" data-command="removeFormat" title="Clear Formatting">
        <i class="fas fa-eraser"></i>
      </button>
    `;

    // Create editor div
    richTextEditor = document.createElement("div");
    richTextEditor.className = "rich-text-editor";
    richTextEditor.contentEditable = "true";
    richTextEditor.setAttribute("placeholder", "Enter email body");

    // Add after the label
    formGroup.insertBefore(toolbar, hiddenTextarea);
    formGroup.insertBefore(richTextEditor, hiddenTextarea);

    // Hide the original textarea
    hiddenTextarea.style.display = "none";

    // Setup toolbar events
    setupToolbarEvents(toolbar);

    // Setup editor events
    richTextEditor.addEventListener("input", updateBodyPreview);
    richTextEditor.addEventListener("keyup", updateBodyPreview);
    richTextEditor.addEventListener("paste", function (e) {
      // Clean up pasted content
      setTimeout(cleanPastedContent, 10);
    });

    // Track selection changes
    document.addEventListener("selectionchange", saveSelection);
    richTextEditor.addEventListener("mouseup", saveSelection);
    richTextEditor.addEventListener("keyup", saveSelection);

    // Create link dialog
    createLinkDialog();

    // Initial update
    updateBodyPreview();
  }

  function setupToolbarEvents(toolbar) {
    // Button clicks for formatting commands
    const buttons = toolbar.querySelectorAll(".toolbar-btn[data-command]");
    buttons.forEach((button) => {
      button.addEventListener("click", function () {
        const command = this.dataset.command;
        executeCommand(command);
      });
    });

    // Link buttons
    const insertLinkBtn = toolbar.querySelector("#insertLinkBtn");
    const removeLinkBtn = toolbar.querySelector("#removeLinkBtn");

    if (insertLinkBtn) {
      insertLinkBtn.addEventListener("click", showLinkDialog);
    }

    if (removeLinkBtn) {
      removeLinkBtn.addEventListener("click", function () {
        executeCommand("unlink");
      });
    }

    // Font family
    const fontFamilySelect = toolbar.querySelector("#fontFamilySelect");
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener("change", function () {
        if (this.value) {
          executeCommand("fontName", this.value);
          this.value = "";
        }
      });
    }

    // Font size - Fixed implementation
    const fontSizeSelect = toolbar.querySelector("#fontSizeSelect");
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener("change", function () {
        if (this.value) {
          const size = this.value;

          // Focus editor
          if (document.activeElement !== richTextEditor) {
            richTextEditor.focus();
          }

          // Save selection
          saveSelection();

          // Apply font size using insertHTML method (more reliable)
          const selection = window.getSelection();
          if (selection.rangeCount > 0 && !selection.isCollapsed) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();

            if (selectedText) {
              // Create span with font size
              const span = document.createElement("span");
              span.style.fontSize = size;
              span.textContent = selectedText;

              // Delete selected content
              range.deleteContents();

              // Insert styled span
              range.insertNode(span);

              // Move cursor after the styled text
              const newRange = document.createRange();
              newRange.setStartAfter(span);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          } else {
            // If no selection, just change font size for new text
            document.execCommand("fontSize", false, "7");
            // Apply style to the editor itself
            richTextEditor.style.fontSize = size;
          }

          // Update preview
          updateBodyPreview();
          this.value = "";

          // Restore focus
          richTextEditor.focus();
        }
      });
    }

    // Text color
    const colorPicker = toolbar.querySelector("#textColorPicker");
    if (colorPicker) {
      colorPicker.addEventListener("input", function () {
        executeCommand("foreColor", this.value);
      });
    }
  }

  function executeCommand(command, value = null) {
    // Focus editor if not focused
    if (document.activeElement !== richTextEditor) {
      richTextEditor.focus();
    }

    // Save selection before command
    saveSelection();

    // Restore selection if needed
    if (!window.getSelection().toString() && lastSelection) {
      restoreSelection();
    }

    // Execute command
    if (value) {
      document.execCommand(command, false, value);
    } else {
      document.execCommand(command, false, null);
    }

    // Update preview
    updateBodyPreview();

    // Restore focus
    richTextEditor.focus();
  }

  function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      // Check if selection is within the editor
      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer;

      if (richTextEditor.contains(container) || container === richTextEditor) {
        lastSelection = range.cloneRange();
      }
    }
  }

  function restoreSelection() {
    if (!lastSelection) return;

    const sel = window.getSelection();
    try {
      sel.removeAllRanges();
      sel.addRange(lastSelection);
    } catch (e) {
      console.log("Could not restore selection");
    }
  }

  function cleanPastedContent() {
    if (!richTextEditor) return;

    // Clean up pasted HTML
    const elements = richTextEditor.querySelectorAll("*[style]");
    elements.forEach((el) => {
      // Only keep basic styling
      const style = el.getAttribute("style");
      const allowed = [
        "color",
        "font-weight",
        "font-style",
        "text-decoration",
        "text-align",
        "font-size",
        "font-family",
        "background-color",
      ];
      const newStyle = style
        .split(";")
        .filter((decl) => {
          const prop = decl.split(":")[0].trim();
          return allowed.includes(prop);
        })
        .join(";");

      if (newStyle) {
        el.setAttribute("style", newStyle);
      } else {
        el.removeAttribute("style");
      }

      // Remove classes and ids
      el.removeAttribute("class");
      el.removeAttribute("id");
    });

    updateBodyPreview();
  }

  function createLinkDialog() {
    linkDialog = document.createElement("div");
    linkDialog.className = "link-dialog";
    linkDialog.style.display = "none";
    linkDialog.innerHTML = `
    <div class="link-dialog-content">
      <h4>Insert Link</h4>
      <div class="form-group">
        <label for="linkText">Link Text</label>
        <input type="text" id="linkText" placeholder="Enter link text">
      </div>
      <div class="form-group">
        <label for="linkUrl">Link URL</label>
        <input type="text" id="linkUrl" placeholder="https://example.com">
      </div>
      <div class="form-group checkbox-container">
        <input type="checkbox" id="linkNewTab" checked>
        <label for="linkNewTab">Open in new tab</label>
      </div>
      <div class="link-dialog-buttons">
        <button type="button" id="insertLinkConfirm">Insert Link</button>
        <button type="button" id="insertLinkCancel">Cancel</button>
      </div>
    </div>
  `;

    document.body.appendChild(linkDialog);

    // Get dialog elements
    linkTextInput = document.getElementById("linkText");
    linkUrlInput = document.getElementById("linkUrl");
    const linkNewTab = document.getElementById("linkNewTab");
    const insertLinkConfirm = document.getElementById("insertLinkConfirm");
    const insertLinkCancel = document.getElementById("insertLinkCancel");

    // Dialog events
    insertLinkConfirm.addEventListener("click", () => {
      const text = linkTextInput.value.trim();
      const url = linkUrlInput.value.trim();
      const newTab = linkNewTab.checked;

      if (!url) {
        alert("Please enter a URL");
        return;
      }

      insertLink(text, url, newTab);
      hideLinkDialog();
    });

    insertLinkCancel.addEventListener("click", hideLinkDialog);

    // Close dialog when clicking outside
    linkDialog.addEventListener("click", (e) => {
      if (e.target === linkDialog) {
        hideLinkDialog();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && linkDialog.style.display === "flex") {
        hideLinkDialog();
      }
    });
  }

  function showLinkDialog() {
    if (!linkDialog) return;

    // Get selected text
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // Save selection
    saveSelection();

    // Pre-fill text if there's a selection
    if (selectedText) {
      linkTextInput.value = selectedText;
    } else {
      linkTextInput.value = "";
    }

    linkUrlInput.value = "https://";
    linkDialog.style.display = "flex";

    // Focus on URL input
    setTimeout(() => {
      linkUrlInput.focus();
      linkUrlInput.select();
    }, 10);
  }

  function hideLinkDialog() {
    if (!linkDialog) return;
    linkDialog.style.display = "none";
    linkTextInput.value = "";
    linkUrlInput.value = "";

    // Restore focus to editor
    if (richTextEditor) {
      richTextEditor.focus();
    }
  }

  function insertLink(text, url, openInNewTab = true) {
    // Ensure URL has protocol
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Focus editor
    if (richTextEditor) {
      richTextEditor.focus();
    }

    // Restore selection
    restoreSelection();

    // Get current selection
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Check if we have selected text
      if (!selection.isCollapsed && range.toString().trim() !== "") {
        // Extract the selected text
        const selectedContent = range.extractContents();

        // Create link element
        const link = document.createElement("a");
        link.href = url;

        // Use provided text or selected text
        if (text) {
          link.textContent = text;
        } else {
          // Create a document fragment to get text content
          const tempDiv = document.createElement("div");
          tempDiv.appendChild(selectedContent.cloneNode(true));
          link.textContent = tempDiv.textContent || url;
        }

        if (openInNewTab) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }

        // Insert the link
        range.insertNode(link);

        // Select the new link
        const newRange = document.createRange();
        newRange.selectNodeContents(link);
        selection.removeAllRanges();
        selection.addRange(newRange);
      } else {
        // No selection - insert link with text
        const link = document.createElement("a");
        link.href = url;
        link.textContent = text || url;

        if (openInNewTab) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }

        // Insert at cursor position
        range.insertNode(link);

        // Move cursor after the link
        const newRange = document.createRange();
        newRange.setStartAfter(link);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      // Fallback: use execCommand with proper HTML
      const targetAttr = openInNewTab
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      const linkHTML = `<a href="${url}"${targetAttr}>${text || url}</a>`;
      document.execCommand("insertHTML", false, linkHTML);
    }

    // Update preview
    updateBodyPreview();

    // Clear saved selection
    lastSelection = null;
  }

  function updateBodyPreview() {
    if (!richTextEditor || !previewBody) return;

    let content = richTextEditor.innerHTML;

    // Update hidden textarea
    if (hiddenTextarea) {
      hiddenTextarea.value = content;
    }

    // Update preview
    if (!content || content.trim() === "" || content === "<br>") {
      previewBody.innerHTML =
        '<span class="preview-placeholder">Your email body text will appear here.</span>';
    } else {
      previewBody.innerHTML = content;
    }
  }

  // ============ PREVIEW FUNCTIONS ============

  function updatePreview() {
    previewTitle.textContent = titleInput.value || "Your Title Here";
    previewButton.textContent = buttonTextInput.value || "Button";
    previewButton.href = buttonLinkInput.value || "#";
    updateImagePreview();
  }

  function updateImagePreview() {
    if (uploadedImageBase64) {
      previewImage.src = uploadedImageBase64;
      previewImage.className = "preview-image";
      showRemoveBtn();
      uploadWrapper.style.display = "block";
    } else if (imageSelect.value) {
      const images = {
        img1: "https://via.placeholder.com/400x150/4F46E5/FFFFFF?text=Image+1",
        img2: "https://via.placeholder.com/400x150/10B981/FFFFFF?text=Image+2",
        img3: "https://via.placeholder.com/400x150/F59E0B/FFFFFF?text=Image+3",
      };

      previewImage.src = images[imageSelect.value];
      previewImage.className = "preview-image";
      uploadWrapper.style.display = "block";
      showRemoveBtn();
    } else {
      setPlaceholder();
      uploadWrapper.style.display = "none";
    }
  }

  // ============ EVENT LISTENERS ============

  [titleInput, buttonTextInput, buttonLinkInput].forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  // Character count for template name
  if (templateNameInput && charCount) {
    templateNameInput.addEventListener("input", function () {
      const remaining = 50 - this.value.length;
      charCount.textContent = remaining;
      charCount.style.color = remaining < 10 ? "#ef4444" : "#6b7280";
    });
  }

  // Save template button
  if (saveTemplateBtn) {
    saveTemplateBtn.addEventListener("click", function () {
      const name = templateNameInput.value.trim();

      if (!name) {
        alert("Please enter a template name");
        templateNameInput.focus();
        return;
      }

      // Get template data and save it
      const templateData = getCurrentTemplateData();
      if (window.templateManager && window.templateManager.saveTemplate) {
        window.templateManager.saveTemplate(templateData, name);
        templateNameInput.value = ""; // Clear the input after saving
      }
    });
  }

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

    // Reset text inputs
    titleInput.value = "";
    buttonTextInput.value = "";
    buttonLinkInput.value = "";
    templateNameInput.value = "";

    // Reset image inputs
    imageSelect.value = "";
    imageUpload.value = "";
    uploadedImageBase64 = "";

    // Reset rich text editor
    if (richTextEditor) {
      richTextEditor.innerHTML = "";
      if (hiddenTextarea) {
        hiddenTextarea.value = "";
      }
      updateBodyPreview();
    }

    // Reset preview
    updatePreview();
  });

  // Helper function to get current template data
  // Helper function to get current template data
  function getCurrentTemplateData() {
    // Get current image source
    let imageData = {
      imageSelect: imageSelect.value,
      uploadedImageBase64: uploadedImageBase64,
    };

    // If we have an uploaded image, use it
    if (uploadedImageBase64) {
      return {
        title: titleInput.value,
        body: hiddenTextarea ? hiddenTextarea.value : "",
        buttonText: buttonTextInput.value,
        buttonLink: buttonLinkInput.value,
        imageSelect: imageSelect.value,
        uploadedImageBase64: uploadedImageBase64,
        hasUploadedImage: true,
      };
    }
    // If we selected an image from dropdown
    else if (imageSelect.value) {
      const images = {
        img1: "https://via.placeholder.com/400x150?text=Image+1",
        img2: "https://via.placeholder.com/400x150?text=Image+2",
        img3: "https://via.placeholder.com/400x150?text=Image+3",
      };

      return {
        title: titleInput.value,
        body: hiddenTextarea ? hiddenTextarea.value : "",
        buttonText: buttonTextInput.value,
        buttonLink: buttonLinkInput.value,
        imageSelect: imageSelect.value,
        imageUrl: images[imageSelect.value],
        uploadedImageBase64: "", // Empty for dropdown images
        hasUploadedImage: false,
      };
    }
    // No image
    else {
      return {
        title: titleInput.value,
        body: hiddenTextarea ? hiddenTextarea.value : "",
        buttonText: buttonTextInput.value,
        buttonLink: buttonLinkInput.value,
        imageSelect: "",
        uploadedImageBase64: "",
        hasUploadedImage: false,
      };
    }
  }

  // ============ INITIALIZATION ============

  // Initialize rich text editor
  setupRichTextEditor();

  // Set initial state
  setPlaceholder();
  updatePreview();

  // Make functions available globally for template manager
  window.uploadedImageBase64 = uploadedImageBase64;
  window.updatePreview = updatePreview;
  window.updateBodyPreview = updateBodyPreview;
  window.getEditorContent = () => {
    if (richTextEditor) return richTextEditor.innerHTML;
    return "";
  };
  window.setEditorContent = (content) => {
    if (richTextEditor) {
      richTextEditor.innerHTML = content;
      updateBodyPreview();
    }
  };
  window.getCurrentTemplateData = getCurrentTemplateData;
});
