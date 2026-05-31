import Foundation

/// Orchestrates a warming session: runs the heating engine, polls the real
/// temperature once a second, pushes it to the UI, and stops automatically
/// when the target is reached (with a max-duration safety cap).
final class SessionController {
    private let engine = HeatingEngine()
    private let gpuEngine = GPUHeatingEngine()
    private let reader = ThermalReader()

    private var timer: Timer?
    private var running = false
    private var target: Double = 80
    private var startedAt: Date?
    private let maxDuration: TimeInterval = 30 * 60

    /// Called ~1 s with the latest real temperature, or nil if unreadable.
    var onTemperature: ((Double?) -> Void)?
    /// Called when the running state changes (e.g. auto-stop at target).
    var onRunningChanged: ((Bool) -> Void)?
    /// Called the moment the target is reached (drives the "ding").
    var onReachedTarget: (() -> Void)?

    func begin() {
        timer?.invalidate()
        let t = Timer(timeInterval: 1.0, repeats: true) { [weak self] _ in self?.tick() }
        RunLoop.main.add(t, forMode: .common)
        timer = t
        tick()
    }

    func setTarget(_ value: Double) {
        target = value
    }

    func start(target: Double) {
        self.target = target
        guard !running else { return }
        running = true
        startedAt = Date()
        engine.start()
        gpuEngine.start()
        onRunningChanged?(true)
    }

    func stop() {
        guard running else { return }
        running = false
        startedAt = nil
        engine.stop()
        gpuEngine.stop()
        onRunningChanged?(false)
    }

    /// Stop heating without firing UI callbacks (app teardown).
    func shutdown() {
        running = false
        engine.stop()
        gpuEngine.stop()
        timer?.invalidate()
        timer = nil
    }

    private func tick() {
        let temp = reader.read()
        onTemperature?(temp)

        guard running else { return }

        if let temp, temp >= target {
            stop()
            onReachedTarget?()
            return
        }
        if let started = startedAt, Date().timeIntervalSince(started) >= maxDuration {
            stop()
        }
    }
}
