import SwiftUI

struct SettingsView: View {
    @Binding var isOpen: Bool
    @ObservedObject var settings: SettingsStore
    @ObservedObject var locale: LocaleManager
    let updateChecker: UpdateChecker
    let version: String

    @State private var launchAtLogin = false
    @State private var autoUpdate = true
    private var code: String { locale.effectiveCode }

    private let langs: [(String, String)] = [
        ("auto", "Auto"), ("zh-Hans", "简体中文"), ("en", "English"),
        ("ja", "日本語"), ("zh-Hant", "繁體中文")
    ]

    var body: some View {
        ZStack(alignment: .trailing) {
            Color(hex: "462E16", alpha: 0.18).ignoresSafeArea()
                .onTapGesture { isOpen = false }
            VStack(spacing: 0) {
                header
                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        sectionHeader(L("language", code))
                        SettingsCard {
                            let current = langs.first { $0.0 == locale.selection }
                            let currentName = current?.0 == "auto" ? L("autoLang", code) : (current?.1 ?? "")
                            Menu {
                                ForEach(langs, id: \.0) { c, name in
                                    Button(c == "auto" ? L("autoLang", code) : name) {
                                        locale.set(c); settings.language = c
                                    }
                                }
                            } label: {
                                HStack {
                                    Text(currentName)
                                        .font(.custom("PingFang SC", size: 14)).fontWeight(.semibold)
                                        .foregroundColor(Color(hex: "5E4630"))
                                    Spacer()
                                    Image(systemName: "chevron.up.chevron.down")
                                        .font(.system(size: 12, weight: .semibold))
                                        .foregroundColor(Color(hex: "B08A60"))
                                }
                                .padding(.horizontal, 15).padding(.vertical, 13)
                                .contentShape(Rectangle())
                            }
                            .buttonStyle(.plain)
                        }

                        sectionHeader(L("sound", code))
                        SettingsCard {
                            ToggleRow(label: L("chimeOption", code), on: Binding(
                                get: { settings.chime }, set: { settings.chime = $0 }))
                            ToggleRow(label: L("ambientOption", code), on: Binding(
                                get: { settings.ambient }, set: { settings.ambient = $0 }), last: true)
                        }

                        sectionHeader(L("general", code))
                        SettingsCard {
                            ToggleRow(label: L("launchAtLogin", code), on: Binding(
                                get: { launchAtLogin },
                                set: { launchAtLogin = $0; updateChecker.setLaunchAtLogin($0); launchAtLogin = updateChecker.launchAtLogin }))
                            ToggleRow(label: L("autoUpdate", code), on: Binding(
                                get: { autoUpdate },
                                set: { autoUpdate = $0; updateChecker.setAutoCheck($0) }))
                            ActionRow(label: "\(L("version", code)) \(version)", buttonLabel: L("checkNow", code)) {
                                updateChecker.checkForUpdates()
                            }
                        }

                        sectionHeader(L("about", code))
                        aboutBlock
                    }
                    .padding(.horizontal, 18).padding(.top, 20).padding(.bottom, 24)
                }
            }
            .frame(maxWidth: 380).frame(maxHeight: .infinity)
            .background(LinearGradient(colors: [Color(hex: "FFF9F0"), Color(hex: "FBEFDD")], startPoint: .top, endPoint: .bottom))
        }
        .onAppear {
            launchAtLogin = updateChecker.launchAtLogin
            autoUpdate = updateChecker.autoCheckEnabled
        }
    }

    private var header: some View {
        HStack {
            Text(L("settings", code)).font(.custom("ZCOOL KuaiLe", size: 16)).foregroundColor(Color(hex: "5E4630"))
            Spacer()
            Button { isOpen = false } label: {
                Text(L("done", code)).font(.custom("Baloo 2", size: 14)).fontWeight(.semibold).foregroundColor(Color(hex: "E08A4B"))
            }.buttonStyle(.plain)
        }
        .padding(.leading, 18).padding(.trailing, 14).frame(height: 46)
        .overlay(Rectangle().fill(Color(hex: "784E28", alpha: 0.12)).frame(height: 0.5), alignment: .bottom)
    }

    private var aboutBlock: some View {
        VStack(spacing: 12) {
            Image("AppIconImage").resizable().scaledToFit().frame(width: 88, height: 88)
                .shadow(color: Color(hex: "E08A4B", alpha: 0.6), radius: 10, y: 8)
            Text("Warm Kitty").font(.custom("ZCOOL KuaiLe", size: 22)).foregroundColor(Color(hex: "5E4630"))
            Text(L("slogan", code))
                .font(.custom("Baloo 2", size: 15)).modifier(ConditionalItalic(on: code == "en"))
                .foregroundColor(Color(hex: "C2703C")).multilineTextAlignment(.center).frame(maxWidth: 240)
            VStack(spacing: 0) {
                LinkRow(label: L("website", code), url: "https://warmkitty.barrybarrywu.com", systemIcon: "globe")
                LinkRow(label: L("github", code), url: "https://github.com/barrybarrywu/warm-kitty", systemIcon: "chevron.left.forwardslash.chevron.right")
                LinkRow(label: L("donate", code), url: "https://sponsor.barrybarrywu.com/", systemIcon: "heart.fill", last: true)
            }
            .background(Color.white)
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "784E28", alpha: 0.1), lineWidth: 0.5)).cornerRadius(14)
            .padding(.top, 8)
        }
        .frame(maxWidth: .infinity).padding(.top, 4)
    }
}
