import XCTest
@testable import Warm_Kitty

final class SettingsStoreTests: XCTestCase {
    func test_defaults() {
        let d = UserDefaults(suiteName: "test-\(UUID())")!
        let s = SettingsStore(defaults: d)
        XCTAssertEqual(s.minutes, 5)
        XCTAssertEqual(s.language, "auto")
        XCTAssertTrue(s.chime)        // default on
        XCTAssertFalse(s.ambient)     // default off
        XCTAssertFalse(s.seenFirstRun)
    }

    func test_persistsMinutesClamped() {
        let d = UserDefaults(suiteName: "test-\(UUID())")!
        let s = SettingsStore(defaults: d)
        s.minutes = 99
        XCTAssertEqual(SettingsStore(defaults: d).minutes, 15)
        s.minutes = 0
        XCTAssertEqual(SettingsStore(defaults: d).minutes, 1)
    }
}
