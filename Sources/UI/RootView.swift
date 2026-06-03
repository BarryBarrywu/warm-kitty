import SwiftUI

struct RootView: View {
    @ObservedObject var session: SessionController
    @ObservedObject var settings: SettingsStore
    @ObservedObject var locale: LocaleManager
    let updateChecker: UpdateChecker
    let audio: AudioController

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: "FFF7EC"), Color(hex: "FCEBD3")],
                           startPoint: .top, endPoint: .bottom)
            Text("Warm Kitty (native)").foregroundColor(Color(hex: "5E4630"))
        }
        .frame(width: 444, height: 690)
        .environment(\.locale, locale.locale)
    }
}
