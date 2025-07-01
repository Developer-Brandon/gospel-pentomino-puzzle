/* global responsiveVoice */
/**
 * 오디오 관리 클래스 - ResponsiveVoice 사용
 */
export class AudioManager {
  constructor() {
    this.isPlaying = false
    this.checkResponsiveVoice()
  }

  checkResponsiveVoice() {
    // ResponsiveVoice 로드 확인
    if (typeof responsiveVoice === 'undefined') {
      console.warn('ResponsiveVoice not loaded, falling back to Web Speech API')
      this.useWebSpeech = true
    } else {
      this.useWebSpeech = false
    }
  }

  toggleSpeech(text, speakerElement) {
    if (this.isPlaying) {
      this.stop()
      this.updateSpeakerUI(speakerElement, false)
      return
    }

    if (!this.useWebSpeech && typeof responsiveVoice !== 'undefined') {
      // ResponsiveVoice 사용 (우선순위)
      this.speakWithResponsiveVoice(text, speakerElement)
    } else {
      // 기본 Web Speech API 사용 (백업)
      this.speakWithWebSpeech(text, speakerElement)
    }
  }

  speakWithResponsiveVoice(text, speakerElement) {
    this.isPlaying = true
    this.updateSpeakerUI(speakerElement, true)

    // ResponsiveVoice 여성 한국어 음성 사용
    responsiveVoice.speak(text, 'Korean Female', {
      pitch: 1.1,
      rate: 0.9,
      volume: 1,
      onstart: () => {
        this.isPlaying = true
        this.updateSpeakerUI(speakerElement, true)
      },
      onend: () => {
        this.isPlaying = false
        this.updateSpeakerUI(speakerElement, false)
      },
      onerror: () => {
        console.warn('ResponsiveVoice error, trying Web Speech API')
        this.speakWithWebSpeech(text, speakerElement)
      },
    })
  }

  speakWithWebSpeech(text, speakerElement) {
    if (!window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)

    // 한국어 여성 음성 찾기
    const voices = speechSynthesis.getVoices()
    const femaleVoice =
      voices.find(
        (voice) =>
          voice.lang.includes('ko') && (voice.name.includes('Female') || voice.name.includes('여')),
      ) || voices.find((voice) => voice.lang.includes('ko'))

    if (femaleVoice) {
      utterance.voice = femaleVoice
    }

    utterance.lang = 'ko-KR'
    utterance.pitch = 1.1
    utterance.rate = 0.9
    utterance.volume = 1

    utterance.onstart = () => {
      this.isPlaying = true
      this.updateSpeakerUI(speakerElement, true)
    }

    utterance.onend = () => {
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
    }

    speechSynthesis.speak(utterance)
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
    this.isPlaying = false

    // ResponsiveVoice 중지
    if (typeof responsiveVoice !== 'undefined') {
      responsiveVoice.cancel()
    }

    // Web Speech API 중지
    if (window.speechSynthesis) {
      speechSynthesis.cancel()
    }
  }
}
