import SwiftUI

struct ReadoutView: View {
    let phase: WarmPhase
    let minutes: Int
    let remaining: Int
    let code: String

    private func fmt(_ s: Int) -> String {
        let s = max(0, s); return "\(s / 60):" + String(format: "%02d", s % 60)
    }

    var body: some View {
        if phase == .ending {
            Text(L("endingTitle", code))
                .font(.custom("ZCOOL KuaiLe", size: 38))
                .foregroundColor(Color(hex: "E08A4B"))
                .frame(height: 72)
        } else {
            let warm = phase == .warming
            VStack(spacing: 5) {
                Text(fmt(warm ? remaining : minutes * 60))
                    .font(.custom("Baloo 2", size: 52)).fontWeight(.bold)
                    .monospacedDigit()
                    .foregroundColor(Color(hex: warm ? "5E4630" : "C9A982"))
                Text(warm ? L("remaining", code) : "")
                    .font(.custom("ZCOOL KuaiLe", size: 12.5))
                    .foregroundColor(Color(hex: "A07E58"))
                    .frame(height: 16)
            }
            .frame(height: 72)
        }
    }
}
