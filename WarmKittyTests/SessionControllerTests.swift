import XCTest
@testable import Warm_Kitty

final class SessionControllerTests: XCTestCase {
    func test_start_setsWarmingAndPublishesTotal() {
        let sc = SessionController()
        sc.start(minutes: 3)
        XCTAssertEqual(sc.phase, .warming)
        XCTAssertEqual(sc.total, 180)
        XCTAssertEqual(sc.remaining, 180)
        sc.stop()
        XCTAssertEqual(sc.phase, .standby)
    }

    func test_minutesClampedToOneFifteen() {
        let sc = SessionController()
        sc.start(minutes: 99)
        XCTAssertEqual(sc.total, 15 * 60)
        sc.stop()
    }
}
