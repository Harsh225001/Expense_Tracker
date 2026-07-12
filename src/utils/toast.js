// Simple toast notification system
let toastId = 0;

const createToastContainer = () => {
  if (document.getElementById('toast-container')) return;
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  `;
  document.body.appendChild(container);
};

export const showToast = (message, type = 'success', duration = 3000) => {
  createToastContainer();
  const container = document.getElementById('toast-container');
  const id = ++toastId;

  const toast = document.createElement('div');
  toast.id = `toast-${id}`;
  toast.style.cssText = `
    background: ${type === 'success' ? '#111111' : '#111111'};
    border: 1px solid ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    pointer-events: auto;
    min-width: 280px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: slideIn 0.3s ease forwards;
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const icon = type === 'success' ? '✅' : '❌';
  toast.innerHTML = `${icon} ${message}`;
  container.appendChild(toast);

  // Add keyframe
  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    const el = document.getElementById(`toast-${id}`);
    if (el) {
      el.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  }, duration);
};