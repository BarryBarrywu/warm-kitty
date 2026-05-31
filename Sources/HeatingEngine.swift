import Foundation
import Accelerate

/// Spawns one busy worker thread per core to drive the CPU toward full load,
/// which raises the die temperature. Each thread runs dense single-precision
/// matrix multiplications (`cblas_sgemm`), which feed the Apple Silicon AMX /
/// Intel AVX vector units — drawing far more power (and heat) than a scalar loop
/// at the same CPU utilization. This is the same approach Linpack-style stress
/// tests use to maximize CPU temperature.
/// Intensity is a duty cycle (fraction of each work slice spent burning); v1
/// always runs at full intensity.
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
        // 512×512 floats: big enough to saturate the vector units, small enough
        // that the working set stays hot in cache (so we burn FLOPs, not memory
        // bandwidth). Each thread owns its buffers — no sharing, no locks.
        let n = 512
        let count = n * n
        let a = UnsafeMutablePointer<Float>.allocate(capacity: count)
        let b = UnsafeMutablePointer<Float>.allocate(capacity: count)
        let c = UnsafeMutablePointer<Float>.allocate(capacity: count)
        defer { a.deallocate(); b.deallocate(); c.deallocate() }
        for i in 0..<count {
            a[i] = Float(i % 7) * 0.5 + 1.0
            b[i] = Float(i % 13) * 0.25 + 1.0
            c[i] = 0
        }

        let slice = 0.020 // 20 ms work window
        while isLive() {
            let duty = currentIntensity()
            let workEnd = Date().addingTimeInterval(slice * duty)
            while Date() < workEnd {
                // C = A·B — dense GEMM hammers the AMX/AVX units.
                cblas_sgemm(CblasRowMajor, CblasNoTrans, CblasNoTrans,
                            Int32(n), Int32(n), Int32(n),
                            1.0, a, Int32(n), b, Int32(n),
                            0.0, c, Int32(n))
            }
            if duty < 1.0 {
                Thread.sleep(forTimeInterval: slice * (1.0 - duty))
            }
        }
    }
}
