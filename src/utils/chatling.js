const CHATLING_ID = "8818868731";

const CHATLING_SELECTORS = [
  "#chtl-script",
  'script[src*="chatling.ai"]',
  'iframe[src*="chatling.ai"]',
  `[data-id="${CHATLING_ID}"]`,
  '[id*="chatling" i]',
  '[class*="chatling" i]',
  '[id*="chtl" i]',
  '[class*="chtl" i]',
];

export function cleanupChatling() {
  if (window.Chatling && typeof window.Chatling.destroy === "function") {
    try {
      window.Chatling.destroy();
    } catch {
      // Chatling cleanup should never block removing the injected DOM.
    }
  }

  document
    .querySelectorAll(CHATLING_SELECTORS.join(","))
    .forEach((element) => element.remove());

  delete window.chtlConfig;
  delete window.Chatling;
}

export function loadChatling() {
  cleanupChatling();

  window.chtlConfig = { chatbotId: CHATLING_ID };

  const script = document.createElement("script");
  script.async = true;
  script.dataset.id = CHATLING_ID;
  script.id = "chtl-script";
  script.type = "text/javascript";
  script.src = "https://chatling.ai/js/embed.js";
  document.body.appendChild(script);

  return script;
}
