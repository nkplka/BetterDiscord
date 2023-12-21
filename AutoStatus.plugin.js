/**
 * @name AutoStatus
 * @description Automatically updates your discord status
 * @version 0.0.1
 * @author nkpl
 */

module.exports = class AutoStatus {
    constructor() {
        this.statuses = ['online', 'idle', 'invisible', 'dnd'];
        this.currentStatusIndex = 0;
        this.UserSettingsProtoUtils = null;
        this.loadModules();
    }

    loadModules() {
        this.UserSettingsProtoUtils = BdApi.Webpack.getModule(
            (m) => m.ProtoClass && m.ProtoClass.typeName.endsWith(".PreloadedUserSettings"),
            { first: true, searchExports: true }
        );
    }

    start() {
        this.statusInterval = setInterval(() => {
            this.updateStatus(this.statuses[this.currentStatusIndex]);
            this.currentStatusIndex = (this.currentStatusIndex + 1) % this.statuses.length;
        }, 3000); 
    }

    stop() {
        clearInterval(this.statusInterval); 
    }

    updateStatus(toStatus) {
        if (!this.UserSettingsProtoUtils) {
            console.error("UserSettingsProtoUtils не найден");
            return;
        }
        this.UserSettingsProtoUtils.updateAsync(
            "status",
            (statusSetting) => {
                statusSetting.status.value = toStatus;
            },
            0
        );
    }
}
