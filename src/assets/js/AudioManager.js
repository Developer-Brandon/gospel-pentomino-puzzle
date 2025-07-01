/**
 * 오디오 관리 클래스 - TTS 기능 담당 (크로스브라우저 최적화)
 */
export class AudioManager {
  constructor() {
    this.speechSynthesis = window.speechSynthesis
    this.currentUtterance = null
    this.isPlaying = false
    this.preferredVoice = null
    this.initializeVoices()
  }

  initializeVoices() {
    // 음성 목록이 로드될 때까지 대기
    const loadVoices = () => {
      const voices = this.speechSynthesis.getVoices()
      if (voices.length > 0) {
        this.preferredVoice = this.selectBestFemaleVoice(voices)
      }
    }

    loadVoices()
    if (this.speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynthesis.onvoiceschanged = loadVoices
    }
  }

  selectBestFemaleVoice(voices) {
    // 1순위: 한국어 여성 음성
    const koreanFemaleVoices = voices.filter(
      (voice) =>
        voice.lang.includes('ko') &&
        (voice.name.includes('Female') ||
          voice.name.includes('여') ||
          voice.name.includes('Woman') ||
          voice.name.includes('Girl') ||
          voice.name.includes('Yuna') ||
          voice.name.includes('Seoyeon') ||
          voice.name.includes('Heami')),
    )

    if (koreanFemaleVoices.length > 0) {
      // 더 자연스러운 음성 우선 선택
      const premium = koreanFemaleVoices.find(
        (voice) =>
          voice.name.includes('Premium') ||
          voice.name.includes('Enhanced') ||
          voice.name.includes('Natural'),
      )
      return premium || koreanFemaleVoices[0]
    }

    // 2순위: 한국어 음성 (성별 불명)
    const koreanVoices = voices.filter((voice) => voice.lang.includes('ko'))
    if (koreanVoices.length > 0) {
      return koreanVoices[0]
    }

    // 3순위: 영어 여성 음성
    const englishFemaleVoices = voices.filter(
      (voice) =>
        voice.lang.includes('en') &&
        (voice.name.includes('Female') ||
          voice.name.includes('Woman') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Victoria') ||
          voice.name.includes('Zira')),
    )

    if (englishFemaleVoices.length > 0) {
      return englishFemaleVoices[0]
    }

    // 4순위: 기본 음성
    return voices[0] || null
  }

  toggleSpeech(text, speakerElement) {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel()
      this.updateSpeakerUI(speakerElement, false)
      return
    }

    const fullText = text
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

    this.currentUtterance.onerror = (error) => {
      console.warn('TTS Error:', error)
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
    }

    // 크롬에서 긴 텍스트 처리를 위한 지연
    setTimeout(() => {
      this.speechSynthesis.speak(this.currentUtterance)
    }, 100)
  }

  configureSpeech() {
    // 여성 음성에 맞는 설정
    this.currentUtterance.pitch = 1.1 // 약간 높은 톤
    this.currentUtterance.rate = 0.85 // 약간 느리게 (더 명확하게)
    this.currentUtterance.volume = 1.0

    // 선택된 음성 적용
    if (this.preferredVoice) {
      this.currentUtterance.voice = this.preferredVoice
      this.currentUtterance.lang = this.preferredVoice.lang
    } else {
      // 대체 설정
      this.currentUtterance.lang = 'ko-KR'
    }
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
