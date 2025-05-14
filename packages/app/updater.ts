import { config } from "@/config";
import { is } from "@electron-toolkit/utils";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

class AppUpdater {
	init() {
		if (is.dev || !config.get("updates.autoCheck")) {
			return;
		}

		log.transports.file.level = is.dev ? "info" : "error";
		autoUpdater.logger = log;

		autoUpdater.checkForUpdatesAndNotify();

		setInterval(
			() => {
				autoUpdater.checkForUpdatesAndNotify();
			},
			1000 * 60 * 60 * 3,
		);
	}

	checkForUpdates() {
		if (is.dev) {
			return;
		}

		autoUpdater.checkForUpdatesAndNotify();
	}
}

export const appUpdater = new AppUpdater();
