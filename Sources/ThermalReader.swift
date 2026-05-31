import Foundation
import IOKit

// Private IOKit HID symbols. They live in the IOKit framework but are not in the
// public SDK, so we bind them by name. This is why Warm Kitty ships outside the
// App Store (Developer ID + notarization) rather than through the sandbox.
@_silgen_name("IOHIDEventSystemClientCreate")
private func IOHIDEventSystemClientCreate(_ allocator: CFAllocator?) -> CFTypeRef?

@_silgen_name("IOHIDEventSystemClientSetMatching")
private func IOHIDEventSystemClientSetMatching(_ client: CFTypeRef?, _ matching: CFDictionary?) -> Int32

@_silgen_name("IOHIDEventSystemClientCopyServices")
private func IOHIDEventSystemClientCopyServices(_ client: CFTypeRef?) -> CFArray?

@_silgen_name("IOHIDServiceClientCopyEvent")
private func IOHIDServiceClientCopyEvent(_ service: CFTypeRef?, _ type: Int64, _ options: Int64, _ timestamp: Int64) -> CFTypeRef?

@_silgen_name("IOHIDEventGetFloatValue")
private func IOHIDEventGetFloatValue(_ event: CFTypeRef?, _ field: Int32) -> Double

// kIOHIDEventTypeTemperature == 15; field = type << 16.
private let kTemperatureEventType: Int64 = 15
private let kTemperatureField: Int32 = 15 << 16

/// Reads real CPU/SoC temperature via the IOHIDEventSystem thermal sensors.
/// Returns the average of all plausible sensor readings, or nil if none are
/// available (older/unsupported machines) — callers degrade gracefully.
final class ThermalReader {
    private let client: CFTypeRef?

    init() {
        let c = IOHIDEventSystemClientCreate(kCFAllocatorDefault)
        // Match temperature sensors: PrimaryUsagePage 0xff00, PrimaryUsage 5.
        let matching: [String: Int] = ["PrimaryUsagePage": 0xff00, "PrimaryUsage": 5]
        _ = IOHIDEventSystemClientSetMatching(c, matching as CFDictionary)
        client = c
    }

    func read() -> Double? {
        guard let client,
              let services = IOHIDEventSystemClientCopyServices(client) as? [CFTypeRef]
        else { return nil }

        var sum = 0.0
        var n = 0
        for service in services {
            guard let event = IOHIDServiceClientCopyEvent(service, kTemperatureEventType, 0, 0)
            else { continue }
            let value = IOHIDEventGetFloatValue(event, kTemperatureField)
            // Discard implausible readings (disconnected sensors report 0 or garbage).
            if value > 5 && value < 130 {
                sum += value
                n += 1
            }
        }
        guard n > 0 else { return nil }
        return sum / Double(n)
    }
}
