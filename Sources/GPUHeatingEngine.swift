import Foundation
import Metal

/// Drives the GPU toward full load with a deliberately heavy compute kernel,
/// adding a second heat source alongside the CPU engine so the machine warms
/// faster. A background thread keeps submitting command buffers back-to-back to
/// hold the GPU busy. No-op on machines without a Metal device.
final class GPUHeatingEngine {
    private let lock = NSLock()
    private var running = false
    private var thread: Thread?

    private let device: MTLDevice?
    private let queue: MTLCommandQueue?
    private let pipeline: MTLComputePipelineState?

    init() {
        let dev = MTLCreateSystemDefaultDevice()
        device = dev
        queue = dev?.makeCommandQueue()

        guard let dev else { pipeline = nil; return }
        // A tight FMA loop with a data dependency the optimizer can't drop.
        let src = """
        #include <metal_stdlib>
        using namespace metal;
        kernel void burn(device float *out [[buffer(0)]],
                         constant uint &iters [[buffer(1)]],
                         uint gid [[thread_position_in_grid]]) {
            float x = float(gid) * 0.0000001 + 1.0;
            for (uint i = 0; i < iters; i++) {
                x = fma(x, 1.0000001, 0.0000001);
                x = fma(x, 0.9999999, 0.0000001);
            }
            out[gid] = x;
        }
        """
        pipeline = (try? dev.makeLibrary(source: src, options: nil))
            .flatMap { lib in lib.makeFunction(name: "burn") }
            .flatMap { fn in try? dev.makeComputePipelineState(function: fn) }
    }

    var isAvailable: Bool { pipeline != nil }

    func start() {
        lock.lock()
        guard !running, let pipeline, queue != nil, device != nil else { lock.unlock(); return }
        running = true
        let th = Thread { [weak self] in self?.burn(pipeline: pipeline) }
        th.qualityOfService = .userInitiated
        thread = th
        lock.unlock()
        th.start()
    }

    func stop() {
        lock.lock()
        running = false
        thread = nil
        lock.unlock()
    }

    private func isLive() -> Bool {
        lock.lock(); defer { lock.unlock() }
        return running
    }

    private func burn(pipeline: MTLComputePipelineState) {
        guard let device, let queue else { return }
        let width = 1 << 20                       // 1M threads
        let out = device.makeBuffer(length: width * MemoryLayout<Float>.stride, options: .storageModePrivate)
        var iters: UInt32 = 200_000               // heavy per-thread loop
        let iterBuf = device.makeBuffer(bytes: &iters, length: MemoryLayout<UInt32>.stride, options: [])

        let tg = MTLSize(width: pipeline.maxTotalThreadsPerThreadgroup, height: 1, depth: 1)
        let grid = MTLSize(width: width, height: 1, depth: 1)

        while isLive() {
            guard let cb = queue.makeCommandBuffer(),
                  let enc = cb.makeComputeCommandEncoder() else { break }
            enc.setComputePipelineState(pipeline)
            enc.setBuffer(out, offset: 0, index: 0)
            enc.setBuffer(iterBuf, offset: 0, index: 1)
            enc.dispatchThreads(grid, threadsPerThreadgroup: tg)
            enc.endEncoding()
            cb.commit()
            cb.waitUntilCompleted()               // keep the queue saturated, not flooded
        }
    }
}
