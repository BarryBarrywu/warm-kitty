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

@_silgen_name("IOHIDServiceClientCopyProperty")
private func IOHIDServiceClientCopyProperty(_ service: CFTypeRef?, _ key: CFString) -> CFTypeRef?

@_silgen_name("IOHIDEventGetFloatValue")
private func IOHIDEventGetFloatValue(_ event: CFTypeRef?, _ field: Int32) -> Double

// kIOHIDEventTypeTemperature == 15; field = type << 16.
private let kTemperatureEventType: Int64 = 15
private let kTemperatureField: Int32 = 15 << 16

/// Reads a "chassis feel" temperature — what your hand senses touching the Mac.
///
/// On Apple Silicon the no-root IOHID thermal sensors only expose die/perf-core
/// points (`tdie*`/`tp*`), which read far lower than the CPU package temperature
/// a root tool like powermetrics would report (~45°C die vs ~68°C package under
/// load on this M2 Max). Rather than chase the package number (which needs root),
/// Warm Kitty maps the die reading onto the temperature your hand actually feels
/// on the aluminium: a cool ~28°C idle up to a hot ~45°C under sustained load.
/// This keeps the number intuitive ("how warm is the machine to the touch") and
/// needs no privileges.
///
/// We take the hottest die sensor, then linearly map the die range to the body
/// range and clamp. If sensor naming differs on another chip and the die filter
/// matches nothing, we fall back to the hottest of all sensors.
final class ThermalReader {
    private let client: CFTypeRef?
    // Name prefixes for compute-die sensors (lowercased). tdie* = die temps,
    // tp* = CPU(s)/GPU(g) performance-core points.
    private static let diePrefixes = ["tdie", "tp"]

    // Die-temperature span observed on Apple Silicon (idle → sustained full load),
    // mapped onto the chassis temperature a hand feels. Tune per chip if needed;
    // both ends clamp, so an off-range chip saturates rather than misbehaves.
    private static let dieLo = 40.0, dieHi = 48.0
    private static let bodyLo = 28.0, bodyHi = 45.0

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

        var dieMax: Double?   // hottest compute-die sensor
        var anyMax: Double?   // hottest plausible sensor (fallback)

        for service in services {
            guard let event = IOHIDServiceClientCopyEvent(service, kTemperatureEventType, 0, 0)
            else { continue }
            let value = IOHIDEventGetFloatValue(event, kTemperatureField)
            // Discard implausible readings (disconnected sensors report 0 or garbage).
            guard value > 5 && value < 130 else { continue }
            anyMax = max(anyMax ?? value, value)

            // Sensor names look like "PMU tdie0", "PMU TP2s" — match the token
            // after the "PMU " prefix, not the whole string.
            let name = (IOHIDServiceClientCopyProperty(service, "Product" as CFString) as? String)?.lowercased() ?? ""
            let token = name.split(separator: " ").last.map(String.init) ?? name
            if Self.diePrefixes.contains(where: { token.hasPrefix($0) }) {
                dieMax = max(dieMax ?? value, value)
            }
        }
        guard let die = dieMax ?? anyMax else { return nil }
        return Self.dieToBody(die)
    }

    /// Linear map of die temperature onto the felt chassis temperature, clamped.
    private static func dieToBody(_ die: Double) -> Double {
        let t = (die - dieLo) / (dieHi - dieLo)
        let clamped = max(0, min(1, t))
        return bodyLo + clamped * (bodyHi - bodyLo)
    }
}
