Module.register("tesao_negoto", {
  defaults: {
    updateInterval: 15000,
    animationSpeed: 1000,
  },

  start() {
    this.items = [];
    this.currentIndex = 0;
    this.sendSocketNotification("LOAD_NEGOTO");
  },

  getStyles() {
    return ["tesao_negoto.css"];
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "NEGOTO_ITEMS" && payload.length > 0) {
      this.items = payload;
      this.updateDom(this.config.animationSpeed);
      this.scheduleRotation();
    }
  },

  scheduleRotation() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.updateDom(this.config.animationSpeed);
    }, this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "negoto-wrapper";

    if (this.items.length === 0) {
      wrapper.classList.add("dimmed", "small");
      wrapper.textContent = "...";
      return wrapper;
    }

    const item = this.items[this.currentIndex];

    const text = document.createElement("p");
    text.className = "negoto-text";
    text.textContent = item.text;
    wrapper.appendChild(text);

    if (item.attribution) {
      const sep = document.createElement("div");
      sep.className = "negoto-separator";
      sep.textContent = "◆";
      wrapper.appendChild(sep);

      const attr = document.createElement("p");
      attr.className = "negoto-attribution";
      attr.textContent = `— ${item.attribution}`;
      wrapper.appendChild(attr);
    }

    return wrapper;
  },
});
