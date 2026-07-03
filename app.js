document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector("#themeToggle");
  const canvas = document.querySelector("#solarCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const metricSlider = document.querySelector("#metricSlider");
  const metricOutput = document.querySelector("#metricOutput");
  const metricText = document.querySelector("#metricText");

  const filters = document.querySelectorAll(".filter");
  const publications = document.querySelectorAll(".pub-card");

  const tabs = document.querySelectorAll(".tab");
  const projectView = document.querySelector("#projectView");

  const skillButtons = document.querySelectorAll(".skill-cloud button");
  const skillNote = document.querySelector("#skillNote");

  const projectData = {
    counter: {
      kicker: "Arduino Uno + LCD",
      title: "Three-Digit Object Counter",
      body: "Designed a precise object counter using Arduino Uno and LCD output for clear live counts.",
    },
    distance: {
      kicker: "PIC + Ultrasonic Sensor",
      title: "Distance Measurement of an Object",
      body: "Built a microcontroller-based distance measurement system using PIC, PICKit Programmer, and ultrasonic sensing.",
    },
    building: {
      kicker: "AutoCAD Electrical",
      title: "Electrical Design of a 2300 sq. ft. Residential Building",
      body: "Prepared fittings, fixtures, and conduit drawings for a residential electrical design workflow.",
    },
  };

  const metricStates = [
    {
      limit: 34,
      label: "Layer thickness",
      text: "Thickness tuning changes absorption and transport behavior across the tandem stack.",
    },
    {
      limit: 67,
      label: "Current matching",
      text: "Balanced current flow improves tandem-cell efficiency by reducing mismatch losses between subcells.",
    },
    {
      limit: 101,
      label: "ML prediction",
      text: "Machine learning can estimate useful top-cell thickness values before slower simulation sweeps.",
    },
  ];

  function setTheme() {
    body.classList.toggle("dark");
    localStorage.setItem(
      "rana-portfolio-theme",
      body.classList.contains("dark") ? "dark" : "light"
    );
  }

  function restoreTheme() {
    if (localStorage.getItem("rana-portfolio-theme") === "dark") {
      body.classList.add("dark");
    }
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.offsetWidth * ratio);
    canvas.height = Math.floor(canvas.offsetHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawSolarField(time) {
    if (!canvas || !ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    const dark = body.classList.contains("dark");
    ctx.fillStyle = dark ? "#101512" : "#f7f5ef";
    ctx.fillRect(0, 0, width, height);

    const cols = Math.max(8, Math.floor(width / 130));
    const rows = Math.max(6, Math.floor(height / 95));
    const cellW = width / cols;
    const cellH = height / rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const pulse = Math.sin(time * 0.0014 + x * 0.7 + y * 0.45);
        const alpha = 0.12 + pulse * 0.055;

        const px = x * cellW + 16;
        const py = y * cellH + 18;
        const rectW = cellW - 32;
        const rectH = cellH - 28;

        ctx.fillStyle = dark
          ? `rgba(66, 201, 167, ${alpha})`
          : `rgba(18, 108, 90, ${alpha})`;

        ctx.strokeStyle = dark
          ? "rgba(141, 184, 255, 0.22)"
          : "rgba(47, 95, 158, 0.18)";

        ctx.lineWidth = 1;
        ctx.beginPath();

        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(px, py, rectW, rectH, 8);
        } else {
          ctx.rect(px, py, rectW, rectH);
        }

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = dark
          ? "rgba(240, 190, 85, 0.24)"
          : "rgba(216, 166, 63, 0.26)";

        ctx.fillRect(px + 10, py + 12 + pulse * 3, Math.max(10, cellW - 52), 3);
      }
    }

    requestAnimationFrame(drawSolarField);
  }

  function updateMetric() {
    if (!metricSlider || !metricOutput || !metricText) return;

    const value = Number(metricSlider.value);
    const state =
      metricStates.find((item) => value <= item.limit) ||
      metricStates[metricStates.length - 1];

    metricOutput.textContent = state.label;
    metricText.textContent = state.text;
  }

  function applyFilter(filterValue) {
    publications.forEach((card) => {
      const matches = filterValue === "all" || card.dataset.status === filterValue;
      card.classList.toggle("is-hidden", !matches);
    });
  }

  function renderProject(key) {
    if (!projectView || !projectData[key]) return;

    const data = projectData[key];

    projectView.innerHTML = `
      <p class="section-kicker">${data.kicker}</p>
      <h3>${data.title}</h3>
      <p>${data.body}</p>
    `;
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", setTheme);
  }

  if (metricSlider) {
    metricSlider.addEventListener("input", updateMetric);
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("active"));
      filter.classList.add("active");
      applyFilter(filter.dataset.filter);
    });
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderProject(tab.dataset.project);
    });
  });

  skillButtons.forEach((skillBtn) => {
    skillBtn.addEventListener("click", () => {
      const alreadyActive = skillBtn.classList.contains("active");

      skillButtons.forEach((btn) => btn.classList.remove("active"));

      if (!alreadyActive) {
        skillBtn.classList.add("active");
        if (skillNote) {
          skillNote.textContent = `Highlighted: ${skillBtn.dataset.skill}.`;
        }
      } else if (skillNote) {
        skillNote.textContent = "Select a tool to highlight Rana's working stack.";
      }
    });
  });

  restoreTheme();
  resizeCanvas();
  updateMetric();

  if (canvas && ctx) {
    requestAnimationFrame(drawSolarField);
    window.addEventListener("resize", resizeCanvas);
  }
});
