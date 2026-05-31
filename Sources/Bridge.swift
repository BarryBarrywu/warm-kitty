import AppKit
import WebKit

/// Connects the web UI and the native session: forwards page actions
/// (start/stop/target/window) to the SessionController, and pushes real
/// temperature + running state back into the page.
final class Bridge: NSObject, WKScriptMessageHandler {
    private let session: SessionController
    weak var webView: WKWebView?

    init(session: SessionController) {
        self.session = session
        super.init()

        session.onTemperature = { [weak self] temp in
            let arg = temp.map { String(format: "%.1f", $0) } ?? "null"
            self?.eval("window.warmkitty && warmkitty.onTemp(\(arg))")
        }
        session.onRunningChanged = { [weak self] running in
            self?.eval("window.warmkitty && warmkitty.onRunning(\(running))")
        }
        session.onReachedTarget = { [weak self] in
            self?.eval("window.warmkitty && warmkitty.onDing()")
        }
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let type = body["type"] as? String else { return }

        switch type {
        case "ready":
            let v = (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String) ?? ""
            eval("window.warmkitty && warmkitty.onVersion('\(v)')")
            session.begin()
        case "start":
            let target = (body["target"] as? NSNumber)?.doubleValue ?? 80
            session.start(target: target)
        case "stop":
            session.stop()
        case "setTarget":
            if let v = (body["value"] as? NSNumber)?.doubleValue { session.setTarget(v) }
        case "setMaxMinutes":
            if let v = (body["value"] as? NSNumber)?.doubleValue { session.setMaxMinutes(v) }
        case "openURL":
            if let s = body["url"] as? String, let url = URL(string: s) { NSWorkspace.shared.open(url) }
        case "window":
            handleWindow(body["action"] as? String)
        default:
            break
        }
    }

    private func handleWindow(_ action: String?) {
        // Borderless windows ignore performClose/performMiniaturize, so act directly.
        let win = webView?.window
        switch action {
        case "close": NSApp.terminate(nil)
        case "minimize": win?.miniaturize(nil)
        case "zoom": win?.zoom(nil)
        default: break
        }
    }

    private func eval(_ js: String) {
        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript(js, completionHandler: nil)
        }
    }
}
