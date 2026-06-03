import Foundation
import Combine

enum WarmPhase: Equatable { case standby, warming, ending }

/// Orchestrates a warming session: a user-chosen countdown (1–15 min) drives the
/// CPU + GPU heating engines at full tilt; the timer is the auto-stop. No thermal
/// sensing — the user's hands judge warmth, the clock decides when to stop.
final class SessionController: ObservableObject {
    @Published private(set) var phase: WarmPhase = .standby
    @Published private(set) var remaining = 0
    @Published private(set) var total = 0

    private let engine = HeatingEngine()
    private let gpuEngine = GPUHeatingEngine()
    private var timer: Timer?

    func start(minutes: Int) {
        guard phase != .warming else { return }
        total = max(1, min(15, minutes)) * 60
        remaining = total
        phase = .warming
        engine.start()
        gpuEngine.start()
        let t = Timer(timeInterval: 1.0, repeats: true) { [weak self] _ in self?.tick() }
        RunLoop.main.add(t, forMode: .common)
        timer = t
    }

    /// Manual stop — no ending animation.
    func stop() {
        guard phase == .warming else { return }
        teardown()
        phase = .standby
    }

    /// User dismissed the ending screen.
    func reset() { phase = .standby }

    /// App teardown — stop heating without changing published phase.
    func shutdown() { teardown() }

    private func teardown() {
        timer?.invalidate(); timer = nil
        engine.stop(); gpuEngine.stop()
    }

    private func tick() {
        guard phase == .warming else { return }
        remaining -= 1
        if remaining <= 0 {
            remaining = 0
            teardown()
            phase = .ending
        }
    }
}
