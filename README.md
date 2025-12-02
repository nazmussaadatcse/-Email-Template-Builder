# 📧 Email Template Builder

## 📋 Project Overview

A responsive web application for creating and managing email templates with a WYSIWYG interface. Built with pure HTML, CSS, and JavaScript - no frameworks required.

## 🎯 Features

- **Editable Fields**: Title, body text, button text, button link
- **Rich Text Editor**: Bold, italic, underline, alignment, lists, links, font customization
- **Image Management**: Select from dropdown or upload custom images
- **Real-time Preview**: Live updates as you edit
- **Template Saving**: Save templates with custom names to localStorage
- **HTML Export**: Download complete email as HTML file
- **Template Management**: Save, load, edit, delete templates

## 🏗️ Project Structure

email-template-builder/
├── index.html
├── css/
│ ├── styles.css
│ ├── editor.css
│ ├── preview.css
│ └── templates.css
├── js/
│ ├── builder.js
│ └── templateManager.js
└── README.md

## 🚀 Quick Start

1. Download or clone the repository
2. Open `index.html` in any modern web browser
3. Start building email templates immediately

## 🛠️ How to Use

1. **Create**: Edit title, format body text, add button, select image
2. **Preview**: See real-time updates in preview panel
3. **Save**: Enter template name and click "Save Template"
4. **Manage**: Access saved templates via "My Templates" dropdown
5. **Download**: Export as HTML file with "Download HTML"

## 🔧 Technical Details

- **Pure JavaScript**: No frameworks or libraries
- **localStorage**: Template persistence in browser
- **Rich Text Editor**: Custom implementation using `contentEditable`
- **Responsive Design**: Works on desktop and mobile

## 📱 Browser Support

Chrome 60+ | Firefox 55+ | Safari 10+ | Edge 79+ | Mobile browsers

## 📁 File Descriptions

### HTML Files

- `index.html` - Main application interface

### CSS Files

- `css/styles.css` - Global styles and layout
- `css/editor.css` - Editor panel styling
- `css/preview.css` - Preview panel styling
- `css/templates.css` - Template manager styling

### JavaScript Files

- `js/builder.js` - Main editor functionality, rich text editor, image handling
- `js/templateManager.js` - Template CRUD operations, localStorage management

## 🔄 Workflow

Create Template → Edit Content → Add Image →
Preview → Save Template → Download HTML
↳ Load Template → Edit → Save Updates

## 🎨 UI Components

1. **Header**: App title, template counter, download button
2. **Editor Panel**: Form controls, rich text editor, save/reset buttons
3. **Preview Panel**: Live email preview with image placeholder
4. **Templates Dropdown**: List of saved templates with edit/delete options

## 💾 Data Storage

Templates are stored in browser's localStorage with this structure:

```javascript
{
  id: "unique_timestamp",
  name: "Template Name",
  date: "Dec 15, 2024, 10:30 AM",
  data: {
    title: "Email Title",
    body: "HTML content",
    buttonText: "Button Text",
    buttonLink: "https://example.com",
    imageSelect: "img1",
    uploadedImageBase64: "data:image/..."

  }
}

⚠️ Limitations
Client-side only (localstorage)
localStorage size limits
Image uploads use Base64 (increases storage size)
No user authentication

🔮 Future Enhancements
Database integration for template storage
User authentication system
Template categories/tags
More image editing options
Email client compatibility testing
Template sharing functionality

📄 License
Open-source for educational and portfolio purposes.

*Built for Frontend Developer Assessment Task
```
