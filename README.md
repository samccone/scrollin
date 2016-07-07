Scrollin
==
<p align="center">
  <strong>Do something great when an element enters the viewport.</strong>
  <a href="https://travis-ci.org/samccone/scrollin"><img alt="Build Status" src="https://travis-ci.org/samccone/scrollin.svg" /></a> <br/>
  <img alt="scrollin" width="300px" src="https://cloud.githubusercontent.com/assets/883126/7601542/595b08ce-f8e5-11e4-9ba5-ee868f3004b9.png"/>
</p>

Install
==
<h4>
  <pre align="center">npm i scrollin</pre>
  <pre align="center">bower i scrollin</pre>
</h4>

Use
==
```js
Scrollin.track(document.querySelector('#hi'), () => alert('hi!'))
```

Options
==
You can specify optional offset params to control when an elements is considered in the "viewport".

```js
Scrollin.track(document.querySelector('#hi'), () => alert('hi!'), {
  top: 10,
  right: -10,
  bottom: 10,
  left: 10
})
```

API
==
* `Scrollin.track(document.querySelector('#hi'), () => alert('hi!'))`
* `Scrollin.track(document.querySelectorAll('.hi'), () => alert('hi!'))`
* `Scrollin.untrackAll()`
* `Scrollin.untrack(document.querySelector('#hi'))`
* `Scrollin.checkForVisibleElements()`
* `Scrollin.getTracking()`

Dev
==
* `npm i`
* `npm run dev`

#### Building

* `npm run compile`

#### Polyfill Caveats

* You may need to polyfill `window.requestAnimationFrame`
* You may need to polyfill `Array.prototype.splice`
* You may need to polyfill `Array.prototype.some`

📜
