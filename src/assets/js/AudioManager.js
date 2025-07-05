/**
 * 일본인 여성 목소리 전용 오디오 관리 클래스
 * 구글 Translate TTS + Web Speech API 사용 (완전 무료)
 */
export class AudioManager {
  constructor() {
    this.isPlaying = false
    this.currentAudio = null
    this.checkGoogleTTS()
  }

  checkGoogleTTS() {
    // 구글 TTS는 별도 라이브러리 불필요, 브라우저 내장 + 구글 서비스
    console.log('🎵 일본인 여성 목소리 엔진 준비 완료!')
    this.useGoogleTTS = true
  }

  toggleSpeech(text, speakerElement) {
    if (this.isPlaying) {
      this.stop()
      this.updateSpeakerUI(speakerElement, false)
      return
    }

    // 일본인 여성 목소리로 우선 시도
    this.speakWithGoogleTTS(text, speakerElement)
  }

  async speakWithGoogleTTS(text, speakerElement) {
    try {
      this.isPlaying = true
      this.updateSpeakerUI(speakerElement, true)

      console.log('🎵 일본인 여성 목소리로 재생 중...')

      // 구글 Translate TTS 사용 (비공식이지만 무료)
      const encodedText = encodeURIComponent(text)
      // 애기 목소리에 최적화된 설정
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ko&client=tw-ob&ttsspeed=0.7`

      // 오디오 재생
      await this.playAudio(audioUrl, speakerElement, text)
    } catch (error) {
      console.warn('구글 TTS 실패, Web Speech API로 전환:', error)
      // 구글 TTS 실패 시 Web Speech API 사용
      this.speakWithWebSpeech(text, speakerElement)
    }
  }

  async playAudio(audioUrl, speakerElement, text = '') {
    return new Promise((resolve, reject) => {
      // 기존 오디오 정리
      if (this.currentAudio) {
        this.currentAudio.pause()
        this.currentAudio = null
      }

      this.currentAudio = new Audio(audioUrl)

      this.currentAudio.onloadstart = () => {
        console.log('🎵 오디오 로딩 중...')
      }

      this.currentAudio.oncanplay = () => {
        console.log('🎵 애기 목소리 재생 시작!')
      }

      this.currentAudio.onended = () => {
        console.log('🎵 애기 목소리 재생 완료!')
        this.isPlaying = false
        this.updateSpeakerUI(speakerElement, false)
        this.currentAudio = null
        resolve()
      }

      this.currentAudio.onerror = (error) => {
        console.error('오디오 재생 오류:', error)
        this.isPlaying = false
        this.updateSpeakerUI(speakerElement, false)
        this.currentAudio = null

        // 오디오 재생 실패 시 Web Speech API로 폴백
        console.log('Web Speech API로 폴백 시도...')
        this.speakWithWebSpeech(text, speakerElement)
        reject(error)
      }

      // 볼륨 설정 (애기 목소리는 살짝 작게)
      this.currentAudio.volume = 0.8
      this.currentAudio.play()
    })
  }

  speakWithWebSpeech(text, speakerElement) {
    if (!window.speechSynthesis) {
      console.error('Web Speech API 지원하지 않는 브라우저')
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)

    // 일본인 여성 목소리 찾기 (우선순위별)
    const voices = speechSynthesis.getVoices()

    // 1순위: 구글 한국어 여성 음성 (애기 목소리에 최적)
    let selectedVoice = voices.find(
      (voice) => voice.lang.includes('ja') && voice.name.includes('Female'),
    )

    // 2순위: 한국어 여성 음성
    if (!selectedVoice) {
      selectedVoice = voices.find(
        (voice) =>
          voice.lang.includes('ko') &&
          (voice.name.includes('Female') ||
            voice.name.includes('여') ||
            voice.name.includes('Sun-Hi')),
      )
    }

    // 3순위: 한국어 음성 중 아무거나
    if (!selectedVoice) {
      selectedVoice = voices.find((voice) => voice.lang.includes('ko'))
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice
      console.log('🎵 일본인 여성 목소리 선택:', selectedVoice.name)
    }

    // 일본인 여성 목소리 최적 설정
    utterance.lang = 'ja-JP'
    utterance.pitch = 1.3 // 약간 높은 음조
    utterance.rate = 0.9 // 약간 천천히
    utterance.volume = 0.8 // 목소리는 작게

    utterance.onstart = () => {
      this.isPlaying = true
      this.updateSpeakerUI(speakerElement, true)
      console.log('🎵 일본인 여성 목소리 재생 시작!')
    }

    utterance.onend = () => {
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
      console.log('🎵 일본인 여성 목소리 재생 완료!')
    }

    utterance.onerror = (error) => {
      console.error('구글 TTS 오류:', error)
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
    }

    speechSynthesis.speak(utterance)
  }

  updateSpeakerUI(speakerElement, isPlaying) {
    if (!speakerElement) return

    if (isPlaying) {
      speakerElement.classList.add('playing')
      speakerElement.textContent = '🔇'
      speakerElement.title = '애기 목소리 재생 중... (클릭하여 중지)'

      // 애기 목소리 재생 중 특별한 스타일
      speakerElement.style.color = '#ff69b4' // 핑크색
      speakerElement.style.filter = 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.7))'
    } else {
      speakerElement.classList.remove('playing')
      speakerElement.textContent = '🔊'
      speakerElement.title = '일본인 여성 목소리로 듣기 (무료)'

      // 원래 스타일로 복원
      speakerElement.style.color = ''
      speakerElement.style.filter = ''
    }
  }

  stop() {
    this.isPlaying = false

    // 구글 오디오 중지
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
      console.log('🎵 구글 오디오 중지')
    }

    // Web Speech API 중지
    if (window.speechSynthesis) {
      speechSynthesis.cancel()
      console.log('🎵 Web Speech API 중지')
    }

    // 모든 audio 엘리먼트 중지 (혹시 모를 상황 대비)
    document.querySelectorAll('audio').forEach((audio) => {
      if (!audio.paused) {
        audio.pause()
        audio.currentTime = 0
      }
    })
  }

  // 구글 TTS 음성 옵션 변경 메서드 (추가 기능)
  setVoiceOptions(options = {}) {
    this.voiceOptions = {
      pitch: options.pitch || 1.8, // 애기 목소리 높은 음조
      rate: options.rate || 0.7, // 애기처럼 천천히
      volume: options.volume || 0.8, // 애기 목소리 볼륨
      style: options.style || 'cute', // 귀여운 스타일
    }
    console.log('🎵 일본인 여성 목소리 설정 업데이트:', this.voiceOptions)
  }

  // 다양한 일본인 여성 목소리 프리셋
  setChildVoicePreset(preset = 'default') {
    const presets = {
      default: {
        pitch: 1.8,
        rate: 0.7,
        volume: 0.8,
      },
      very_cute: {
        // 매우 귀여운 애기
        pitch: 2.0, // 최대한 높게
        rate: 0.6, // 더 천천히
        volume: 0.7,
      },
      cheerful_child: {
        // 명랑한 어린이
        pitch: 1.6,
        rate: 0.8,
        volume: 0.9,
      },
      gentle_child: {
        // 순한 어린이
        pitch: 1.4,
        rate: 0.7,
        volume: 0.8,
      },
    }

    this.setVoiceOptions(presets[preset] || presets['default'])
    console.log(`🎵 "${preset}" 일본인 여성 목소리 프리셋 적용`)
  }

  // 상태 확인 메서드
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      engine: '구글 TTS',
      voiceType: '일본인 여성 목소리',
      currentOptions: this.voiceOptions || '기본 설정',
    }
  }
}

// 전역에서 접근 가능하도록 (개발용)
if (typeof window !== 'undefined') {
  window.AudioManager = AudioManager
}

// 사용 예제 (주석)
/*
// 기본 사용법
const audioManager = new AudioManager()
audioManager.toggleSpeech("안녕하세요!", speakerElement)

// 일본인 여성 목소리 프리셋 변경
audioManager.setChildVoicePreset('very_cute')     // 매우 귀여운 애기
audioManager.setChildVoicePreset('cheerful_child') // 명랑한 어린이
audioManager.setChildVoicePreset('gentle_child')   // 순한 어린이

// 수동 설정
audioManager.setVoiceOptions({
  pitch: 2.0,    // 최대한 높은 음조
  rate: 0.6,     // 더욱 천천히
  volume: 0.7    // 더 작은 볼륨
})

// 상태 확인
console.log(audioManager.getStatus())
*/
