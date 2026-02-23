window.addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById("start-screen");
  const big = document.getElementById("big-btn");
  const small = document.getElementById("small-btn");
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const video = document.getElementById("videoFullscreen");

  // Depuració: assegura'ns que hem trobat els elements
  console.log("DOM loaded:", { start: !!start, big: !!big, small: !!small, header: !!header, main: !!main, video: !!video });

  // Handler comú: reproduir vídeo (mateix comportament per ambdós botons)
  function playVideoHandlerFromUI() {
    console.log("playVideoHandlerFromUI: click received");
    if (!video) {
      console.error("No video element found");
      return;
    }

    // Amaguem la pantalla d'inici
    if (start) start.style.display = "none";

    // Mostrar la pàgina principal (igual que l'altre botó)
    if (header) header.classList.remove("hidden");
    if (main) main.classList.remove("hidden");

    // Reproduir vídeo
    playVideo();
  }

  // Assignem listeners de manera robusta
  if (big) {
    big.addEventListener("click", playVideoHandlerFromUI);
    // redundància: també posem la funció com a onclick (per si hi ha algun listener que sobreescriu)
    big.onclick = playVideoHandlerFromUI;
  } else {
    console.warn("big-btn no trobat");
  }

  if (small) {
    small.addEventListener("click", () => {
      console.log("small-btn clicked");
      if (start) start.style.display = "none";
      if (header) header.classList.remove("hidden");
      if (main) main.classList.remove("hidden");
    });
  }

  // Quan acaba el vídeo → mostrar web
  if (video) {
    video.addEventListener("ended", () => {
      console.log("video ended");
      finishVideo();
    });
  }

  // També protegim contra errors JS que trenquin l'escoltador
  window.addEventListener("error", (ev) => {
    console.error("Window error captured:", ev.error || ev.message);
  });
});

// Reprodueix el vídeo (funció reutilitzable)
function playVideo() {
  const video = document.getElementById("videoFullscreen");
  if (!video) return;

  video.style.display = "block";
  video.currentTime = 0;

  // Esperem un xic perquè el navegador apuntali el repaint (especialment en local)
  setTimeout(() => {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("video.play() succeeded");
          // Ens assegurem que el so estigui activat si vols:
          try {
            video.muted = false;
            video.volume = 1;
          } catch (e) {
            // alguns navegadors restringeixen canviar volum programàticament
            console.warn("No es pot forçar volum:", e);
          }
        })
        .catch(err => {
          console.error("video.play() error:", err);
          // Si hi ha error d'autoplay, mostra controls perquè l'usuari pugui iniciar manualment
          video.controls = true;
        });
    }
  }, 50);
}

// Finalitzar vídeo: amagar i mostrar web
function finishVideo() {
  const video = document.getElementById("videoFullscreen");
  if (video) {
    video.style.display = "none";
    // opcional: pause/stop
    try { video.pause(); } catch(e) {}
  }
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  if (header) header.classList.remove("hidden");
  if (main) main.classList.remove("hidden");

  // treure controls si s'havien posat per error d'autoplay
  if (video) {
    video.controls = false;
  }
}

// Funció del menú
function showSection(id) {
  const sections = ["festa", "regal", "extra","gemma","portar"];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.classList.add("hidden");
  });
  const t = document.getElementById(id);
  if (t) t.classList.remove("hidden");
}


