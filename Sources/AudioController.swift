import AVFoundation

/// Plays the two baked sounds. Chime is one-shot on completion; ambient loops
/// during warming with a slow breathing volume LFO. Mirrors the old Web Audio gains.
final class AudioController {
    private var chime: AVAudioPlayer?
    private var amb: AVAudioPlayer?
    private var lfo: Timer?
    private var phase: Double = 0

    init() {
        if let u = Bundle.main.url(forResource: "chime", withExtension: "caf") {
            chime = try? AVAudioPlayer(contentsOf: u)
            chime?.prepareToPlay()
        }
        if let u = Bundle.main.url(forResource: "ambient", withExtension: "caf") {
            amb = try? AVAudioPlayer(contentsOf: u)
            amb?.numberOfLoops = -1
            amb?.prepareToPlay()
        }
    }

    func playChime() { chime?.currentTime = 0; chime?.play() }

    func startAmbient() {
        guard let amb, !amb.isPlaying else { return }
        amb.volume = 0
        amb.play()
        amb.setVolume(0.06, fadeDuration: 1.2)   // fade in, matches old ramp
        phase = 0
        lfo = Timer.scheduledTimer(withTimeInterval: 1.0 / 30.0, repeats: true) { [weak self] _ in
            guard let self, let amb = self.amb else { return }
            self.phase += (2 * .pi * 0.15) / 30.0          // 0.15 Hz
            amb.volume = Float(0.06 + 0.018 * sin(self.phase))
        }
    }

    func stopAmbient() {
        lfo?.invalidate(); lfo = nil
        amb?.setVolume(0, fadeDuration: 0.6)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.65) { [weak self] in self?.amb?.stop() }
    }
}
