/* global Module */

/* Magic Mirror
 * Module: Calendar
 *
 * By Cline
 * MIT Licensed.
 */

Module.register("tesao_calendar", {
	// Default module config.
	defaults: {
		// No specific config needed for basic version yet
	},

	// Define required styles.
	getStyles: function () {
		return ["tesao_calendar.css"];
	},

	// Override start method.
	start: function () {
		Log.info("Starting module: " + this.name);
		// Update the calendar every hour to keep the 'today' highlight accurate
		// in case the mirror runs overnight.
		setInterval(() => {
			this.updateDom();
		}, 3600 * 1000); // Update every hour
	},

	// Override dom generator.
	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = "calendar"; // Add class for CSS styling

		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth(); // 0-indexed (0 for January)
		const today = now.getDate();

		// --- Header ---
		const header = document.createElement("div");
		header.className = "header";
		// Format month name (e.g., "April 2025")
		header.innerHTML = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now);
		wrapper.appendChild(header);

		// --- Calendar Table ---
		const table = document.createElement("table");
		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		// Day Headers (Sun, Mon, ...)
		const thead = document.createElement("thead");
		const headerRow = document.createElement("tr");
		daysOfWeek.forEach(day => {
			const th = document.createElement("th");
			th.textContent = day;
			headerRow.appendChild(th);
		});
		thead.appendChild(headerRow);
		table.appendChild(thead);

		// Calendar Body (Dates)
		const tbody = document.createElement("tbody");
		const firstDayOfMonth = new Date(year, month, 1);
		const lastDayOfMonth = new Date(year, month + 1, 0);
		const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, ...
		const totalDays = lastDayOfMonth.getDate();

		let date = 1;
		for (let i = 0; i < 6; i++) { // Max 6 rows needed
			const row = document.createElement("tr");
			for (let j = 0; j < 7; j++) {
				const cell = document.createElement("td");
				if (i === 0 && j < startingDay) {
					// Empty cells before the 1st day
					cell.innerHTML = "&nbsp;";
				} else if (date > totalDays) {
					// Empty cells after the last day
					cell.innerHTML = "&nbsp;";
				} else {
					cell.textContent = date;
					if (date === today) {
						cell.classList.add("today"); // Highlight today's date
					}
					date++;
				}
				row.appendChild(cell);
			}
			tbody.appendChild(row);
			if (date > totalDays) {
				break; // Stop creating rows if all dates are placed
			}
		}
		table.appendChild(tbody);
		wrapper.appendChild(table);

		return wrapper;
	}
});
