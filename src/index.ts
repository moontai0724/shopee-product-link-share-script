entrypoint();

async function entrypoint() {
  await waitForElement(".sprite-product-sharing");
  const lastShareButton = Array.from(
    document.querySelectorAll(".sprite-product-sharing"),
  ).pop();

  if (!lastShareButton) {
    console.log("No share button found");
    return;
  }

  const link = getShareLink();
  const shareButton = createShareButton(lastShareButton, link);
}

function waitForElement(selector: string): Promise<Element> {
  return new Promise(resolve => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

function getShareLink(): string {
  const [full, shopId, productId] =
    location.pathname.match(/-i\.(\d+)\.(\d+)/) || [];

  if (!shopId || !productId) {
    console.log("No shopId or productId found");
    throw new Error("No shopId or productId found");
  }

  return `${location.origin}/product/${shopId}/${productId}`;
}

function createShareButton(after: Element, link: string): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = "Share";
  button.style.marginLeft = "5px";
  button.style.height = "25px";
  button.style.width = "25px";
  button.style.borderRadius = "50%";
  button.style.border = "1px solid";
  button.style.padding = "0";
  button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z"/></svg>`;
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(link);
    alert("Share link copied!\n" + link);
  });

  after.after(button);

  return button;
}
