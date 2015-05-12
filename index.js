var tracking = [];

function isVisible(elm) {
  var rect = elm.getBoundingClientRect();

  return rect.bottom > 0 &&
    rect.right > 0 &&
    rect.left < (window.innerWidth || document. documentElement.clientWidth) &&
    rect.top < (window.innerHeight || document. documentElement.clientHeight);
}

function onScroll() {
  requestAnimationFrame(checkForVisibleElements);
}

function watchScroll() {
  window.addEventListener('scroll', onScroll);
}

function handleVisible(elm, options) {
  untrack(elm);

  if (options.handler !== void 0) {
    options.handler(elm);
  }
}

function trackNewElement(elm, options) {
  if (isVisible(elm)) {
    return handleVisible(elm, options);
  }

  tracking.push({elm: elm, options: options});
}

function checkForVisibleElements() {
  tracking.forEach((v) => {
    if (isVisible(v.elm)) {
      handleVisible(v.elm, v.options);
    }
  });

  if (tracking.length === 0) {
    window.removeEventListener('scroll', onScroll);
  }
}

export function track(elm, options) {
  requestAnimationFrame(trackNewElement.bind(this, elm, options));

  if (tracking.length === 0) { watchScroll(); }
}

export function untrackAll() {
  tracking = [];
}

export function untrack(elm) {
  var elmIndex = -1;

  tracking.some((v, i) => {
    if (v.elm == elm) {
      elmIndex = i;
      return true;
    }
  });

  if (elmIndex !== -1) {
    tracking.splice(elmIndex, 1);
  }
}
