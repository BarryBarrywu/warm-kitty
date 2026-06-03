import SwiftUI

struct WarmSliderView: View {
    let phase: WarmPhase
    @Binding var minutes: Int
    let frac: Double            // remaining/total, 1 in standby
    let code: String

    private let minM = 1, maxM = 15
    private let heaterW: CGFloat = 38, heaterH: CGFloat = 63
    private var warming: Bool { phase == .warming }

    private var pos: Double {   // 0..1 along the track
        let p0 = Double(minutes - minM) / Double(maxM - minM)
        return warming ? p0 * min(max(frac, 0), 1) : p0
    }

    var body: some View {
        VStack(spacing: 9) {
            Text(L("duration", code))
                .font(.custom("PingFang SC", size: 13)).fontWeight(.semibold)
                .foregroundColor(Color(hex: "8A6446"))

            GeometryReader { geo in
                let w = geo.size.width
                let x = CGFloat(pos) * w
                ZStack(alignment: .topLeading) {
                    // full-band transparent hit area (so grabbing the heater works)
                    Color.clear
                        .frame(width: w, height: heaterH)
                        .contentShape(Rectangle())
                    // visuals — unchanged track + fill + glow + heater, pinned to the top 10pt
                    ZStack(alignment: .leading) {
                        Capsule().fill(Color(hex: "6E4A33", alpha: 0.16)).frame(height: 10)
                        Capsule().fill(Color(hex: "E08A4B")).frame(width: x, height: 10)
                        if warming {
                            Circle().fill(
                                RadialGradient(colors: [Color(hex: "E08A4B", alpha: 0.85), .clear],
                                               center: .center, startRadius: 0, endRadius: 25))
                                .frame(width: 50, height: 50).position(x: x, y: 5)
                        }
                        Image("heater").resizable().scaledToFit()
                            .frame(width: heaterW, height: heaterH)
                            .shadow(color: Color(hex: "6E4A33", alpha: 0.4), radius: 3, y: 3)
                            .position(x: x, y: 5 - (heaterH/2 - 12))
                    }
                    .frame(width: w, height: 10, alignment: .topLeading)
                }
                .frame(width: w, height: heaterH, alignment: .topLeading)
                .animation(warming ? .linear(duration: 1) : nil, value: frac)
                .gesture(warming ? nil : DragGesture(minimumDistance: 0).onChanged { v in
                    let f = min(max(v.location.x / w, 0), 1)
                    minutes = Int((Double(minM) + f * Double(maxM - minM)).rounded())
                })
            }
            .frame(height: heaterH)

            HStack {
                Text("\(warming ? 0 : minM) \(L("minuteUnit", code))")
                Spacer()
                Text("\(warming ? minutes : maxM) \(L("minuteUnit", code))")
            }
            .font(.custom("PingFang SC", size: 11))
            .foregroundColor(Color(hex: "B08A60"))
        }
    }
}
