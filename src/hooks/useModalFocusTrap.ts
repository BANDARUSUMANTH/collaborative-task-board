import { useEffect, useRef } from 'react';

interface UseModalFocusTrapOptions {
  isOpen: boolean;
  onClose: () => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  closeOnEscape?: boolean;
}

export function useModalFocusTrap<T extends HTMLElement>({
  isOpen,
  onClose,
  initialFocusRef,
  closeOnEscape = true
}: UseModalFocusTrapOptions) {
  const containerRef = useRef<T | null>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember currently focused element to restore when closing
    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    // Schedule initial focus on next frame to allow DOM rendering
    const timer = setTimeout(() => {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
      } else {
        const focusableElements = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previous element
      if (previouslyFocusedElementRef.current && typeof previouslyFocusedElementRef.current.focus === 'function') {
        previouslyFocusedElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, initialFocusRef, closeOnEscape]);

  return containerRef;
}
