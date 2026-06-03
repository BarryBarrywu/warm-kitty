import AppKit
import SwiftUI

final class KeyableWindow: NSWindow {
    override var canBecomeKey: Bool { true }
    override var canBecomeMain: Bool { true }
}

/// Hosting view that reports no safe-area insets, so the SwiftUI content (including
/// our custom title bar) fills from the true top of the full-size-content window
/// instead of being pushed down by the system title-bar inset.
final class NoSafeAreaHostingView<V: View>: NSHostingView<V> {
    override var safeAreaInsets: NSEdgeInsets { NSEdgeInsets() }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var window: NSWindow!
    private let session = SessionController()
    private let updateChecker = UpdateChecker()
    private let audio = AudioController()
    private lazy var settings = SettingsStore()
    private lazy var locale = LocaleManager(stored: settings.language)

    private let winSize = NSSize(width: 444, height: 690)
    private let titleBarHeight: CGFloat = 46
    private let trafficLightWidth: CGFloat = 72
    private let rightControlWidth: CGFloat = 64

    func applicationDidFinishLaunching(_ notification: Notification) {
        let root = RootView(session: session, settings: settings, locale: locale,
                            updateChecker: updateChecker, audio: audio)
        let host = NoSafeAreaHostingView(rootView: root)
        host.frame = NSRect(origin: .zero, size: winSize)
        host.autoresizingMask = [.width, .height]

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        container.addSubview(host)

        let drag = DragStripView(frame: NSRect(
            x: trafficLightWidth, y: winSize.height - titleBarHeight,
            width: winSize.width - trafficLightWidth - rightControlWidth, height: titleBarHeight))
        drag.autoresizingMask = [.width, .minYMargin]
        container.addSubview(drag)

        window = KeyableWindow(
            contentRect: NSRect(origin: .zero, size: winSize),
            styleMask: [.titled, .closable, .miniaturizable, .fullSizeContentView],
            backing: .buffered, defer: false)
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.standardWindowButton(.closeButton)?.isHidden = true
        window.standardWindowButton(.miniaturizeButton)?.isHidden = true
        window.standardWindowButton(.zoomButton)?.isHidden = true
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = true
        window.isMovableByWindowBackground = false
        window.contentView = container
        window.center()
        window.makeKeyAndOrderFront(nil)
        NSApp.activate(ignoringOtherApps: true)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }
    func applicationWillTerminate(_ notification: Notification) { session.shutdown() }
}

/// The native drag strip over the (button-hidden) title bar.
final class DragStripView: NSView {
    override var mouseDownCanMoveWindow: Bool { true }
}
