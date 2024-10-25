export function scrollToElementIfNotInViewport(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    return;
  }

  const rects = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const viewportWidth =
    window.innerWidth || document.documentElement.clientWidth;

  const isInViewport = (rect: DOMRect) => {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= viewportHeight &&
      rect.right <= viewportWidth
    );
  };

  if (!isInViewport(rects)) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
