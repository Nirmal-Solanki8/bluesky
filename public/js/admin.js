// Admin Panel Interactive Handlers
document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Sidebar Toggle
  const toggleBtn = document.getElementById('adminSidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('sidebar-open');
    });
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('sidebar-open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }

  // 2. Alert Dismissal
  const alerts = document.querySelectorAll('.admin-content .alert');
  if (alerts.length > 0) {
    setTimeout(() => {
      alerts.forEach(alert => {
        alert.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        setTimeout(() => alert.remove(), 400);
      });
    }, 4000);
  }

  // 3. Sleek Drag-and-Drop File Upload with Instant Vanilla JS Image Preview
  const dropzones = document.querySelectorAll('.admin-dropzone');
  dropzones.forEach(zone => {
    const fileInput = zone.querySelector('input[type="file"]');
    const previewContainer = zone.querySelector('.dropzone-preview-container') || createPreviewContainer(zone);
    const previewImg = previewContainer.querySelector('img') || createPreviewImg(previewContainer);

    ['dragenter', 'dragover'].forEach(eventName => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      zone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('dragover');
      }, false);
    });

    zone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0 && fileInput) {
        fileInput.files = files;
        handlePreview(files[0], previewContainer, previewImg);
      }
    });

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          handlePreview(fileInput.files[0], previewContainer, previewImg);
        }
      });
    }
  });

  function createPreviewContainer(zone) {
    const container = document.createElement('div');
    container.className = 'dropzone-preview-container';
    zone.appendChild(container);
    return container;
  }

  function createPreviewImg(container) {
    const img = document.createElement('img');
    img.alt = 'Uploaded Preview';
    container.appendChild(img);
    return img;
  }

  function handlePreview(file, container, img) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        container.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }

  // Also attach preview to standard file inputs if present
  document.querySelectorAll('input[type="file"]:not(.admin-dropzone-input)').forEach(input => {
    input.addEventListener('change', () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.type.startsWith('image/')) {
          let preview = input.parentElement.querySelector('.instant-file-preview');
          if (!preview) {
            preview = document.createElement('img');
            preview.className = 'instant-file-preview';
            preview.style.cssText = 'width: 120px; height: 80px; object-fit: cover; border-radius: 8px; margin-top: 10px; border: 1px solid #D4AF37; display: block;';
            input.parentElement.appendChild(preview);
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            preview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    });
  });
});
