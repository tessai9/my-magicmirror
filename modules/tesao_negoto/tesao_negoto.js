Module.register("tesao_negoto", {
  defaults: {
    updateInterval: 15000,
    animationSpeed: 1000,
  },

  start() {
    this.items = [];
    this.queue = [];
    this.currentIndex = 0;
    this.sendSocketNotification("LOAD_NEGOTO");
  },

  getStyles() {
    return ["tesao_negoto.css"];
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "NEGOTO_ITEMS" && payload.length > 0) {
      this.items = payload;
      this.queue = this.shuffle(this.items);
      this.currentIndex = 0;
      this.updateDom(this.config.animationSpeed);
      this.scheduleRotation();
    }
  },

  shuffle(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  reshuffleAvoidingLast(lastItem) {
    const q = this.shuffle(this.items);
    if (q[0] === lastItem && q.length > 1) {
      const swapIdx = Math.floor(Math.random() * (q.length - 1)) + 1;
      [q[0], q[swapIdx]] = [q[swapIdx], q[0]];
    }
    return q;
  },

  scheduleRotation() {
    setInterval(() => {
      this.currentIndex++;
      if (this.currentIndex >= this.queue.length) {
        const lastItem = this.queue[this.queue.length - 1];
        this.queue = this.reshuffleAvoidingLast(lastItem);
        this.currentIndex = 0;
      }
      this.updateDom(this.config.animationSpeed);
    }, this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "negoto-wrapper";

    if (this.queue.length === 0) {
      wrapper.classList.add("dimmed", "small");
      wrapper.textContent = "...";
      return wrapper;
    }

    const item = this.queue[this.currentIndex];

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
