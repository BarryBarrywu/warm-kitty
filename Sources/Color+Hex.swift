import SwiftUI

extension Color {
    /// #RRGGBB → Color, matching the web hex values; opacity via the `alpha` arg.
    init(hex: String, alpha: Double = 1) {
        let s = hex.hasPrefix("#") ? String(hex.dropFirst()) : hex
        let n = UInt64(s, radix: 16) ?? 0
        self.init(.sRGB,
                  red: Double((n >> 16) & 0xff) / 255,
                  green: Double((n >> 8) & 0xff) / 255,
                  blue: Double(n & 0xff) / 255,
                  opacity: alpha)
    }
}
