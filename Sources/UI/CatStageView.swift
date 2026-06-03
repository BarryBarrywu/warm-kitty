import SwiftUI

private let warmPoses = (1...14).map { String(format: "warm-%02d", $0) }
private let idlePose = "idle", endingPose = "ending"

struct CatStageView: View {
    let phase: WarmPhase
    let holdSeconds: Double      // 8
    var onPoseChange: (Int) -> Void

    @State private var active = "idle"
    @State private var playlist: [String] = []
    @State private var cursor = 0
    @State private var sway = false
    @State private var timer: Timer?

    var body: some View {
        ZStack {
            ForEach([idlePose] + warmPoses + [endingPose], id: \.self) { p in
                Image(p)
                    .resizable().scaledToFit()
                    .opacity(p == active ? 1 : 0)
                    .animation(.easeInOut(duration: 1.1), value: active)
                    .shadow(color: Color(hex: "784E28", alpha: 0.18), radius: 8, y: 5)
            }
        }
        .rotationEffect(.degrees(sway ? 0.6 : -0.6), anchor: UnitPoint(x: 0.5, y: 0.78))
        .scaleEffect(sway ? 1.018 : 1.0, anchor: UnitPoint(x: 0.5, y: 0.78))
        .onChange(of: phase) { _ in applyPhase() }
        .onAppear { applyPhase() }
    }

    private func applyPhase() {
        timer?.invalidate(); timer = nil
        switch phase {
        case .standby:
            withAnimation(nil) { sway = false }
            active = idlePose
        case .ending:
            sway = false
            active = endingPose
        case .warming:
            withAnimation(.easeInOut(duration: 2.1).repeatForever(autoreverses: true)) { sway = true }
            playlist = warmPoses.shuffled(); cursor = 0
            active = playlist[0]; onPoseChange(0)
            let t = Timer(timeInterval: holdSeconds, repeats: true) { _ in advance() }
            RunLoop.main.add(t, forMode: .common); timer = t
        }
    }

    private func advance() {
        cursor += 1
        if cursor >= playlist.count { playlist = warmPoses.shuffled(); cursor = 0 }
        active = playlist[cursor]; onPoseChange(cursor)
    }
}
