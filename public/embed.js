/**
 * CalMeet Embed Script v1.0
 * Provides floating button and popup functionality for embedding CalMeet scheduling.
 */
(function () {
  "use strict";

  var CalMeet = {
    /**
     * Show a popup with the given booking URL.
     * @param {string} url - The booking page URL.
     */
    showPopup: function (url) {
      var existing = document.getElementById("calmeet-popup-overlay");
      if (existing) {
        existing.remove();
      }

      var overlay = document.createElement("div");
      overlay.id = "calmeet-popup-overlay";
      overlay.style.cssText = [
        "position:fixed", "top:0", "left:0", "width:100%", "height:100%",
        "background:rgba(0,0,0,0.55)", "z-index:999999",
        "display:flex", "align-items:center", "justify-content:center",
        "backdrop-filter:blur(4px)", "-webkit-backdrop-filter:blur(4px)",
        "animation:calmeet-fadein 0.2s ease"
      ].join(";");

      var modal = document.createElement("div");
      modal.style.cssText = [
        "background:#fff", "border-radius:20px", "overflow:hidden",
        "width:min(680px,94vw)", "height:min(720px,90vh)",
        "box-shadow:0 32px 80px rgba(0,0,0,0.3)",
        "display:flex", "flex-direction:column",
        "animation:calmeet-slidein 0.25s ease"
      ].join(";");

      // Top bar with close button
      var topBar = document.createElement("div");
      topBar.style.cssText = [
        "display:flex", "align-items:center", "justify-content:space-between",
        "padding:12px 16px", "border-bottom:1px solid #e5e7eb",
        "background:#f9fafb"
      ].join(";");

      var title = document.createElement("span");
      title.textContent = "Schedule a Meeting";
      title.style.cssText = "font-size:14px;font-weight:600;color:#111827;font-family:system-ui,sans-serif";

      var closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      closeBtn.style.cssText = [
        "background:none", "border:none", "font-size:22px", "cursor:pointer",
        "color:#6b7280", "line-height:1", "padding:0 4px",
        "border-radius:6px", "transition:background 0.15s"
      ].join(";");
      closeBtn.onmouseover = function () { this.style.background = "#f3f4f6"; };
      closeBtn.onmouseout = function () { this.style.background = "none"; };
      closeBtn.onclick = function () { overlay.remove(); };

      topBar.appendChild(title);
      topBar.appendChild(closeBtn);

      var iframe = document.createElement("iframe");
      iframe.src = url + (url.indexOf("?") !== -1 ? "&" : "?") + "embed=true";
      iframe.style.cssText = "flex:1;border:none;width:100%;height:100%";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowfullscreen", "true");

      modal.appendChild(topBar);
      modal.appendChild(iframe);
      overlay.appendChild(modal);

      // Close on overlay click (outside modal)
      overlay.onclick = function (e) {
        if (e.target === overlay) overlay.remove();
      };

      // Close on Escape key
      var escHandler = function (e) {
        if (e.key === "Escape") {
          overlay.remove();
          document.removeEventListener("keydown", escHandler);
        }
      };
      document.addEventListener("keydown", escHandler);

      // Inject keyframe animations once
      if (!document.getElementById("calmeet-styles")) {
        var style = document.createElement("style");
        style.id = "calmeet-styles";
        style.textContent = [
          "@keyframes calmeet-fadein{from{opacity:0}to{opacity:1}}",
          "@keyframes calmeet-slidein{from{opacity:0;transform:translateY(16px) scale(0.97)}to{opacity:1;transform:none}}"
        ].join("");
        document.head.appendChild(style);
      }

      document.body.appendChild(overlay);
    },

    /**
     * Create a floating booking button in the corner of the page.
     * @param {Object} options
     * @param {string} options.url       - The booking page URL.
     * @param {string} [options.text]    - Button label (default: "Book a Meeting").
     * @param {string} [options.color]   - Button background color (default: "#006bff").
     * @param {string} [options.textColor] - Button text color (default: "#ffffff").
     * @param {string} [options.position] - "bottom-right" | "bottom-left" (default: "bottom-right").
     */
    initFloatingButton: function (options) {
      options = options || {};
      var url = options.url;
      if (!url) { console.warn("[CalMeet] initFloatingButton: 'url' is required."); return; }

      var text = options.text || "Book a Meeting";
      var color = options.color || "#006bff";
      var textColor = options.textColor || "#ffffff";
      var position = options.position === "bottom-left" ? "left:24px" : "right:24px";

      var existing = document.getElementById("calmeet-floating-btn");
      if (existing) existing.remove();

      var btn = document.createElement("button");
      btn.id = "calmeet-floating-btn";
      btn.textContent = text;
      btn.style.cssText = [
        "position:fixed", "bottom:24px", position,
        "background:" + color, "color:" + textColor,
        "border:none", "border-radius:50px",
        "padding:14px 24px", "font-size:15px", "font-weight:600",
        "cursor:pointer", "z-index:99998",
        "box-shadow:0 8px 24px rgba(0,0,0,0.18)",
        "font-family:system-ui,sans-serif",
        "transition:transform 0.2s,box-shadow 0.2s",
        "display:flex", "align-items:center", "gap:8px"
      ].join(";");

      // Calendar icon
      var icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("width", "18");
      icon.setAttribute("height", "18");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("fill", "none");
      icon.setAttribute("stroke", textColor);
      icon.setAttribute("stroke-width", "2");
      icon.setAttribute("stroke-linecap", "round");
      icon.setAttribute("stroke-linejoin", "round");
      icon.innerHTML = '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>';
      btn.insertBefore(icon, btn.firstChild);

      btn.onmouseover = function () {
        this.style.transform = "scale(1.05)";
        this.style.boxShadow = "0 12px 32px rgba(0,0,0,0.24)";
      };
      btn.onmouseout = function () {
        this.style.transform = "scale(1)";
        this.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
      };
      btn.onclick = function () { CalMeet.showPopup(url); };

      document.body.appendChild(btn);
    }
  };

  // Expose globally
  window.CalMeet = CalMeet;
})();
