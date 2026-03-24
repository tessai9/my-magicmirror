/* global Module, Log */

Module.register("tesao_newsfeed", {
  defaults: {
    feeds: [],
    updateInterval: 30 * 1000,   // 記事の切り替え間隔 (ms)
    reloadInterval: 5 * 60 * 1000, // RSSの再取得間隔 (ms)
    animationSpeed: 500,
    maxItems: 20,
    showSourceTitle: true,
    showPublishDate: true,
    qrSize: 80
  },

  start() {
    Log.info(`Starting module: ${this.name}`);
    this.newsItems = [];
    this.currentIndex = 0;
    this.loaded = false;
    this.rotationTimer = null;

    this.config.feeds.forEach((feed) => {
      this.sendSocketNotification("ADD_FEED", {
        feed,
        config: this.config
      });
    });
  },

  getStyles() {
    return ["tesao_newsfeed.css"];
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "NEWS_ITEMS") {
      this.newsItems = payload;
      if (!this.loaded) {
        this.loaded = true;
        this.scheduleRotation();
      }
      this.updateDom(this.config.animationSpeed);
    }
  },

  scheduleRotation() {
    clearInterval(this.rotationTimer);
    this.rotationTimer = setInterval(() => {
      if (this.newsItems.length === 0) return;
      this.currentIndex = (this.currentIndex + 1) % this.newsItems.length;
      this.updateDom(this.config.animationSpeed);
    }, this.config.updateInterval);
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "tesao-newsfeed";

    if (!this.loaded) {
      wrapper.classList.add("dimmed", "light", "small");
      wrapper.textContent = this.translate("LOADING");
      return wrapper;
    }

    if (this.newsItems.length === 0) {
      wrapper.classList.add("dimmed", "light", "small");
      wrapper.textContent = "ニュースがありません";
      return wrapper;
    }

    const item = this.newsItems[this.currentIndex % this.newsItems.length];

    // --- テキスト部分 ---
    const textArea = document.createElement("div");
    textArea.className = "news-text-area";

    if (this.config.showSourceTitle && item.sourceTitle) {
      const source = document.createElement("span");
      source.className = "news-source bright";
      source.textContent = item.sourceTitle;
      textArea.appendChild(source);

      const sep = document.createElement("span");
      sep.className = "news-sep dimmed";
      sep.textContent = " | ";
      textArea.appendChild(sep);
    }

    const title = document.createElement("span");
    title.className = "news-title small";
    title.textContent = item.title;
    textArea.appendChild(title);

    if (this.config.showPublishDate && item.pubdate) {
      const date = document.createElement("span");
      date.className = "news-date dimmed xsmall";
      date.textContent = " " + new Date(item.pubdate).toLocaleDateString("ja-JP");
      textArea.appendChild(date);
    }

    wrapper.appendChild(textArea);

    // --- QRコード部分 ---
    if (item.qrDataUrl) {
      const qrArea = document.createElement("div");
      qrArea.className = "news-qr";

      const img = document.createElement("img");
      img.src = item.qrDataUrl;
      img.width = this.config.qrSize;
      img.height = this.config.qrSize;
      img.alt = "QR";

      qrArea.appendChild(img);
      wrapper.appendChild(qrArea);
    }

    return wrapper;
  }
});
