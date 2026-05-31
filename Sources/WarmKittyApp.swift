import AppKit
import WebKit

/// Borderless window that can still become key/main so the web UI stays interactive.
final class KeyableWindow: NSWindow {
    override var canBecomeKey: Bool { true }
    override var canBecomeMain: Bool { true }
}

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var window: NSWindow!
    private let session = SessionController()
    private var bridge: Bridge?

    private let winSize = NSSize(width: 444, height: 626)
    private let titleBarHeight: CGFloat = 46
    private let trafficLightWidth: CGFloat = 72  // leave the HTML traffic lights clickable

    func applicationDidFinishLaunching(_ notification: Notification) {
        let (web, bridge) = makeWarmKittyWebView(session: session)
        self.bridge = bridge

        let container = NSView(frame: NSRect(origin: .zero, size: winSize))
        container.wantsLayer = true
        web.frame = container.bounds
        web.autoresizingMask = [.width, .height]
        container.addSubview(web)

        // Native drag strip over the title bar, excluding the traffic-light zone.
        let drag = DragStrip(frame: NSRect(
            x: trafficLightWidth,
            y: winSize.height - titleBarHeight,
            width: winSize.width - trafficLightWidth,
            height: titleBarHeight))
        drag.autoresizingMask = [.width, .minYMargin]
        container.addSubview(drag)

        // Titled + full-size-content gives a transparent, button-less window whose
        // system miniaturize/close still work (a pure .borderless window ignores
        // miniaturize because the style mask lacks .miniaturizable).
        window = KeyableWindow(
            contentRect: NSRect(origin: .zero, size: winSize),
            styleMask: [.titled, .closable, .miniaturizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.standardWindowButton(.closeButton)?.isHidden = true
        window.standardWindowButton(.miniaturizeButton)?.isHidden = true
        window.standardWindowButton(.zoomButton)?.isHidden = true
        window.isOpaque = false
        window.backgroundColor = .clear
        window.hasShadow = true
        window.isMovableByWindowBackground = true
        window.contentView = container
        window.center()
        window.makeKeyAndOrderFront(nil)

        NSApp.activate(ignoringOtherApps: true)
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

    func applicationWillTerminate(_ notification: Notification) {
        session.shutdown()
    }
}
