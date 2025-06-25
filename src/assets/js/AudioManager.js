/**
 * 오디오 관리 클래스 - TTS 기능 담당
 */
export class AudioManager {
  constructor() {
    this.speechSynthesis = window.speechSynthesis
    this.currentUtterance = null
    this.isPlaying = false
  }

  toggleSpeech(text, speakerElement) {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel()
      this.updateSpeakerUI(speakerElement, false)
      return
    }

    const fullText = `.${text}`
    this.currentUtterance = new SpeechSynthesisUtterance(fullText)

    // 음성 설정
    this.configureSpeech()

    // 이벤트 핸들러
    this.currentUtterance.onstart = () => {
      this.isPlaying = true
      this.updateSpeakerUI(speakerElement, true)
    }

    this.currentUtterance.onend = () => {
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
    }

    this.currentUtterance.onerror = () => {
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
    }

    this.speechSynthesis.speak(this.currentUtterance)
  }

  configureSpeech() {
    this.currentUtterance.pitch = 1
    this.currentUtterance.rate = 0.9
    this.currentUtterance.volume = 2.0

    // 한국어 남성 음성 선택
    const voices = this.speechSynthesis.getVoices()
    const maleVoice =
      voices.find((voice) => voice.lang === 'ko-KR' && voice.name.includes('Male')) ||
      voices.find((voice) => voice.lang === 'ko-KR' && voice.name.includes('남')) ||
      voices.find(
        (voice) =>
          voice.lang === 'ko-KR' && !voice.name.includes('Female') && !voice.name.includes('여'),
      ) ||
      voices.find((voice) => voice.lang.includes('ko') && voice.name.includes('Male')) ||
      voices.find((voice) => voice.lang.includes('ko') && !voice.name.includes('Female')) ||
      voices.find((voice) => voice.lang.includes('ko')) ||
      voices[0]

    if (maleVoice) {
      this.currentUtterance.voice = maleVoice
    }
    this.currentUtterance.lang = 'ko-KR'
  }

  updateSpeakerUI(speakerElement, isPlaying) {
    if (isPlaying) {
      speakerElement.classList.add('playing')
      speakerElement.textContent = '🔇'
    } else {
      speakerElement.classList.remove('playing')
      speakerElement.textContent = '🔊'
    }
  }

  stop() {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel()
    }
  }
}
