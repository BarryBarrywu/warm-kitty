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
    }

    var currentVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "0.0.0"
    }

    var autoCheckEnabled: Bool {
        controller.updater.automaticallyChecksForUpdates
    }

    func setAutoCheck(_ enabled: Bool) {
        controller.updater.automaticallyChecksForUpdates = enabled
    }

    func checkForUpdates() {
        controller.checkForUpdates(nil)
    }
}

import ServiceManagement

extension UpdateChecker {
    /// `.requiresApproval` means the user enabled it but macOS is waiting for
    /// confirmation in System Settings — still reflects the user's intent, so the
    /// toggle should read on rather than snapping back off.
    var launchAtLogin: Bool {
        let status = SMAppService.mainApp.status
        return status == .enabled || status == .requiresApproval
    }

    func setLaunchAtLogin(_ enabled: Bool) {
        do {
            if enabled { try SMAppService.mainApp.register() }
            else { try SMAppService.mainApp.unregister() }
        } catch {
            NSLog("WarmKitty: launch-at-login change failed: \(error.localizedDescription)")
        }
        if enabled, SMAppService.mainApp.status == .requiresApproval {
            SMAppService.openSystemSettingsLoginItems()
        }
    }
}
