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
                let trackY = heaterH - 6          // track sits near the bottom of the band
                ZStack(alignment: .topLeading) {
                    // full-band transparent hit area (so grabbing the heater works)
                    Color.clear
                        .frame(width: w, height: heaterH)
                        .contentShape(Rectangle())
                    Capsule().fill(Color(hex: "6E4A33", alpha: 0.16))
                        .frame(width: w, height: 10)
                        .position(x: w / 2, y: trackY)
                    Capsule().fill(Color(hex: "E08A4B"))
                        .frame(width: max(x, 0.001), height: 10)
                        .position(x: x / 2, y: trackY)
                    if warming {
                        Circle().fill(
                            RadialGradient(colors: [Color(hex: "E08A4B", alpha: 0.85), .clear],
                                           center: .center, startRadius: 0, endRadius: 25))
                            .frame(width: 50, height: 50)
                            .position(x: x, y: trackY)
                    }
                    Image("heater").resizable().scaledToFit()
                        .frame(width: heaterW, height: heaterH)
                        .shadow(color: Color(hex: "6E4A33", alpha: 0.4), radius: 3, y: 3)
                        .position(x: x, y: heaterH / 2)   // heater fills the band, base resting on the track
                }
                .frame(width: w, height: heaterH, alignment: .topLeading)
                .contentShape(Rectangle())
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
