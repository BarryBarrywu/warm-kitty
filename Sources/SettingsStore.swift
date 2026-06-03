import Foundation
import Combine

/// Persisted user preferences. Replaces the web build's localStorage.
final class SettingsStore: ObservableObject {
    private let d: UserDefaults
    init(defaults: UserDefaults = .standard) {
        self.d = defaults
        if d.object(forKey: K.chime) == nil { d.set(true, forKey: K.chime) }   // default on
    }

    private enum K {
        static let minutes = "wk_minutes"
        static let lang = "wk_lang"
        static let chime = "wk_chime"
        static let ambient = "wk_ambient"
        static let seen = "wk_seen_v2"
    }

    var minutes: Int {
        get { let v = d.object(forKey: K.minutes) as? Int ?? 5; return max(1, min(15, v)) }
        set { d.set(max(1, min(15, newValue)), forKey: K.minutes); objectWillChange.send() }
    }
    var language: String {
        get { d.string(forKey: K.lang) ?? "auto" }
        set { d.set(newValue, forKey: K.lang); objectWillChange.send() }
    }
    var chime: Bool {
        get { d.object(forKey: K.chime) as? Bool ?? true }
        set { d.set(newValue, forKey: K.chime); objectWillChange.send() }
    }
    var ambient: Bool {
        get { d.bool(forKey: K.ambient) }   // default false
        set { d.set(newValue, forKey: K.ambient); objectWillChange.send() }
    }
    var seenFirstRun: Bool {
        get { d.bool(forKey: K.seen) }
        set { d.set(newValue, forKey: K.seen); objectWillChange.send() }
    }
}
