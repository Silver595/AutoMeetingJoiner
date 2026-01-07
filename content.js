// Robust auto-join implementation:
// - Avoids invalid CSS selectors that throw
// - Searches by text/attributes across buttons and [role="button"]
// - Traverses open shadow roots
// - Uses MutationObserver to react to dynamic UI

function autoJoinMeeting() {
  const lastClick = { time: 0 };

  function isVisible(el) {
    if (!el) return false;
    try {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    } catch (e) {
      return false;
    }
  }

  function textFor(el) {
    return (
      el.getAttribute && (
        el.getAttribute('aria-label') || el.getAttribute('data-tooltip') || el.getAttribute('title')
      )
    ) || el.innerText || el.textContent || '';
  }

  function matchesJoinText(s) {
    if (!s) return false;
    const t = s.toLowerCase();
    return /\b(join now|ask to join|ask to join|join meeting|join)\b/.test(t);
  }

  function dispatchClick(el) {
    if (!el) return false;
    // Prevent rapid multiple clicks
    const now = Date.now();
    if (now - lastClick.time < 3000) return false;

    try {
      // Try native click first
      if (typeof el.click === 'function') {
        el.click();
      } else {
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        el.dispatchEvent(ev);
      }
      lastClick.time = now;
      console.log('Auto-joined by clicking element:', el, 'text:', textFor(el));
      return true;
    } catch (err) {
      console.warn('Click dispatch failed, trying mouse events:', err);
      try {
        const evDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        const evUp = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        el.dispatchEvent(evDown);
        el.dispatchEvent(evUp);
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        lastClick.time = now;
        return true;
      } catch (e) {
        console.error('All click attempts failed:', e);
        return false;
      }
    }
  }

  // Traverse a root (document or shadow root) to find candidate buttons
  function findJoinInRoot(root) {
    const nodeList = Array.from(root.querySelectorAll('button, [role="button"], a, input[type="button"]'));

    for (const el of nodeList) {
      const s = textFor(el);
      if (matchesJoinText(s) && isVisible(el)) {
        return el;
      }
    }

    // Check for elements that may act like buttons but are not standard
    const all = Array.from(root.querySelectorAll('*'));
    for (const el of all) {
      const s = textFor(el);
      if (matchesJoinText(s) && isVisible(el)) return el;
    }

    // Recurse into open shadow roots
    const elementsWithShadow = Array.from(root.querySelectorAll('*')).filter(e => e.shadowRoot);
    for (const host of elementsWithShadow) {
      const found = findJoinInRoot(host.shadowRoot);
      if (found) return found;
    }

    return null;
  }

  // Primary search on document
  const candidate = findJoinInRoot(document);
  if (candidate) {
    return dispatchClick(candidate);
  }

  return false;
}

// Run immediately and then observe for changes
try {
  autoJoinMeeting();
} catch (e) {
  console.error('Auto join initial run failed:', e);
}

// MutationObserver to catch dynamic UI updates
(function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        try {
          if (autoJoinMeeting()) {
            // Optional: if join succeeded, we can disconnect observer temporarily
            // observer.disconnect();
            break;
          }
        } catch (e) {
          console.error('Error during mutation check:', e);
        }
      }
    }
  });

  const body = document.body || document.documentElement;
  if (body) observer.observe(body, { childList: true, subtree: true });

  // Fallback polling in case mutation events are not sufficient
  setInterval(() => {
    try { autoJoinMeeting(); } catch (e) { /* ignore */ }
  }, 2000);
})();
