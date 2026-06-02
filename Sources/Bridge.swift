import AppKit
import WebKit

/// Connects the web UI and the native session: forwards page actions
/// (start/stop/window/openURL) to the SessionController, and pushes the
/// countdown tick, running state, and done event back into the page.
final class Bridge: NSObject, WKScriptMessageHandler {
    private let session: SessionController
    weak var webView: WKWebView?

    init(session: SessionController) {
        self.session = session
        super.init()

        session.onTick = { [weak self] remaining, total in
            self?.eval("window.warmkitty && warmkitty.onTick(\(remaining), \(total))")
        }
        session.onRunningChanged = { [weak self] running in
            self?.eval("window.warmkitty && warmkitty.onRunning(\(running))")
        }
        session.onDone = { [weak self] in
            self?.eval("window.warmkitty && warmkitty.onDone()")
        }
    }

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let type = body["type"] as? String else { return }

        switch type {
        case "ready":
            let v = (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String) ?? ""
            eval("window.warmkitty && warmkitty.onVersion('\(v)')")
        case "start":
            let minutes = (body["minutes"] as? NSNumber)?.intValue ?? 5
            session.start(minutes: minutes)
        case "stop":
            session.stop()
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
