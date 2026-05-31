import AppKit
import WebKit

/// Transparent strip over the HTML title bar that lets the user drag the
/// borderless window. WKWebView swallows mouse events, so dragging requires a
/// native view above it. `performDrag(with:)` is the reliable way to move a
/// borderless window; `mouseDownCanMoveWindow` is kept as a fallback.
final class DragStrip: NSView {
    override var mouseDownCanMoveWindow: Bool { true }
    override func mouseDown(with event: NSEvent) {
        window?.performDrag(with: event)
    }
}

/// Builds the configured web view + bridge that loads the bundled design.
func makeWarmKittyWebView(session: SessionController) -> (WKWebView, Bridge) {
    let bridge = Bridge(session: session)
    let config = WKWebViewConfiguration()
    config.userContentController.add(bridge, name: "bridge")

    let web = WKWebView(frame: NSRect(x: 0, y: 0, width: 444, height: 626), configuration: config)
    web.setValue(false, forKey: "drawsBackground") // transparent background
    web.wantsLayer = true
    web.layer?.cornerRadius = 18
    web.layer?.masksToBounds = true
    bridge.webView = web

    let dir = Bundle.main.resourceURL!.appendingPathComponent("web")
    web.loadFileURL(dir.appendingPathComponent("index.html"), allowingReadAccessTo: dir)
    return (web, bridge)
}
