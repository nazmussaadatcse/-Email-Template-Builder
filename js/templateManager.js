// Template Manager for Email Template Builder - FIXED VERSION
class TemplateManager {
  constructor() {
    this.templates = [];
    this.currentTemplateId = null;
    this.dropdownOpen = false;

    this.loadTemplates();
    this.initEventListeners();
  }

  // Load templates from localStorage
  loadTemplates() {
    const savedTemplates = localStorage.getItem("emailTemplates");
    if (savedTemplates) {
      try {
        this.templates = JSON.parse(savedTemplates);
      } catch (e) {
        console.error("Error parsing templates:", e);
        this.templates = [];
      }
    }
    this.updateTemplateCount();
  }

  // Save templates to localStorage
  saveTemplates() {
    localStorage.setItem("emailTemplates", JSON.stringify(this.templates));
    this.updateTemplateCount();
  }

  // Update template count display
  updateTemplateCount() {
    const countElement = document.getElementById("templateCount");
    const dropdownCount = document.getElementById("dropdownTemplateCount");

    if (countElement) {
      countElement.textContent = `${this.templates.length} Template${
        this.templates.length !== 1 ? "s" : ""
      }`;
    }

    if (dropdownCount) {
      dropdownCount.textContent = `${this.templates.length} saved`;
    }
  }

  // Save a new template
  saveTemplate(templateData, name) {
    const template = {
      id: Date.now().toString(),
      name: name || `Template ${this.templates.length + 1}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      data: templateData,
    };

    this.templates.unshift(template);
    this.saveTemplates();
    this.renderTemplates();
    this.showNotification(`Template "${template.name}" saved successfully!`);
  }

  // Delete a template
  deleteTemplate(id) {
    if (confirm("Are you sure you want to delete this template?")) {
      this.templates = this.templates.filter((t) => t.id !== id);
      this.saveTemplates();
      this.renderTemplates();
      this.showNotification("Template deleted successfully!");
    }
  }

  // Load template into editor
  loadTemplate(id) {
    const template = this.templates.find((t) => t.id === id);
    if (template) {
      this.currentTemplateId = id;
      this.loadTemplateData(template.data);
      this.closeDropdown();
      this.showNotification(`Template "${template.name}" loaded!`);
    }
  }

  // Load template data into editor
  loadTemplateData(data) {
    // Set basic fields
    document.getElementById("titleInput").value = data.title || "";
    document.getElementById("buttonTextInput").value = data.buttonText || "";
    document.getElementById("buttonLinkInput").value = data.buttonLink || "";

    // Set body text
    if (window.setEditorContent && data.body) {
      window.setEditorContent(data.body);
    } else {
      // Fallback for textarea
      const bodyInput = document.getElementById("bodyInput");
      if (bodyInput && data.body) {
        bodyInput.value = data.body;
      }
    }

    // Set image
    document.getElementById("imageSelect").value = data.imageSelect || "";
    document.getElementById("imageUpload").value = "";

    // Set uploaded image if exists
    if (data.uploadedImageBase64) {
      window.uploadedImageBase64 = data.uploadedImageBase64;
    } else {
      window.uploadedImageBase64 = "";
    }

    // Update preview
    if (typeof window.updatePreview === "function") {
      window.updatePreview();
    }
    if (typeof window.updateBodyPreview === "function") {
      window.updateBodyPreview();
    }
  }

  // Render templates list
  // Render templates list
  renderTemplates() {
    const templatesList = document.getElementById("templatesList");
    if (!templatesList) return;

    // If no templates
    if (this.templates.length === 0) {
      templatesList.innerHTML = `
      <div class="dropdown-empty-state">
        <i class="fas fa-inbox"></i>
        <p>No templates saved yet</p>
        <small>Create and save your first template!</small>
      </div>`;
      return;
    }

    // Render templates using padding classes
    templatesList.innerHTML = this.templates
      .map(
        (template) => `
      <div class="dropdown-template-item template-mb-md" data-id="${
        template.id
      }">
        <div class="template-padding-lg">
          <div class="dropdown-template-item-header template-pb-md">
            <h4>${template.name}</h4>
            <span class="template-date template-px-sm">${template.date}</span>
          </div>
          <div class="template-py-md">
            <p class="dropdown-template-preview">${
              template.data.title || "No title"
            }</p>
          </div>
          <div class="dropdown-template-actions template-pt-md">
            <button class="dropdown-template-btn load-btn template-px-md" data-id="${
              template.id
            }">
              <i class="fas fa-upload"></i> Edit
            </button>
            <button class="dropdown-template-btn delete-btn template-px-md" data-id="${
              template.id
            }">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>`
      )
      .join("");

    // Attach button listeners
    templatesList.querySelectorAll(".load-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.loadTemplate(btn.dataset.id);
      };
    });

    templatesList.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.deleteTemplate(btn.dataset.id);
      };
    });
  }

  // Show notification
  showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Toggle dropdown
  toggleDropdown() {
    const dropdown = document.getElementById("templatesDropdown");
    if (!dropdown) return;

    if (this.dropdownOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  // Open dropdown
  openDropdown() {
    const dropdown = document.getElementById("templatesDropdown");
    if (!dropdown) return;

    this.dropdownOpen = true;
    dropdown.style.display = "block";
    dropdown.style.opacity = "1";
    dropdown.style.transform = "translateY(0)";
    dropdown.style.visibility = "visible";

    this.renderTemplates();
  }

  // Close dropdown
  closeDropdown() {
    const dropdown = document.getElementById("templatesDropdown");
    if (!dropdown) return;

    this.dropdownOpen = false;
    dropdown.style.display = "none";
    dropdown.style.opacity = "0";
    dropdown.style.transform = "translateY(-10px)";
    dropdown.style.visibility = "hidden";
  }

  // Initialize event listeners
  initEventListeners() {
    // Templates dropdown button
    const templatesDropdownBtn = document.getElementById(
      "templatesDropdownBtn"
    );

    if (templatesDropdownBtn) {
      templatesDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      const dropdown = document.getElementById("templatesDropdown");
      const btn = document.getElementById("templatesDropdownBtn");

      if (dropdown && btn && this.dropdownOpen) {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
          this.closeDropdown();
        }
      }
    });

    // Close dropdown on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.dropdownOpen) {
        this.closeDropdown();
      }
    });

    // Save template button
    // Save template button - ALTERNATIVE FIX
    const saveTemplateBtn = document.getElementById("saveTemplateBtn");
    if (saveTemplateBtn) {
      // Remove any existing event listeners first
      const newSaveBtn = saveTemplateBtn.cloneNode(true);
      saveTemplateBtn.parentNode.replaceChild(newSaveBtn, saveTemplateBtn);

      // Add fresh event listener
      document
        .getElementById("saveTemplateBtn")
        .addEventListener("click", (e) => {
          console.log("Save button clicked - Event:", e);

          // Prevent everything
          if (e.preventDefault) e.preventDefault();
          if (e.stopPropagation) e.stopPropagation();
          e.cancelBubble = true;
          e.returnValue = false;

          const templateNameInput = document.getElementById("templateName");
          const templateName = templateNameInput.value.trim();

          console.log("Template name value:", templateName);

          if (!templateName) {
            console.log("Template name is empty - showing alert");
            alert("Please enter a template name");
            templateNameInput.focus();
            return false;
          }

          console.log("Proceeding with save...");
          const templateData = window.getCurrentTemplateData
            ? window.getCurrentTemplateData()
            : {
                title: document.getElementById("titleInput").value,
                body: document.getElementById("bodyInput")
                  ? document.getElementById("bodyInput").value
                  : "",
                buttonText: document.getElementById("buttonTextInput").value,
                buttonLink: document.getElementById("buttonLinkInput").value,
                imageSelect: document.getElementById("imageSelect").value,
                uploadedImageBase64: window.uploadedImageBase64 || "",
              };

          this.saveTemplate(templateData, templateName);
          templateNameInput.value = "";

          const charCount = document.getElementById("charCount");
          if (charCount) {
            charCount.textContent = "50";
          }

          return false;
        });
    }

    // Character counter for template name
    const templateNameInput = document.getElementById("templateName");
    const charCount = document.getElementById("charCount");

    if (templateNameInput && charCount) {
      templateNameInput.addEventListener("input", () => {
        const remaining = 50 - templateNameInput.value.length;
        charCount.textContent = remaining;
      });
    }
  }

  // Download current template as HTML
  downloadCurrentTemplate() {
    const templateData = window.getCurrentTemplateData
      ? window.getCurrentTemplateData()
      : {
          title: document.getElementById("titleInput").value,
          body: document.getElementById("bodyInput")
            ? document.getElementById("bodyInput").value
            : "",
          buttonText: document.getElementById("buttonTextInput").value,
          buttonLink: document.getElementById("buttonLinkInput").value,
          imageSelect: document.getElementById("imageSelect").value,
          uploadedImageBase64: window.uploadedImageBase64 || "",
        };

    const htmlContent = this.generateHTML({
      name: "Email Template",
      data: templateData,
    });

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-template-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showNotification("Template downloaded successfully!");
  }

  // Generate HTML from template data
  generateHTML(template) {
    const data = template.data;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name} - Email Template</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-container {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 30px;
        }
        .email-title {
            color: #1f2937;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .email-image {
            width: 100%;
            height: auto;
            max-height: 200px;
            object-fit: cover;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        .email-body {
            color: #4b5563;
            margin-bottom: 30px;
        }
        .email-button {
            display: inline-block;
            padding: 12px 24px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .email-button:hover {
            background: #2563eb;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1 class="email-title">${data.title || "Your Title Here"}</h1>
        
        ${
          data.imageSelect || data.uploadedImageBase64
            ? `<img src="${
                data.uploadedImageBase64 ||
                (data.imageSelect === "img1"
                  ? "https://via.placeholder.com/600x200?text=Image+1"
                  : data.imageSelect === "img2"
                  ? "https://via.placeholder.com/600x200?text=Image+2"
                  : "https://via.placeholder.com/600x200?text=Image+3")
              }" 
                 alt="Email Image" class="email-image">`
            : ""
        }
        
        <div class="email-body">
            ${
              data.body
                ? data.body.replace(/\n/g, "<br>")
                : "<p>Your email content here</p>"
            }
        </div>
        
        ${
          data.buttonText
            ? `<a href="${
                data.buttonLink || "#"
              }" class="email-button" target="_blank">${data.buttonText}</a>`
            : ""
        }
        
        <div class="footer">
            <p>This email was generated using Email Template Builder</p>
        </div>
    </div>
</body>
</html>`;
  }
}

// Initialize Template Manager
let templateManager;

document.addEventListener("DOMContentLoaded", () => {
  templateManager = new TemplateManager();
  window.templateManager = templateManager;
});
