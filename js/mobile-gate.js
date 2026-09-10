var e=1100;function t(){let el=document.createElement(`div`);el.className=`desktop-gate`;el.innerHTML=`
    <img src="images/walking-character.gif" alt="" class="desktop-gate__walker" />
    <div class="desktop-gate__label">heads up</div>
    <h1 class="desktop-gate__title">this site's built for a bigger screen</h1>
    <p class="desktop-gate__body">some of the details here — hover states, a custom cursor, side-scrolling panels — need a mouse and a bit more room to breathe.</p>
    <button class="desktop-gate__dismiss" id="desktop-gate-dismiss">continue anyway →</button>
  `;document.body.appendChild(el);let btn=el.querySelector(`#desktop-gate-dismiss`);if(btn){btn.addEventListener(`click`,function(){sessionStorage.setItem(`desktopGateDismissed`,`true`);el.remove()})}return el}function n(){if(sessionStorage.getItem(`desktopGateDismissed`)===`true`){let r=document.querySelector(`.desktop-gate`);if(r)r.remove();return}let isSmall=window.innerWidth<e,r=document.querySelector(`.desktop-gate`);isSmall&&!r?t():!isSmall&&r&&r.remove()}n(),window.addEventListener(`resize`,n);