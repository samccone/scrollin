const assert = require('assert');
import {track, getTracking, untrack, untrackAll, checkForVisibleElements} from '../index.js';
function RAF(cb) {
  setTimeout(cb, 0);
}

class NodeList {
  constructor(...nodes) {
    this.length = nodes.length;
    for (let i = 0; i < nodes.length; ++i) {
      this[i] = nodes[i];
    }
  }
  item(idx) {
    return this[idx];
  }
}

class Element {
  constructor(bounds = {}) {
    this.right = bounds.right || 10;
    this.left = bounds.left || 0;
    this.top = bounds.top || 0;
    this.bottom = bounds.bottom || 100;
  }
  getBoundingClientRect() {
    return {
      bottom: this.bottom,
      right: this.right,
      left: this.left,
      top: this.top
    };
  }
}

global.window = {
  requestAnimationFrame: RAF,
  addEventListener: (evt, cb) => {
    global.window[evt] = global.window[evt] || [];
    global.window[evt].push(cb);
  },
  removeEventListener: (evt, cb) => {
    global.window[evt] = global.window[evt] || [];

    if (cb) {
      global.window[evt].splice(global.window[evt].indexOf(cb), 1);
    } else {
      delete global.window[evt];
    }
  },
  innerWidth: 500,
  innerHeight: 200,
  trigger: (evt) => global.window[evt].forEach((fn) => fn())
};

beforeEach(untrackAll);

describe('adding an array of elements', function() {
  beforeEach(function() {
    this.elements = new NodeList(new Element(), new Element(), new Element());
    this.cb = () => {};
  });

  it('should be on the tracking array', function() {
    track(this.elements, this.cb);
    RAF(() => {
      assert.deepEqual(getTracking().length, this.elements.length);
    });
  });

  it('should fire the handler', function(done) {
    let expected = this.elements.length;
    const handler = () => {
      expected--;
      if (expected === 0) {
        done();
      }
    };
    track(this.elements, handler);
  });
});

describe('adding an element that is visible', () => {
  it('should not track', () => {
    track(new Element(), () => {});
    assert.deepEqual(getTracking(), []);
  });
  it('should fire the handler', (done) => {
    track(new Element(), () => done());
  });
});

describe('adding an element that is not visible', function() {
  beforeEach(function() {
    this.elm = new Element({bottom: 3000, left: 8, right: 1200, top: 2900});
    this.elm2 = new Element({bottom: 3000, left: 8, right: 1200, top: 2900});
    track(this.elm, () => {});
    track(this.elm2, () => {});
  });

  it('should be in the tracking array', function(done) {
    RAF(() => {
      assert.deepEqual(getTracking().length, 2);
      done();
    });
  });

  it('handles when an element dynamically enters the viewport', function(done) {
    this.elm.top = 0;
    this.elm.right = 10;
    this.elm.bottom = 100;
    this.elm2.top = 0;
    this.elm2.right = 10;
    this.elm2.bottom = 100;

    RAF(() => {
      checkForVisibleElements();
      assert.deepEqual(getTracking(), []);
      done();
    });
  });
});

describe('scrolling an element into the viewport', () => {
  let elm;

  beforeEach(() => {
    elm = new Element({top: 600, bottom: 700});
  });

  it('should invoke the callback', (done) => {
    track(elm, () => done());

    RAF(() => {
      elm.top = 0;
      elm.right = 10;
      elm.bottom = 100;
      global.window.trigger('scroll');
    });
  });

  it('should untrack the element', (done) => {
    let elm = new Element({top: 600, bottom: 700});

    track(elm, () => {
      assert.deepEqual([], getTracking());
      done();
    });

    elm.top = 0;
    elm.right = 10;
    elm.bottom = 100;

    global.window.trigger('scroll');
  });
});

describe('handling an element with top offset', () => {
  let elm;

  beforeEach(() => {
    elm = new Element({top: 600, bottom: 700});
  });

  it('should detect the element and stop tracking', (done) => {
    track(elm, () => {}, {top: -60});
    elm.top = 250;

    RAF(() => {
      checkForVisibleElements();
      assert.deepEqual(getTracking(), []);
      done();
    });
  });

  it('should not detect the element and keep tracking', (done) => {
    track(elm, () => {}, {top: 60});
    elm.top = 150;

    RAF(() => {
      checkForVisibleElements();
      assert.equal(getTracking().length, 1);
      done();
    });
  });
});

describe('handling an element with bottom offset', () => {
  let elm;

  beforeEach(() => {
    elm = new Element({top: -200, bottom: -100});
  });

  it('should detect the element and stop tracking', (done) => {
    track(elm, () => {}, {bottom: -60});
    elm.bottom = -40;

    RAF(() => {
      checkForVisibleElements();
      assert.deepEqual(getTracking(), []);
      done();
    });
  });

  it('should not detect the element and keep tracking', (done) => {
    track(elm, () => {}, {bottom: 60});
    elm.bottom = 40;

    RAF(() => {
      checkForVisibleElements();
      assert.equal(getTracking().length, 1);
      done();
    });
  });
});

describe('handling an element with left offset', () => {
  let elm;

  beforeEach(() => {
    elm = new Element({top: 100, bottom: 200, left: 600, right: 800});
  });

  it('should detect the element and stop tracking', (done) => {
    track(elm, () => {}, {left: -60});
    elm.left = 540;

    RAF(() => {
      checkForVisibleElements();
      assert.deepEqual(getTracking(), []);
      done();
    });
  });

  it('should not detect the element and keep tracking', (done) => {
    track(elm, () => {}, {left: 60});
    elm.left = 460;

    RAF(() => {
      checkForVisibleElements();
      assert.equal(getTracking().length, 1);
      done();
    });
  });
});

describe('handling an element with right offset', () => {
  let elm;

  beforeEach(() => {
    elm = new Element({top: 100, bottom: 200, left: -200, right: -100});
  });

  it('should detect the element and stop tracking', (done) => {
    track(elm, () => {}, {right: -60});
    elm.right = -40;

    RAF(() => {
      checkForVisibleElements();
      assert.deepEqual(getTracking(), []);
      done();
    });
  });

  it('should not detect the element and keep tracking', (done) => {
    track(elm, () => {}, {right: 60});
    elm.right = 40;

    RAF(() => {
      checkForVisibleElements();
      assert.equal(getTracking().length, 1);
      done();
    });
  });
});
