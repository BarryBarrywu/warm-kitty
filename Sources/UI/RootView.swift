import SwiftUI
import AppKit

struct RootView: View {
    @ObservedObject var session: SessionController
    @ObservedObject var settings: SettingsStore
    @ObservedObject var locale: LocaleManager
    let updateChecker: UpdateChecker
    let audio: AudioController

    @State private var settingsOpen = false
    @State private var firstRun = false
    @State private var narrIdx = 0

    private let accent = Color(hex: "E08A4B")
    private var code: String { locale.effectiveCode }
    private var frac: Double { session.total > 0 ? Double(session.remaining) / Double(session.total) : 1 }

    private var narration: String {
        switch session.phase {
        case .warming: return L("narration.warming.\(narrIdx % 4)", code)
        case .ending:  return L("narration.ending", code)
        case .standby: return L("narration.standby", code)
        }
    }

    private var appVersion: String {
        Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.1.0"
    }

    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(hex: "FFF7EC"), Color(hex: "FCEBD3")], startPoint: .top, endPoint: .bottom)
            RadialGradient(colors: [accent.opacity(session.phase == .standby ? 0.12 : 0.24), .clear],
                           center: .init(x: 0.5, y: 0.16), startRadius: 0, endRadius: 190)
                .allowsHitTesting(false)
            VStack(spacing: 0) {
                titleBar
                mainColumn
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }
        .frame(width: 444, height: 690)
        .ignoresSafeArea()
        .environment(\.locale, locale.locale)
        .overlay {
            if settingsOpen {
                SettingsView(isOpen: $settingsOpen, settings: settings, locale: locale,
                             updateChecker: updateChecker, version: appVersion)
                    .transition(.move(edge: .trailing))
            }
        }
        .overlay {
            if firstRun {
                FirstRunView(code: code, accent: accent) {
                    firstRun = false; settings.seenFirstRun = true
                }
            }
        }
        .animation(.spring(response: 0.42, dampingFraction: 0.82), value: settingsOpen)
        .onAppear { firstRun = !settings.seenFirstRun }
        .onChange(of: session.phase) { p in
            if p == .ending && settings.chime { audio.playChime() }
            if p == .warming { narrIdx = 0 }
            if p == .warming && settings.ambient { audio.startAmbient() } else { audio.stopAmbient() }
        }
        .onChange(of: settings.ambient) { on in
            guard session.phase == .warming else { return }
            if on { audio.startAmbient() } else { audio.stopAmbient() }
        }
    }

    private var titleBar: some View {
        ZStack {
            HStack(spacing: 8) {
                trafficLight("ff5f57") { NSApp.keyWindow?.performClose(nil) }
                trafficLight("febc2e") { NSApp.keyWindow?.performMiniaturize(nil) }
                trafficLight("28c840") { NSApp.keyWindow?.zoom(nil) }
                Spacer()
                Button { settingsOpen = true } label: {
                    Image(systemName: "gearshape.fill").foregroundColor(Color(hex: "8A6446"))
                }
                .buttonStyle(.plain).frame(width: 28, height: 28)
                .background(Color.white.opacity(0.5)).cornerRadius(9)
            }
            .padding(.horizontal, 16)
            HStack(spacing: 6) {
                Text("🐾")
                Text("Warm Kitty").font(.custom("ZCOOL KuaiLe", size: 16)).foregroundColor(Color(hex: "5E4630"))
            }.allowsHitTesting(false)
        }
        .frame(height: 46)
        .background(Color.white.opacity(0.42))
        .overlay(Rectangle().fill(Color(hex: "784E28", alpha: 0.12)).frame(height: 0.5), alignment: .bottom)
    }

    private func trafficLight(_ hex: String, _ action: @escaping () -> Void) -> some View {
        Circle().fill(Color(hex: hex)).frame(width: 12, height: 12)
            .overlay(Circle().stroke(Color.black.opacity(0.12), lineWidth: 0.5))
            .onTapGesture(perform: action)
    }

    private var mainColumn: some View {
        VStack(spacing: 0) {
            CatStageView(phase: session.phase,
                         elapsed: max(0, session.total - session.remaining),
                         holdSeconds: 8) { narrIdx = $0 }
                .frame(width: 256, height: 256)
                .padding(.top, 2)
            ReadoutView(phase: session.phase, minutes: settings.minutes,
                        remaining: session.remaining, code: code)
                .padding(.top, 4)
            Text(narration)
                .font(.custom("ZCOOL KuaiLe", size: 16)).foregroundColor(Color(hex: "7A5230"))
                .multilineTextAlignment(.center).frame(minHeight: 40).padding(.top, 4)
            Spacer(minLength: 2)
            controls.padding(.bottom, 12)
        }
        .padding(.horizontal, 30)
    }

    @ViewBuilder private var controls: some View {
        if session.phase == .ending {
            primaryButton(L("restart", code), filled: true) { session.reset() }
        } else {
            WarmSliderView(phase: session.phase,
                           minutes: Binding(get: { settings.minutes }, set: { settings.minutes = $0 }),
                           frac: frac, code: code)
            if session.phase == .standby {
                primaryButton(L("start", code), filled: true) { session.start(minutes: settings.minutes) }
                    .padding(.top, 12)
                Text(L("footnote", code)).font(.custom("PingFang SC", size: 11))
                    .foregroundColor(Color(hex: "B08A60")).multilineTextAlignment(.center)
                    .frame(minHeight: 30).padding(.top, 11)
            } else {
                primaryButton(L("stop", code), filled: false) { session.stop() }
                    .padding(.top, 12)
                Color.clear.frame(height: 30).padding(.top, 11)
            }
        }
    }

    private func primaryButton(_ title: String, filled: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title).font(.custom("ZCOOL KuaiLe", size: 22))
                .frame(maxWidth: .infinity).frame(height: 70)
                .background(filled ? accent : Color.clear)
                .foregroundColor(filled ? .white : Color(hex: "9A6A45"))
                .overlay(RoundedRectangle(cornerRadius: 20)
                    .stroke(filled ? Color.clear : Color(hex: "9A6A45", alpha: 0.4), lineWidth: 2))
                .cornerRadius(20)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
