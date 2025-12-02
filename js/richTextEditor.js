// Rich Text Editor Module
const RichTextEditor = (function() {
  // DOM Elements
  let editor;
  let toolbar;
  let fontFamilySelect;
  let fontSizeSelect;
  let textColorPicker;
  let previewBody;
  
  // Store the last selection
  let lastSelection = null;
  
  function init() {
    editor = document.getElementById('bodyInput');
    toolbar = document.getElementById('richTextToolbar');
    fontFamilySelect = document.getElementById('fontFamily');
    fontSizeSelect = document.getElementById('fontSize');
    textColorPicker = document.getElementById('textColor');
    previewBody = document.querySelector('.preview-body');
    
    if (!editor || !toolbar) return;
    
    setupEventListeners();
    setupPlaceholderBehavior();
    setupAutoSaveSelection();
  }
  
  function setupEventListeners() {
    // Toolbar button clicks
    const buttons = toolbar.querySelectorAll('.toolbar-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const command = this.dataset.command;
        executeCommand(command);
      });
    });
    
    // Font family change
    if (fontFamilySelect) {
      fontFamilySelect.addEventListener('change', function() {
        const font = this.value;
        if (font) {
          executeCommand('fontName', font);
          this.value = ''; // Reset to placeholder
        }
      });
    }
    
    // Font size change
    if (fontSizeSelect) {
      fontSizeSelect.addEventListener('change', function() {
        const size = this.value;
        if (size) {
          executeCommand('fontSize', size.replace('px', ''));
          this.value = ''; // Reset to placeholder
        }
      });
    }
    
    // Text color change
    if (textColorPicker) {
      textColorPicker.addEventListener('input', function() {
        executeCommand('foreColor', this.value);
      });
    }
    
    // Editor content changes
    editor.addEventListener('input', updatePreview);
    editor.addEventListener('keyup', updatePreview);
    editor.addEventListener('paste', function(e) {
      // Clean up pasted content
      setTimeout(() => {
        cleanPastedContent();
        updatePreview();
      }, 10);
    });
  }
  
  function setupPlaceholderBehavior() {
    editor.addEventListener('focus', function() {
      if (this.textContent === '' || this.textContent === this.getAttribute('placeholder')) {
        this.innerHTML = '';
      }
    });
    
    editor.addEventListener('blur', function() {
      if (this.innerHTML === '' || this.textContent.trim() === '') {
        this.innerHTML = '';
        this.dispatchEvent(new Event('input'));
      }
    });
  }
  
  function setupAutoSaveSelection() {
    editor.addEventListener('mouseup', saveSelection);
    editor.addEventListener('keyup', saveSelection);
    document.addEventListener('selectionchange', saveSelection);
  }
  
  function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      lastSelection = sel.getRangeAt(0).cloneRange();
    }
  }
  
  function restoreSelection() {
    if (!lastSelection) return;
    
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(lastSelection);
  }
  
  function executeCommand(command, value = null) {
    // Save selection before executing command
    saveSelection();
    
    // Restore selection if needed
    if (!window.getSelection().toString() && lastSelection) {
      restoreSelection();
    }
    
    // Focus editor if not focused
    if (document.activeElement !== editor) {
      editor.focus();
    }
    
    // Execute command
    document.execCommand(command, false, value);
    
    // Update preview
    updatePreview();
    
    // Keep focus on editor
    editor.focus();
    
    // Update toolbar button states
    updateToolbarState();
  }
  
  function updateToolbarState() {
    const buttons = toolbar.querySelectorAll('.toolbar-btn[data-command]');
    buttons.forEach(button => {
      const command = button.dataset.command;
      
      try {
        const isActive = document.queryCommandState(command);
        if (isActive) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      } catch (e) {
        // Some commands don't support queryCommandState
      }
    });
  }
  
  function cleanPastedContent() {
    // Remove unwanted styles and classes from pasted content
    const elements = editor.querySelectorAll('*');
    elements.forEach(el => {
      // Remove inline styles (keep only basic ones)
      if (el.hasAttribute('style')) {
        const style = el.getAttribute('style');
        const allowedStyles = [
          'font-weight', 'font-style', 'text-decoration',
          'text-align', 'color', 'font-size', 'font-family'
        ];
        
        const newStyle = style.split(';').filter(declaration => {
          const prop = declaration.split(':')[0].trim();
          return allowedStyles.includes(prop);
        }).join(';');
        
        if (newStyle) {
          el.setAttribute('style', newStyle);
        } else {
          el.removeAttribute('style');
        }
      }
      
      // Remove classes
      el.removeAttribute('class');
      
      // Remove IDs
      el.removeAttribute('id');
    });
  }
  
  function updatePreview() {
    if (!previewBody) return;
    
    // Get HTML content
    let content = editor.innerHTML;
    
    // If empty, show placeholder
    if (!content || content.trim() === '' || content === '<br>') {
      previewBody.innerHTML = '<span style="color: #999;">Your email body text will appear here.</span>';
      return;
    }
    
    // Clean up the HTML for preview
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Remove empty paragraphs
    const paragraphs = tempDiv.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (!p.textContent.trim() && !p.querySelector('img, br')) {
        p.remove();
      }
    });
    
    // Ensure proper line breaks
    const cleanedContent = tempDiv.innerHTML;
    
    // Update preview
    previewBody.innerHTML = cleanedContent;
  }
  
  function getContent() {
    return editor.innerHTML;
  }
  
  function setContent(html) {
    if (!editor) return;
    editor.innerHTML = html || '';
    updatePreview();
  }
  
  function reset() {
    if (!editor) return;
    editor.innerHTML = '';
    updatePreview();
    updateToolbarState();
  }
  
  // Public API
  return {
    init,
    getContent,
    setContent,
    reset,
    updatePreview
  };
})();