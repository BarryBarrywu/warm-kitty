import Foundation

/// Spawns one busy worker thread per core to drive the CPU toward full load,
/// which raises the die temperature. Intensity is a duty cycle (fraction of
/// each ~10 ms slice spent burning); v1 always runs at full intensity.
final class HeatingEngine {
    private let lock = NSLock()
    private var running = false
    private var threads: [Thread] = []
    private var intensity: Double = 1.0   // 0...1 duty cycle

    var isRunning: Bool {
        lock.lock(); defer { lock.unlock() }
        return running
    }

    func start(intensity: Double = 1.0) {
        lock.lock()
        guard !running else { lock.unlock(); return }
        running = true
        self.intensity = max(0.05, min(1.0, intensity))
        let count = ProcessInfo.processInfo.activeProcessorCount
        threads = (0..<count).map { _ in
            let th = Thread { [weak self] in self?.burn() }
            th.stackSize = 1 << 20
            th.qualityOfService = .userInitiated
            return th
        }
        lock.unlock()
        threads.forEach { $0.start() }
    }

    func stop() {
        lock.lock()
        running = false
        threads = []
        lock.unlock()
    }

    private func isLive() -> Bool {
        lock.lock(); defer { lock.unlock() }
        return running
    }

    private func currentIntensity() -> Double {
        lock.lock(); defer { lock.unlock() }
        return intensity
    }

    private func burn() {
        var x = 1.0000001
        let slice = 0.010 // 10 ms
        while isLive() {
            let duty = currentIntensity()
            let workEnd = Date().addingTimeInterval(slice * duty)
            // Tight FP loop — keeps the core busy.
            while Date() < workEnd {
                for _ in 0..<20_000 { x = x * 1.0000001 + 0.0000001; if x > 1e6 { x = 1.0000001 } }
            }
            if duty < 1.0 {
                Thread.sleep(forTimeInterval: slice * (1.0 - duty))
            }
        }
    }
}
