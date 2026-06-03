import Foundation
import SwiftUI
import Combine

/// Resolves the active UI language. "auto" follows the system locale; an explicit
/// choice (zh-Hans / zh-Hant / ja / en) overrides it live via the environment locale.
final class LocaleManager: ObservableObject {
    @Published private(set) var selection: String   // "auto" | "zh-Hans" | "zh-Hant" | "ja" | "en"
    private let systemId: String

    init(stored: String, systemId: String = Locale.autoupdatingCurrent.identifier) {
        self.selection = stored
        self.systemId = systemId
    }

    /// The concrete language code in effect (never "auto").
    var effectiveCode: String {
        selection == "auto" ? LocaleManager.resolve(systemId: systemId) : selection
    }

    /// The SwiftUI environment locale to inject at the root.
    var locale: Locale { Locale(identifier: effectiveCode) }

    func set(_ code: String) { selection = code }

    static func resolve(systemId: String) -> String {
        let l = systemId.lowercased()
        if l.hasPrefix("zh") {
            let hant = ["hant", "tw", "hk", "mo"].contains { l.contains($0) }
            return hant ? "zh-Hant" : "zh-Hans"
        }
        if l.hasPrefix("ja") { return "ja" }
        return "en"
    }
}
