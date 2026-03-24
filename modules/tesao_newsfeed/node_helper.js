const NodeHelper = require("node_helper");
const Parser = require("rss-parser");
const QRCode = require("qrcode");

module.exports = NodeHelper.create({
  start() {
    this.feeds = {};
    this.allItems = [];
    this.parser = new Parser({
      timeout: 10000,
      headers: { "User-Agent": "MagicMirror tesao_newsfeed" }
    });
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "ADD_FEED") {
      this.addFeed(payload.feed, payload.config);
    }
  },

  addFeed(feed, config) {
    if (this.feeds[feed.url]) return;

    const reloadInterval = config.reloadInterval || 5 * 60 * 1000;

    this.feeds[feed.url] = {
      title: feed.title,
      interval: setInterval(() => this.fetchFeed(feed, config), reloadInterval)
    };

    this.fetchFeed(feed, config);
  },

  async fetchFeed(feed, config) {
    try {
      const result = await this.parser.parseURL(feed.url);

      const items = await Promise.all(
        result.items.slice(0, config.maxItems || 20).map(async (item) => {
          const articleUrl = item.link || item.url || "";
          let qrDataUrl = null;

          if (articleUrl) {
            try {
              qrDataUrl = await QRCode.toDataURL(articleUrl, {
                width: config.qrSize || 80,
                margin: 1,
                color: {
                  dark: "#ffffff",
                  light: "#00000000"
                }
              });
            } catch (e) {
              Log.warn(`[tesao_newsfeed] QR generation failed for ${articleUrl}: ${e.message}`);
            }
          }

          return {
            title: item.title || "",
            url: articleUrl,
            pubdate: item.pubDate || item.isoDate || "",
            sourceTitle: feed.title,
            qrDataUrl
          };
        })
      );

      // Merge items from all feeds, sorted by pubdate descending
      this.allItems = this.allItems
        .filter(i => i.sourceTitle !== feed.title)
        .concat(items)
        .sort((a, b) => new Date(b.pubdate) - new Date(a.pubdate));

      this.sendSocketNotification("NEWS_ITEMS", this.allItems);
    } catch (e) {
      Log.error(`[tesao_newsfeed] Failed to fetch ${feed.url}: ${e.message}`);
    }
  }
});
