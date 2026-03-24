const NodeHelper = require("node_helper");
const fs = require("fs");
const path = require("path");

module.exports = NodeHelper.create({
  socketNotificationReceived(notification) {
    if (notification === "LOAD_NEGOTO") {
      const filePath = path.join(__dirname, "negoto.json");
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("[tesao_negoto] Failed to read negoto.json:", err);
          return;
        }
        try {
          const items = JSON.parse(data);
          this.sendSocketNotification("NEGOTO_ITEMS", items);
        } catch (e) {
          console.error("[tesao_negoto] Failed to parse negoto.json:", e);
        }
      });
    }
  },
});
