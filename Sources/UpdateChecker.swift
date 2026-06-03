import Foundation
import Sparkle

/// Thin wrapper around Sparkle's standard updater. The web UI drives it through
/// the Bridge: read the current version, toggle automatic background checks, and
/// trigger a manual check (which shows Sparkle's standard update window).
///
/// No gentle reminders / notifications: every surfaced update uses Sparkle's
/// standard modal, which is fine for a foreground windowed app.
final class UpdateChecker: NSObject {
    private let controller: SPUStandardUpdaterController

    override init() {
        controller = SPUStandardUpdaterController(
            startingUpdater: true,
            updaterDelegate: nil,
            userDriverDelegate: nil
        )
        super.init()
        let enabled = (UserDefaults.standard.object(forKey: "autoCheckUpdates") as? Bool) ?? true
        controller.updater.automaticallyChecksForUpdates = enabled
    }

    var currentVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0.0.0"
    }

    var autoCheckEnabled: Bool {
        controller.updater.automaticallyChecksForUpdates
    }

    func setAutoCheck(_ enabled: Bool) {
        UserDefaults.standard.set(enabled, forKey: "autoCheckUpdates")
        controller.updater.automaticallyChecksForUpdates = enabled
    }

    func checkForUpdates() {
        controller.checkForUpdates(nil)
    }
}
