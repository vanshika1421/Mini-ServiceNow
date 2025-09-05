import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to safely handle DOM transitions and prevent scrollTop errors
 * @param {boolean} isOpen - Whether the transition should be open
 * @param {number} timeout - Transition timeout in milliseconds
 * @returns {Object} - Object containing ref and safe transition props
 */
export const useSafeTransition = (isOpen = false, timeout = 300) => {
  const nodeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Safe scroll handler that checks for null references
  const safeScrollHandler = useCallback((node) => {
    if (node && typeof node.scrollTop !== 'undefined') {
      try {
        // Safely access scrollTop only if the element exists and has the property
        return node.scrollTop;
      } catch (error) {
        console.warn('Safe transition: Could not access scrollTop', error);
        return 0;
      }
    }
    return 0;
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Safe transition enter handler
  const onEnter = useCallback((node) => {
    if (node) {
      // Ensure the node is properly mounted before accessing properties
      timeoutRef.current = setTimeout(() => {
        safeScrollHandler(node);
      }, 0);
    }
  }, [safeScrollHandler]);

  // Safe transition exit handler
  const onExit = useCallback((node) => {
    if (node) {
      safeScrollHandler(node);
    }
  }, [safeScrollHandler]);

  return {
    nodeRef,
    transitionProps: {
      nodeRef,
      timeout: timeout === 'auto' ? 300 : timeout,
      onEnter,
      onExit,
      unmountOnExit: true,
      appear: true
    }
  };
};

export default useSafeTransition;
