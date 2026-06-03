import Foundation

/// Looks up a String Catalog key in a specific language's compiled `.lproj` bundle,
/// so the UI can switch language live without relaunching. `code` is one of
/// "en" / "ja" / "zh-Hans" / "zh-Hant".
func L(_ key: String, _ code: String) -> String {
    if let path = Bundle.main.path(forResource: code, ofType: "lproj"),
       let b = Bundle(path: path) {
        let s = b.localizedString(forKey: key, value: "\u{1}", table: nil)
        if s != "\u{1}" { return s }
    }
    return Bundle.main.localizedString(forKey: key, value: key, table: nil)
}
