import Foundation

/// Orchestrates a warming session: a user-chosen countdown (1–15 min) drives the
/// CPU + GPU heating engines at full tilt; the timer is the auto-stop. No thermal
/// sensing — the user's hands judge warmth, the clock decides when to stop.
final class SessionController {
    private let engine = HeatingEngine()
    private let gpuEngine = GPUHeatingEngine()

    private var timer: Timer?
    private var running = false
    private var total = 0       // seconds in this session
    private var remaining = 0

    /// Each second: (remainingSeconds, totalSeconds).
    var onTick: ((Int, Int) -> Void)?
    /// Running state changed (drives the button + phase).
    var onRunningChanged: ((Bool) -> Void)?
    /// Countdown reached zero naturally (drives the ending animation).
    var onDone: (() -> Void)?

    func start(minutes: Int) {
        guard !running else { return }
        total = max(1, min(15, minutes)) * 60
        remaining = total
        running = true
        engine.start()
        gpuEngine.start()
        onRunningChanged?(true)
        onTick?(remaining, total)
        let t = Timer(timeInterval: 1.0, repeats: true) { [weak self] _ in self?.tick() }
        RunLoop.main.add(t, forMode: .common)
        timer = t
    }

    /// Manual stop — no ending animation.
    func stop() {
        guard running else { return }
        teardown()
        onRunningChanged?(false)
    }

    /// App teardown — stop heating without firing UI callbacks.
    func shutdown() {
        teardown()
    }

    private func teardown() {
        running = false
        timer?.invalidate()
        timer = nil
        engine.stop()
        gpuEngine.stop()
    }

    private func tick() {
        guard running else { return }
        remaining -= 1
        if remaining <= 0 {
            onTick?(0, total)
            teardown()
            onRunningChanged?(false)
            onDone?()
        } else {
            onTick?(remaining, total)
        }
    }
}
