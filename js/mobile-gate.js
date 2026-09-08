var e=1100;function t(){let e=document.createElement(`div`);return e.className=`desktop-gate`,e.innerHTML=`
    <img src="images/walking-character.gif" alt="" class="desktop-gate__walker" />
    <div class="desktop-gate__label">heads up</div>
    <h1 class="desktop-gate__title">this site's built for a bigger screen</h1>
    <p class="desktop-gate__body">some of the details here — hover states, a custom cursor, side-scrolling panels — need a mouse and a bit more room to breathe.</p>
  `,document.body.appendChild(e),e}function n(){let n=window.innerWidth<e,r=document.querySelector(`.desktop-gate`);n&&!r?t():!n&&r&&r.remove()}n(),window.addEventListener(`resize`,n);