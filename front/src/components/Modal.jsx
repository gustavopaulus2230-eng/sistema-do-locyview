import React, { useEffect, useRef } from 'react';

export default function Modal({ children, className = '', labelledBy, onClose, id }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function backdropClick(event) {
    if (event.target !== dialogRef.current) return;
    const bounds = dialogRef.current.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeRef.current();
  }

  return <dialog ref={dialogRef} id={id} className={className} aria-labelledby={labelledBy} onCancel={event => { event.preventDefault(); closeRef.current(); }} onClick={backdropClick}>{children}</dialog>;
}
