import SwiftUI
import AppKit

struct ToggleRow: View {
    let label: String
    @Binding var on: Bool
    var last = false
    var body: some View {
        HStack {
            Text(label).font(.custom("PingFang SC", size: 14)).fontWeight(.semibold)
                .foregroundColor(Color(hex: "5E4630"))
            Spacer()
            Toggle("", isOn: $on).labelsHidden().toggleStyle(.switch).tint(Color(hex: "E08A4B"))
        }
        .padding(.horizontal, 15).padding(.vertical, 13)
        .overlay(rowDivider(last), alignment: .bottom)
    }
}

struct ActionRow: View {
    let label: String, buttonLabel: String, action: () -> Void
    var last = false
    var body: some View {
        HStack {
            Text(label).font(.custom("PingFang SC", size: 14)).fontWeight(.semibold)
                .foregroundColor(Color(hex: "5E4630"))
            Spacer()
            Button(action: action) {
                Text(buttonLabel).font(.custom("PingFang SC", size: 13)).fontWeight(.semibold)
                    .foregroundColor(Color(hex: "C2703C"))
                    .padding(.horizontal, 12).padding(.vertical, 6)
                    .background(Color.white)
                    .overlay(RoundedRectangle(cornerRadius: 9).stroke(Color(hex: "784E28", alpha: 0.18), lineWidth: 0.5))
                    .cornerRadius(9)
            }.buttonStyle(.plain)
        }
        .padding(.horizontal, 15).padding(.vertical, 13)
        .overlay(rowDivider(last), alignment: .bottom)
    }
}

struct LinkRow: View {
    let label: String, url: String, systemIcon: String
    var last = false
    var body: some View {
        Button { if let u = URL(string: url) { NSWorkspace.shared.open(u) } } label: {
            HStack(spacing: 11) {
                Image(systemName: systemIcon).foregroundColor(Color(hex: "E08A4B"))
                    .frame(width: 30, height: 30).background(Color(hex: "E08A4B", alpha: 0.12)).cornerRadius(9)
                Text(label).font(.custom("PingFang SC", size: 14)).fontWeight(.semibold).foregroundColor(Color(hex: "5E4630"))
                Spacer()
                Image(systemName: "chevron.right").foregroundColor(Color(hex: "C9AE92")).font(.system(size: 11, weight: .bold))
            }
            .padding(.horizontal, 15).padding(.vertical, 13)
            .contentShape(Rectangle())
        }.buttonStyle(.plain).overlay(rowDivider(last), alignment: .bottom)
    }
}

@ViewBuilder func rowDivider(_ last: Bool) -> some View {
    if !last { Rectangle().fill(Color(hex: "784E28", alpha: 0.08)).frame(height: 0.5) }
}

struct SettingsCard<Content: View>: View {
    @ViewBuilder var content: Content
    var body: some View {
        VStack(spacing: 0) { content }
            .background(Color.white)
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "784E28", alpha: 0.1), lineWidth: 0.5))
            .cornerRadius(14).padding(.bottom, 28)
    }
}

func sectionHeader(_ text: String) -> some View {
    Text(text.uppercased()).font(.custom("PingFang SC", size: 12)).fontWeight(.bold)
        .foregroundColor(Color(hex: "B08A60")).tracking(0.7)
        .frame(maxWidth: .infinity, alignment: .leading).padding(.bottom, 10)
}

struct ConditionalItalic: ViewModifier {
    let on: Bool
    func body(content: Content) -> some View { on ? AnyView(content.italic()) : AnyView(content) }
}
