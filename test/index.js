const assert = require('assert');
import {track, tracking, untrack} from '../index.js';
function RAF(cb) {
  setTimeout(cb, 0);
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
  },
  innerWidth: 500,
  innerHeight: 200,
  trigger: (evt) => global.window[evt].forEach((fn) => fn())
};

describe('adding an element that is visible', () => {
  it('should not track', () => {
    track(new Element(), {});
    assert.deepEqual(tracking, []);
  });
  it('should fire the handler', (done) => {
    track(new Element(), {handler: () => done()});
  });
});

describe('adding an element that is not visible', () => {
  it('should be in the tracking array', (done) => {
    let elm = new Element({bottom: 3000, left: 8, right: 1200, top: 2900});
    track(elm, {});

    global.window.requestAnimationFrame(() => {
      assert.deepEqual(tracking.length, 1);
      untrack(elm);
      done();
    });
  });
});

describe('scrolling an element into the viewport', () => {
  it('should invoke the callback', (done) => {
    let elm = new Element({top: 600, bottom: 700});
    track(elm, {handler: () => done()});

    RAF(() => {
      elm.top = 0;
      elm.right = 10;
      elm.bottom = 100;
      global.window.trigger('scroll');
    });
  });

  it('should untrack the element', (done) => {
    let elm = new Element({top: 600, bottom: 700});

    track(elm, {handler: () => {
      assert.deepEqual([], tracking);
      done();
    }});

    elm.top = 0;
    elm.right = 10;
    elm.bottom = 100;

    global.window.trigger('scroll');
  });
});
