import XCTest
@testable import Warm_Kitty

final class LocaleManagerTests: XCTestCase {
    func test_systemResolution() {
        XCTAssertEqual(LocaleManager.resolve(systemId: "zh-Hant-TW"), "zh-Hant")
        XCTAssertEqual(LocaleManager.resolve(systemId: "zh-HK"), "zh-Hant")
        XCTAssertEqual(LocaleManager.resolve(systemId: "zh-MO"), "zh-Hant")
        XCTAssertEqual(LocaleManager.resolve(systemId: "zh-Hans-CN"), "zh-Hans")
        XCTAssertEqual(LocaleManager.resolve(systemId: "zh-SG"), "zh-Hans")
        XCTAssertEqual(LocaleManager.resolve(systemId: "ja-JP"), "ja")
        XCTAssertEqual(LocaleManager.resolve(systemId: "fr-FR"), "en")
    }

    func test_effectiveLocaleForExplicitChoice() {
        let lm = LocaleManager(stored: "ja", systemId: "en-US")
        XCTAssertEqual(lm.effectiveCode, "ja")
        lm.set("auto")
        XCTAssertEqual(lm.effectiveCode, "en")   // from system en-US
    }
}
