import React, { useEffect, useRef } from 'react';

export default function Modal({ children, className = '', labelledBy, onClose, id }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  const returnFocusRef = useRef(typeof document === 'undefined' ? null : document.activeElement);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      const opener = returnFocusRef.current;
      queueMicrotask(() => {
        if (dialog.open || !opener?.isConnected || typeof opener.focus !== 'function') return;
        const anotherModal = [...document.querySelectorAll('dialog:modal')].some(other => other !== dialog && !other.contains(opener));
        const active = document.activeElement;
        if (anotherModal || (active !== document.body && active !== opener && !dialog.contains(active))) return;
        opener.focus({ preventScroll: true });
      });
    };
  }, []);

  function backdropClick(event) {
    if (event.target !== dialogRef.current) return;
    const bounds = dialogRef.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeRef.current();
  }

  return <dialog ref={dialogRef} id={id} className={className} aria-labelledby={labelledBy} onCancel={event => { event.preventDefault(); closeRef.current(); }} onClick={backdropClick}>{children}</dialog>;
}
