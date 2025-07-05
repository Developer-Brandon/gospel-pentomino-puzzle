/**
 * Edge 완전 호환 일본인 여성 목소리 AudioManager
 * Edge의 특별한 제약사항 모두 해결!
 */
export class AudioManager {
  constructor() {
    this.isPlaying = false
    this.currentAudio = null
    this.isEdge = navigator.userAgent.includes('Edge') || navigator.userAgent.includes('Edg/')
    this.initializeForEdge()
  }

  async initializeForEdge() {
    console.log('🌐 브라우저 감지:', this.isEdge ? 'Microsoft Edge' : '기타 브라우저')

    if (this.isEdge) {
      console.log('🔧 Edge 전용 최적화 모드 활성화')

      // Edge에서는 음성 목록 로딩이 느릴 수 있음
      await this.waitForEdgeVoices()
    } else {
      // 다른 브라우저용 일반 초기화
      await this.waitForVoices()
    }

    console.log('🎵 일본인 여성 목소리 준비 완료!')
  }

  async waitForEdgeVoices() {
    // Edge 전용 음성 로딩 로직
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const voices = speechSynthesis.getVoices()

      if (voices.length > 0) {
        console.log(`✅ Edge에서 ${voices.length}개 음성 로드 완료 (${attempts + 1}번째 시도)`)
        return voices
      }

      // Edge에서는 짧은 간격으로 재시도
      await new Promise((resolve) => setTimeout(resolve, 200))
      attempts++

      console.log(`🔄 Edge 음성 로딩 중... (${attempts}/${maxAttempts})`)
    }

    console.warn('⚠️ Edge에서 음성 로딩 시간 초과')
    return []
  }

  async waitForVoices() {
    // 일반 브라우저용 음성 로딩
    if (speechSynthesis.getVoices().length === 0) {
      await new Promise((resolve) => {
        speechSynthesis.onvoiceschanged = resolve
        setTimeout(resolve, 3000)
      })
    }
  }

  toggleSpeech(text, speakerElement) {
    if (this.isPlaying) {
      this.stop()
      this.updateSpeakerUI(speakerElement, false)
      return
    }

    // Edge든 아니든 Web Speech API 사용
    this.speakWithWebSpeech(text, speakerElement)
  }

  speakWithWebSpeech(text, speakerElement) {
    if (!window.speechSynthesis) {
      console.error('음성 합성을 지원하지 않는 브라우저입니다')
      this.showUnsupportedMessage(speakerElement)
      return
    }

    try {
      // Edge에서는 특별한 중지 처리 필요
      this.edgeSafeStop()

      const utterance = new SpeechSynthesisUtterance(text)

      // Edge 전용 음성 선택
      const selectedVoice = this.isEdge ? this.selectEdgeVoice() : this.selectGeneralVoice()

      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log('🎵 선택된 음성:', selectedVoice.name, `(${selectedVoice.lang})`)
      } else {
        console.log('🎵 기본 음성 사용')
      }

      // Edge 전용 음성 설정
      this.setupEdgeVoiceStyle(utterance, selectedVoice)

      // 이벤트 리스너 설정
      this.setupUtteranceEvents(utterance, speakerElement)

      // Edge 전용 안전한 재생
      this.edgeSafeSpeak(utterance)
    } catch (error) {
      console.error('음성 재생 오류:', error)
      this.handleSpeechError(speakerElement)
    }
  }

  selectEdgeVoice() {
    const voices = speechSynthesis.getVoices()
    console.log('🔍 Edge에서 음성 검색 중...', voices.length, '개 음성 사용 가능')

    // Edge에서 한국어/일본어 음성 찾기 (우선순위별)
    const priorities = [
      // 1순위: Microsoft 한국어 여성 음성
      (voice) =>
        voice.name.includes('Microsoft') && voice.lang.includes('ko') && this.isFemaleVoice(voice),
      // 2순위: 한국어 여성 음성
      (voice) => voice.lang.includes('ko') && this.isFemaleVoice(voice),
      // 3순위: Microsoft 일본어 음성
      (voice) => voice.name.includes('Microsoft') && voice.lang.includes('ja'),
      // 4순위: 일본어 음성
      (voice) => voice.lang.includes('ja'),
      // 5순위: 한국어 음성 (성별 무관)
      (voice) => voice.lang.includes('ko'),
      // 6순위: Microsoft 영어 여성 음성
      (voice) =>
        voice.name.includes('Microsoft') && voice.lang.includes('en') && this.isFemaleVoice(voice),
      // 7순위: 아무 음성
      (voice) => true,
    ]

    for (const condition of priorities) {
      const voice = voices.find(condition)
      if (voice) {
        console.log('✅ Edge 음성 선택 완료:', voice.name)
        return voice
      }
    }

    console.log('⚠️ Edge에서 적합한 음성을 찾지 못함')
    return null
  }

  selectGeneralVoice() {
    const voices = speechSynthesis.getVoices()

    const priorities = [
      (voice) => voice.lang.includes('ja') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('ja'),
      (voice) => voice.lang.includes('ko') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('ko'),
      (voice) => voice.lang.includes('en') && this.isFemaleVoice(voice),
      (voice) => true,
    ]

    for (const condition of priorities) {
      const voice = voices.find(condition)
      if (voice) return voice
    }

    return null
  }

  isFemaleVoice(voice) {
    const femaleKeywords = [
      'female',
      'woman',
      'girl',
      '여성',
      '여자',
      '여',
      'zira',
      'hazel',
      'heami',
      'kyoko',
      'haruka',
    ]

    return femaleKeywords.some((keyword) => voice.name.toLowerCase().includes(keyword))
  }

  setupEdgeVoiceStyle(utterance, selectedVoice) {
    // 언어 설정
    if (selectedVoice && selectedVoice.lang.includes('ja')) {
      utterance.lang = 'ja-JP'
      console.log('🎵 일본어 모드 (Edge)')
    } else {
      utterance.lang = 'ko-KR'
      console.log('🎵 한국어 모드 (Edge)')
    }

    // ⚠️ Edge에서는 pitch가 지원되지 않으므로 설정하지 않음!
    if (this.isEdge) {
      console.log('🔧 Edge 감지: pitch 설정 생략 (Edge에서 지원하지 않음)')
      // Edge에서는 pitch 설정하지 않음
      utterance.rate = 0.8 // 속도만 조절
      utterance.volume = 0.9 // 볼륨 조절
    } else {
      // 다른 브라우저에서는 pitch 사용 가능
      utterance.pitch = 1.4
      utterance.rate = 0.9
      utterance.volume = 0.8
    }
  }

  setupUtteranceEvents(utterance, speakerElement) {
    utterance.onstart = () => {
      this.isPlaying = true
      this.updateSpeakerUI(speakerElement, true)
      console.log('🎵 일본인 여성 목소리 재생 시작! (Edge 호환)')
    }

    utterance.onend = () => {
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
      console.log('🎵 일본인 여성 목소리 재생 완료! (Edge 호환)')
    }

    utterance.onerror = (event) => {
      console.error('Edge 음성 재생 오류:', event.error)
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
      this.handleSpeechError(speakerElement)
    }

    // Edge에서 추가 이벤트 처리
    if (this.isEdge) {
      utterance.onpause = () => {
        console.log('🔧 Edge 음성 일시정지')
      }

      utterance.onresume = () => {
        console.log('🔧 Edge 음성 재개')
      }
    }
  }

  edgeSafeStop() {
    try {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        // Edge에서 안전한 중지
        speechSynthesis.cancel()

        if (this.isEdge) {
          // Edge에서는 추가 대기 시간 필요
          return new Promise((resolve) => setTimeout(resolve, 100))
        }
      }
    } catch (error) {
      console.warn('Edge 음성 중지 중 오류:', error)
    }
  }

  async edgeSafeSpeak(utterance) {
    try {
      if (this.isEdge) {
        // Edge에서는 단계별 안전한 재생
        console.log('🔧 Edge 전용 안전 재생 모드')

        // 1단계: 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 100))

        // 2단계: 재생 전 상태 확인
        if (!window.speechSynthesis) {
          throw new Error('speechSynthesis 사용 불가')
        }

        if (window.speechSynthesis.speaking) {
          console.log('🔧 Edge: 기존 음성 중지 후 재생')
          speechSynthesis.cancel()
          await new Promise((resolve) => setTimeout(resolve, 200))
        }

        // 3단계: Edge에서 안전한 재생
        console.log('🔧 Edge: 음성 재생 시작')
        speechSynthesis.speak(utterance)
      } else {
        // 다른 브라우저에서는 즉시 재생
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error('Edge 안전 재생 실패:', error)
      this.handleSpeechError()
    }
  }

  handleSpeechError(speakerElement = null) {
    this.isPlaying = false
    if (speakerElement) {
      this.updateSpeakerUI(speakerElement, false)

      if (this.isEdge) {
        speakerElement.title = 'Edge 음성 재생 오류 - 다시 시도해주세요'
        speakerElement.style.color = '#ff6b6b'
      } else {
        speakerElement.title = '음성 재생 오류 - 다시 시도해주세요'
        speakerElement.style.color = '#ff6b6b'
      }

      // 3초 후 원래대로 복구
      setTimeout(() => {
        speakerElement.style.color = ''
        speakerElement.title = '일본인 여성 목소리로 듣기'
      }, 3000)
    }
  }

  showUnsupportedMessage(speakerElement) {
    if (speakerElement) {
      speakerElement.textContent = '❌'
      speakerElement.title = '이 브라우저는 음성 기능을 지원하지 않습니다'
      speakerElement.style.color = '#999'
    }
  }

  updateSpeakerUI(speakerElement, isPlaying) {
    if (!speakerElement) return

    if (isPlaying) {
      speakerElement.classList.add('playing')
      speakerElement.textContent = '🔇'

      if (this.isEdge) {
        speakerElement.title = '일본인 여성 목소리 재생 중... (Edge 호환 모드)'
      } else {
        speakerElement.title = '일본인 여성 목소리 재생 중...'
      }

      // 일본 스타일 색상
      speakerElement.style.color = '#ff69b4'
      speakerElement.style.filter = 'drop-shadow(0 0 10px rgba(255, 182, 193, 0.7))'
    } else {
      speakerElement.classList.remove('playing')
      speakerElement.textContent = '🔊'

      if (this.isEdge) {
        speakerElement.title = '일본인 여성 목소리로 듣기 (Edge 완전 호환)'
      } else {
        speakerElement.title = '일본인 여성 목소리로 듣기'
      }

      // 원래 스타일로 복원
      speakerElement.style.color = ''
      speakerElement.style.filter = ''
    }
  }

  stop() {
    this.isPlaying = false

    try {
      if (window.speechSynthesis) {
        if (this.isEdge) {
          // Edge 전용 안전한 중지
          console.log('🔧 Edge 전용 음성 중지')
          speechSynthesis.cancel()

          // Edge에서는 추가 정리 작업
          setTimeout(() => {
            if (window.speechSynthesis.speaking) {
              speechSynthesis.cancel()
            }
          }, 100)
        } else {
          speechSynthesis.cancel()
          console.log('🎵 일반 브라우저 음성 중지')
        }
      }
    } catch (error) {
      console.warn('음성 중지 중 오류:', error)
    }

    // 오디오 엘리먼트도 중지
    if (this.currentAudio) {
      try {
        this.currentAudio.pause()
        this.currentAudio.currentTime = 0
        this.currentAudio = null
      } catch (error) {
        console.warn('오디오 중지 중 오류:', error)
      }
    }
  }

  // Edge 전용 디버깅 메서드
  debugEdge() {
    console.log('🔍 Edge 디버깅 정보:')
    console.log('브라우저:', this.isEdge ? 'Microsoft Edge' : '기타')
    console.log('User Agent:', navigator.userAgent)
    console.log('speechSynthesis 지원:', !!window.speechSynthesis)

    if (window.speechSynthesis) {
      const voices = speechSynthesis.getVoices()
      console.log('사용 가능한 음성 수:', voices.length)
      console.log('현재 재생 중:', speechSynthesis.speaking)
      console.log('일시정지 상태:', speechSynthesis.paused)
      console.log('대기 중:', speechSynthesis.pending)

      // Edge용 음성 목록 출력
      voices.forEach((voice, index) => {
        if (voice.lang.includes('ko') || voice.lang.includes('ja')) {
          console.log(
            `${index}: ${voice.name} (${voice.lang}) - ${voice.localService ? 'Local' : 'Remote'}`,
          )
        }
      })
    }
  }

  // 상태 확인 메서드
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      browser: this.isEdge ? 'Microsoft Edge' : '기타 브라우저',
      edgeOptimized: this.isEdge,
      speechSupported: !!window.speechSynthesis,
      voicesAvailable: window.speechSynthesis ? speechSynthesis.getVoices().length : 0,
      engine: 'Web Speech API (Edge 최적화)',
      voiceType: '일본인 여성 목소리',
      pitchSupported: !this.isEdge, // Edge는 pitch 미지원
    }
  }

  // Edge 전용 음성 테스트
  testEdgeVoice() {
    console.log('🔧 Edge 전용 음성 테스트 시작...')
    this.debugEdge()

    const testText = '안녕하세요! Edge에서 일본인 여성 목소리 테스트입니다.'
    const dummyElement = {
      classList: { add: () => {}, remove: () => {} },
      style: {},
      textContent: '',
      title: '',
    }

    this.speakWithWebSpeech(testText, dummyElement)
  }
}

// 전역에서 접근 가능하도록 (개발용)
if (typeof window !== 'undefined') {
  window.AudioManager = AudioManager
}

// Edge 전용 사용 예제 (주석)
/*
// 기본 사용법
const audioManager = new AudioManager()
audioManager.toggleSpeech("안녕하세요!", speakerElement)

// Edge 디버깅
audioManager.debugEdge()

// Edge 음성 테스트
audioManager.testEdgeVoice()

// 상태 확인
console.log(audioManager.getStatus())
*/
