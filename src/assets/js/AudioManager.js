/**
 * 모바일 크롬 "피리오도" 문제 완전 해결!
 * 모바일 환경에서 언어 불일치로 인한 이상한 소리 방지
 */
export class AudioManager {
  constructor() {
    this.isPlaying = false
    this.currentAudio = null
    this.isEdge = navigator.userAgent.includes('Edge') || navigator.userAgent.includes('Edg/')
    this.isMobileSafari = this.detectMobileSafari()
    this.isMobileChrome = this.detectMobileChrome() // 🆕 모바일 크롬 감지 추가
    this.isMobile = this.detectMobile() // 🆕 전체 모바일 감지
    this.initializeForDevice()
  }

  detectMobileSafari() {
    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod/i.test(ua)
    const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS/i.test(ua)
    return isMobile && isSafari
  }

  // 🆕 모바일 크롬 감지 (피리오도 문제 해결용)
  detectMobileChrome() {
    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
    const isChrome = /Chrome|CriOS/i.test(ua) && !/Edg|Edge/i.test(ua)

    console.log('📱 모바일 크롬 감지:', isMobile && isChrome ? 'YES' : 'NO')
    return isMobile && isChrome
  }

  // 🆕 전체 모바일 환경 감지
  detectMobile() {
    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)

    console.log('📱 모바일 환경:', isMobile ? 'YES' : 'NO')
    console.log('🔍 User Agent:', ua)

    return isMobile
  }

  async initializeForDevice() {
    if (this.isMobileSafari) {
      console.log('📱 모바일 사파리 전용 최적화 모드')
      await this.waitForMobileSafariVoices()
    } else if (this.isMobileChrome) {
      console.log('📱 모바일 크롬 전용 최적화 모드 (피리오도 방지!)') // 🆕
      await this.waitForMobileChromeVoices()
    } else if (this.isMobile) {
      console.log('📱 기타 모바일 브라우저 최적화 모드') // 🆕
      await this.waitForMobileVoices()
    } else if (this.isEdge) {
      console.log('🌐 Edge 전용 최적화 모드')
      await this.waitForEdgeVoices()
    } else {
      console.log('💻 데스크톱 브라우저 모드')
      await this.waitForVoices()
    }

    // 🆕 한국어 음성 강제 사용 알림
    if (this.isMobileChrome || this.isMobile) {
      console.log('🎵 모바일 환경: 한국어 음성으로 안전 재생!')
    } else {
      console.log('🎵 일본인 여성 목소리 준비 완료!')
    }
  }

  async waitForMobileSafariVoices() {
    console.log('📱 모바일 사파리 음성 로딩 중...')
    let attempts = 0
    const maxAttempts = 15

    while (attempts < maxAttempts) {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        console.log(`✅ 모바일 사파리에서 ${voices.length}개 음성 로드 완료`)
        const koreanVoices = voices.filter((v) => v.lang.includes('ko'))
        console.log('🇰🇷 한국어 음성 수:', koreanVoices.length)
        return voices
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
      attempts++
      console.log(`📱 모바일 사파리 음성 로딩 중... (${attempts}/${maxAttempts})`)
    }
    console.warn('⚠️ 모바일 사파리에서 음성 로딩 시간 초과')
    return []
  }

  // 🆕 모바일 크롬 전용 음성 로딩
  async waitForMobileChromeVoices() {
    console.log('📱 모바일 크롬 음성 로딩 중... (피리오도 방지 모드)')
    let attempts = 0
    const maxAttempts = 12 // 모바일이므로 좀 더 여유롭게

    while (attempts < maxAttempts) {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        console.log(`✅ 모바일 크롬에서 ${voices.length}개 음성 로드 완료`)

        // 한국어 음성 우선 확인 (피리오도 방지)
        const koreanVoices = voices.filter((v) => v.lang.includes('ko'))
        const japaneseVoices = voices.filter((v) => v.lang.includes('ja'))

        console.log('🇰🇷 한국어 음성 수:', koreanVoices.length)
        console.log('🇯🇵 일본어 음성 수:', japaneseVoices.length, '(사용 안 함 - 피리오도 방지)')

        return voices
      }
      await new Promise((resolve) => setTimeout(resolve, 400))
      attempts++
      console.log(`📱 모바일 크롬 음성 로딩 중... (${attempts}/${maxAttempts})`)
    }
    console.warn('⚠️ 모바일 크롬에서 음성 로딩 시간 초과')
    return []
  }

  // 🆕 기타 모바일 브라우저용
  async waitForMobileVoices() {
    console.log('📱 모바일 브라우저 음성 로딩 중...')
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) {
        console.log(`✅ 모바일 브라우저에서 ${voices.length}개 음성 로드 완료`)
        return voices
      }
      await new Promise((resolve) => setTimeout(resolve, 300))
      attempts++
    }
    return []
  }

  async waitForEdgeVoices() {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const voices = speechSynthesis.getVoices()
      if (voices.length > 0) return voices
      await new Promise((resolve) => setTimeout(resolve, 200))
      attempts++
    }
    return []
  }

  async waitForVoices() {
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

    this.speakWithWebSpeech(text, speakerElement)
  }

  speakWithWebSpeech(text, speakerElement) {
    if (!window.speechSynthesis) {
      console.error('음성 합성을 지원하지 않는 브라우저입니다')
      this.showUnsupportedMessage(speakerElement)
      return
    }

    try {
      this.safeStop()
      const utterance = new SpeechSynthesisUtterance(text)

      // 🆕 디바이스별 음성 선택 (모바일 크롬 대응)
      const selectedVoice = this.selectVoiceForDevice()

      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log('🎵 선택된 음성:', selectedVoice.name, `(${selectedVoice.lang})`)
      }

      this.setupVoiceForDevice(utterance, selectedVoice)
      this.setupUtteranceEvents(utterance, speakerElement)
      this.safeSpeak(utterance)
    } catch (error) {
      console.error('음성 재생 오류:', error)
      this.handleSpeechError(speakerElement)
    }
  }

  selectVoiceForDevice() {
    const voices = speechSynthesis.getVoices()

    if (this.isMobileSafari) {
      return this.selectMobileSafariVoice(voices)
    } else if (this.isMobileChrome) {
      // 🆕 모바일 크롬 전용 음성 선택 (피리오도 방지)
      return this.selectMobileChromeVoice(voices)
    } else if (this.isMobile) {
      // 🆕 기타 모바일 환경
      return this.selectMobileVoice(voices)
    } else if (this.isEdge) {
      return this.selectEdgeVoice(voices)
    } else {
      return this.selectDesktopVoice(voices) // 🆕 데스크톱 전용으로 분리
    }
  }

  selectMobileSafariVoice(voices) {
    console.log('📱 모바일 사파리 전용 음성 선택')

    const priorities = [
      (voice) => voice.lang.includes('ko') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('ko'),
      (voice) => voice.lang.includes('en') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('en'),
      (voice) => true,
    ]

    for (const condition of priorities) {
      const voice = voices.find(condition)
      if (voice) {
        console.log('✅ 모바일 사파리 음성 선택:', voice.name, `(${voice.lang})`)
        return voice
      }
    }
    return null
  }

  // 🆕 모바일 크롬 전용 음성 선택 (피리오도 방지!)
  selectMobileChromeVoice(voices) {
    console.log('📱 모바일 크롬 전용 음성 선택 (피리오도 방지 + 여성 음성 우선)')

    // 🆕 음성 디버깅: 사용 가능한 모든 한국어 음성 출력
    const koreanVoices = voices.filter((v) => v.lang.includes('ko'))
    console.log('🇰🇷 사용 가능한 한국어 음성들:')
    koreanVoices.forEach((voice, index) => {
      const isFemale = this.isFemaleVoice(voice)
      const genderIcon = isFemale ? '👩' : '👨'
      console.log(
        `  ${index + 1}. ${genderIcon} ${voice.name} (${voice.lang}) - ${isFemale ? '여성' : '남성'}`,
      )
    })

    // ⚠️ 중요: 모바일 크롬에서는 한국어 음성만 사용!
    // 일본어 음성으로 한국어 텍스트 읽으면 "피리오도" 등 이상한 소리 발생
    const priorities = [
      // 🆕 1순위: Google 한국어 여성 음성 (고품질)
      (voice) =>
        voice.name.toLowerCase().includes('google') &&
        voice.lang.includes('ko') &&
        this.isFemaleVoice(voice),

      // 🆕 2순위: 네트워크/클라우드 한국어 여성 음성 (고품질)
      (voice) =>
        (voice.name.toLowerCase().includes('network') ||
          voice.name.toLowerCase().includes('cloud') ||
          voice.name.toLowerCase().includes('enhanced')) &&
        voice.lang.includes('ko') &&
        this.isFemaleVoice(voice),

      // 3순위: 일반 한국어 여성 음성
      (voice) => voice.lang.includes('ko') && this.isFemaleVoice(voice),

      // 🆕 4순위: 시스템 기본 한국어 음성 (성별 미분류, 하지만 보통 여성)
      (voice) =>
        voice.lang.includes('ko') &&
        (voice.name.toLowerCase().includes('system') ||
          voice.name.toLowerCase().includes('default')),

      // 5순위: 한국어 음성 (성별 무관)
      (voice) => voice.lang.includes('ko'),

      // 🆕 6순위: 영어 여성 음성 (한국어 없을 때만, 그래도 여성으로)
      (voice) => voice.lang.includes('en') && this.isFemaleVoice(voice),

      // 7순위: 영어 음성
      (voice) => voice.lang.includes('en'),

      // 8순위: 아무 음성 (일본어 제외!)
      (voice) => !voice.lang.includes('ja'), // 🚫 일본어 음성 제외!

      // 최후: 정말 아무것도 없을 때만
      (voice) => true,
    ]

    for (let i = 0; i < priorities.length; i++) {
      const condition = priorities[i]
      const voice = voices.find(condition)

      if (voice) {
        // 일본어 음성이면 건너뛰기
        if (voice.lang.includes('ja')) {
          console.warn('⚠️ 일본어 음성 발견 - 피리오도 방지를 위해 다른 음성 찾는 중...')
          continue
        }

        const isFemale = this.isFemaleVoice(voice)
        const genderInfo = isFemale ? '👩 여성' : '👨 남성'
        console.log(
          `✅ 모바일 크롬 음성 선택 (우선순위 ${i + 1}): ${voice.name} (${voice.lang}) - ${genderInfo}`,
        )

        // 🆕 남성 음성 선택됐을 때 경고
        if (!isFemale) {
          console.warn(
            '⚠️ 여성 음성을 찾지 못해 남성 음성을 선택했습니다. pitch로 조정할 예정입니다.',
          )
        }

        return voice
      }
    }

    console.warn('⚠️ 모바일 크롬에서 적합한 음성을 찾지 못함')
    return null
  }

  // 🆕 기타 모바일 환경용
  selectMobileVoice(voices) {
    console.log('📱 모바일 브라우저 음성 선택 (안전 모드)')

    const priorities = [
      (voice) => voice.lang.includes('ko') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('ko'),
      (voice) => voice.lang.includes('en') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('en'),
      (voice) => !voice.lang.includes('ja'), // 일본어 제외
      (voice) => true,
    ]

    for (const condition of priorities) {
      const voice = voices.find(condition)
      if (voice) {
        console.log('✅ 모바일 브라우저 음성 선택:', voice.name, `(${voice.lang})`)
        return voice
      }
    }
    return null
  }

  selectEdgeVoice(voices) {
    const priorities = [
      (voice) =>
        voice.name.includes('Microsoft') && voice.lang.includes('ko') && this.isFemaleVoice(voice),
      (voice) => voice.lang.includes('ko') && this.isFemaleVoice(voice),
      (voice) => voice.name.includes('Microsoft') && voice.lang.includes('ja'),
      (voice) => voice.lang.includes('ja'),
      (voice) => voice.lang.includes('ko'),
      (voice) =>
        voice.name.includes('Microsoft') && voice.lang.includes('en') && this.isFemaleVoice(voice),
      (voice) => true,
    ]

    for (const condition of priorities) {
      const voice = voices.find(condition)
      if (voice) return voice
    }
    return null
  }

  // 🆕 데스크톱 전용으로 분리 (일본어 음성 허용)
  selectDesktopVoice(voices) {
    console.log('💻 데스크톱 브라우저 음성 선택')

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
      if (voice) {
        console.log('✅ 데스크톱 음성 선택:', voice.name, `(${voice.lang})`)
        return voice
      }
    }
    return null
  }

  isFemaleVoice(voice) {
    const voiceName = voice.name.toLowerCase()
    const voiceLang = voice.lang.toLowerCase()

    // 🆕 모바일 환경 특화 여성 음성 키워드 대폭 확장!
    const femaleKeywords = [
      // 기본 여성 키워드
      'female',
      'woman',
      'girl',
      '여성',
      '여자',
      '여',

      // 데스크톱 음성들
      'zira',
      'hazel',
      'heami',
      'kyoko',
      'haruka',
      'yuna',
      'siri',

      // 🆕 모바일 크롬 & 안드로이드 특화
      'google 한국어',
      'chrome korean',
      'android korean',
      'samsung korean',
      'samsung 한국어',
      'lg korean',
      'lg 한국어',

      // 🆕 iOS 특화 (iPhone/iPad)
      'siri female',
      'yuna',
      'korean siri',
      'ios korean',

      // 🆕 시스템 음성 (보통 여성이 기본)
      'system korean',
      'system 한국어',
      'default korean',

      // 🆕 네트워크 음성 (클라우드 TTS, 보통 고품질 여성 음성)
      'network',
      'cloud',
      'enhanced',
      'premium',

      // 🆕 특정 모바일 브랜드
      'xiaomi',
      'huawei',
      'oppo',
      'vivo',
      'oneplus',
    ]

    // 1차: 키워드 매칭
    const hasKeyword = femaleKeywords.some((keyword) => voiceName.includes(keyword))
    if (hasKeyword) {
      console.log(`✅ 여성 음성 키워드 매칭: ${voice.name}`)
      return true
    }

    // 🆕 2차: 모바일 특화 패턴 매칭
    if (this.isMobile) {
      // 네트워크 기반 음성은 보통 고품질 여성 음성
      if (voiceName.includes('network') || voiceName.includes('x-')) {
        console.log(`✅ 모바일 네트워크 음성 (여성 추정): ${voice.name}`)
        return true
      }

      // 한국어 음성 중에서 이름에 숫자나 특수 코드가 있으면 시스템 기본 (보통 여성)
      if (voiceLang.includes('ko') && /[0-9]/.test(voiceName)) {
        console.log(`✅ 모바일 시스템 한국어 음성 (여성 추정): ${voice.name}`)
        return true
      }

      // 'female' 없어도 남성 키워드가 없으면 여성으로 간주 (모바일 환경)
      const maleKeywords = ['male', 'man', 'boy', '남성', '남자', '남']
      const hasMaleKeyword = maleKeywords.some((keyword) => voiceName.includes(keyword))

      if (!hasMaleKeyword && voiceLang.includes('ko')) {
        console.log(`✅ 모바일 한국어 음성 (남성 키워드 없음, 여성 추정): ${voice.name}`)
        return true
      }
    }

    console.log(`❌ 남성 음성으로 분류: ${voice.name}`)
    return false
  }

  setupVoiceForDevice(utterance, selectedVoice) {
    if (this.isMobileSafari) {
      utterance.lang = 'ko-KR'
      utterance.rate = 0.8
      utterance.volume = 0.9
      console.log('📱 모바일 사파리: 한국어 모드')
    } else if (this.isMobileChrome) {
      // 🆕 모바일 크롬: 항상 한국어로 설정 (피리오도 방지!)
      utterance.lang = 'ko-KR'
      utterance.rate = 0.8
      utterance.volume = 0.9

      // 🆕 남성 음성일 때 pitch 높이기 (여성스럽게 조정)
      if (selectedVoice && !this.isFemaleVoice(selectedVoice)) {
        utterance.pitch = 1.6 // 높은 pitch로 여성스럽게
        console.log('📱 모바일 크롬: 한국어 모드 + 남성 음성 pitch 조정 (1.6)')
      } else {
        utterance.pitch = 1.2 // 여성 음성도 약간 높게
        console.log('📱 모바일 크롬: 한국어 모드 + 여성 음성 (피리오도 방지!)')
      }
    } else if (this.isMobile) {
      // 🆕 기타 모바일: 안전하게 한국어
      utterance.lang = 'ko-KR'
      utterance.rate = 0.8
      utterance.volume = 0.9

      // 🆕 모바일에서도 pitch 조정
      if (selectedVoice && !this.isFemaleVoice(selectedVoice)) {
        utterance.pitch = 1.5 // 남성 음성 pitch 높이기
        console.log('📱 모바일 브라우저: 한국어 안전 모드 + 남성 음성 pitch 조정')
      } else {
        utterance.pitch = 1.1
        console.log('📱 모바일 브라우저: 한국어 안전 모드')
      }
    } else if (this.isEdge) {
      if (selectedVoice && selectedVoice.lang.includes('ja')) {
        utterance.lang = 'ja-JP'
      } else {
        utterance.lang = 'ko-KR'
      }
      utterance.rate = 0.8
      utterance.volume = 0.9
    } else {
      // 💻 데스크톱: 일본어 허용
      if (selectedVoice && selectedVoice.lang.includes('ja')) {
        utterance.lang = 'ja-JP'
      } else {
        utterance.lang = 'ko-KR'
      }
      utterance.pitch = 1.4
      utterance.rate = 0.9
      utterance.volume = 0.8
    }
  }

  setupUtteranceEvents(utterance, speakerElement) {
    utterance.onstart = () => {
      this.isPlaying = true
      this.updateSpeakerUI(speakerElement, true)

      if (this.isMobileChrome) {
        console.log('📱 모바일 크롬에서 한국어 음성 재생 시작! (피리오도 없음)')
      } else if (this.isMobile) {
        console.log('📱 모바일에서 안전한 한국어 음성 재생 시작!')
      } else {
        console.log('🎵 음성 재생 시작!')
      }
    }

    utterance.onend = () => {
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)

      if (this.isMobileChrome) {
        console.log('📱 모바일 크롬에서 한국어 음성 재생 완료! (피리오도 방지 성공)')
      } else if (this.isMobile) {
        console.log('📱 모바일에서 안전한 음성 재생 완료!')
      } else {
        console.log('🎵 음성 재생 완료!')
      }
    }

    utterance.onerror = (event) => {
      console.error('음성 재생 오류:', event.error)
      this.isPlaying = false
      this.updateSpeakerUI(speakerElement, false)
      this.handleSpeechError(speakerElement)
    }
  }

  safeStop() {
    try {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        speechSynthesis.cancel()

        if (this.isMobileChrome || this.isMobile) {
          // 🆕 모바일 환경에서는 더 긴 대기
          return new Promise((resolve) => setTimeout(resolve, 300))
        } else if (this.isEdge) {
          return new Promise((resolve) => setTimeout(resolve, 100))
        }
      }
    } catch (error) {
      console.warn('음성 중지 중 오류:', error)
    }
  }

  async safeSpeak(utterance) {
    try {
      if (this.isMobileChrome) {
        // 🆕 모바일 크롬 전용 안전 재생
        console.log('📱 모바일 크롬 전용 안전 재생 모드 (피리오도 방지)')
        await new Promise((resolve) => setTimeout(resolve, 300))

        if (window.speechSynthesis.speaking) {
          console.log('📱 모바일 크롬: 기존 음성 중지 후 재생')
          speechSynthesis.cancel()
          await new Promise((resolve) => setTimeout(resolve, 400))
        }
        speechSynthesis.speak(utterance)
      } else if (this.isMobile) {
        // 🆕 기타 모바일 환경
        console.log('📱 모바일 브라우저 안전 재생 모드')
        await new Promise((resolve) => setTimeout(resolve, 250))

        if (speechSynthesis.speaking) {
          speechSynthesis.cancel()
          await new Promise((resolve) => setTimeout(resolve, 350))
        }
        speechSynthesis.speak(utterance)
      } else if (this.isEdge) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel()
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
        speechSynthesis.speak(utterance)
      } else {
        // 💻 데스크톱 즉시 재생
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error('안전 재생 실패:', error)
      this.handleSpeechError()
    }
  }

  handleSpeechError(speakerElement = null) {
    this.isPlaying = false
    if (speakerElement) {
      this.updateSpeakerUI(speakerElement, false)

      if (this.isMobileChrome) {
        speakerElement.title = '모바일 크롬 음성 재생 오류 - 다시 시도해주세요'
      } else if (this.isMobile) {
        speakerElement.title = '모바일 음성 재생 오류 - 다시 시도해주세요'
      } else {
        speakerElement.title = '음성 재생 오류 - 다시 시도해주세요'
      }

      speakerElement.style.color = '#ff6b6b'

      setTimeout(() => {
        speakerElement.style.color = ''
        if (this.isMobileChrome || this.isMobile) {
          speakerElement.title = '한국어 음성으로 듣기 (모바일 최적화)'
        } else {
          speakerElement.title = '일본인 여성 목소리로 듣기'
        }
      }, 3000)
    }
  }

  showUnsupportedMessage(speakerElement) {
    if (speakerElement) {
      speakerElement.textContent = '❌'
      speakerElement.title = '이 기기는 음성 기능을 지원하지 않습니다'
      speakerElement.style.color = '#999'
    }
  }

  updateSpeakerUI(speakerElement, isPlaying) {
    if (!speakerElement) return

    if (isPlaying) {
      speakerElement.classList.add('playing')
      speakerElement.textContent = '🔇'

      if (this.isMobileChrome) {
        speakerElement.title = '한국어 음성 재생 중... (모바일 크롬 최적화, 피리오도 없음!)'
      } else if (this.isMobile) {
        speakerElement.title = '한국어 음성 재생 중... (모바일 최적화)'
      } else {
        speakerElement.title = '음성 재생 중...'
      }

      speakerElement.style.color = '#ff69b4'
      speakerElement.style.filter = 'drop-shadow(0 0 10px rgba(255, 182, 193, 0.7))'
    } else {
      speakerElement.classList.remove('playing')
      speakerElement.textContent = '🔊'

      if (this.isMobileChrome) {
        speakerElement.title = '한국어 음성으로 듣기 (모바일 크롬 최적화, 피리오도 방지!)'
      } else if (this.isMobile) {
        speakerElement.title = '한국어 음성으로 듣기 (모바일 최적화)'
      } else {
        speakerElement.title = '일본인 여성 목소리로 듣기'
      }

      speakerElement.style.color = ''
      speakerElement.style.filter = ''
    }
  }

  stop() {
    this.isPlaying = false

    try {
      if (window.speechSynthesis) {
        speechSynthesis.cancel()

        if (this.isMobileChrome) {
          console.log('📱 모바일 크롬 음성 중지 (피리오도 방지 모드)')
          setTimeout(() => {
            if (speechSynthesis.speaking) {
              speechSynthesis.cancel()
            }
          }, 200)
        } else if (this.isMobile) {
          console.log('📱 모바일 브라우저 음성 중지')
          setTimeout(() => {
            if (speechSynthesis.speaking) {
              speechSynthesis.cancel()
            }
          }, 200)
        } else {
          console.log('🎵 음성 중지')
        }
      }
    } catch (error) {
      console.warn('음성 중지 중 오류:', error)
    }
  }

  // 🆕 디버깅 메서드 강화
  debugDevice() {
    console.log('🔍 디바이스 디버깅 정보 (피리오도 + 남성 음성 문제 분석):')
    console.log('📱 모바일 사파리:', this.isMobileSafari ? 'YES' : 'NO')
    console.log('📱 모바일 크롬:', this.isMobileChrome ? 'YES' : 'NO')
    console.log('📱 전체 모바일:', this.isMobile ? 'YES' : 'NO')
    console.log('🌐 Edge:', this.isEdge ? 'YES' : 'NO')
    console.log('User Agent:', navigator.userAgent)
    console.log('speechSynthesis 지원:', !!window.speechSynthesis)

    if (window.speechSynthesis) {
      const voices = speechSynthesis.getVoices()
      console.log('사용 가능한 음성 수:', voices.length)

      const koreanVoices = voices.filter((v) => v.lang.includes('ko'))
      const japaneseVoices = voices.filter((v) => v.lang.includes('ja'))

      console.log('\n🇰🇷 한국어 음성들 (성별 분석):')
      koreanVoices.forEach((voice, index) => {
        const isFemale = this.isFemaleVoice(voice)
        const genderIcon = isFemale ? '👩' : '👨'
        const safetyIcon = isFemale ? '✅' : '⚠️'
        console.log(
          `  ${index + 1}. ${genderIcon} ${safetyIcon} ${voice.name} (${voice.lang}) - ${isFemale ? '여성 (권장)' : '남성 (pitch 조정됨)'}`,
        )
      })

      console.log('\n🇯🇵 일본어 음성들:')
      japaneseVoices.forEach((voice, index) => {
        const warning =
          this.isMobileChrome || this.isMobile
            ? ' 🚫 모바일에서 사용 금지!'
            : ' ✅ 데스크톱에서 사용 가능'
        console.log(`  ${index + 1}. ${voice.name} (${voice.lang})${warning}`)
      })

      // 🆕 실제 선택될 음성 미리보기
      console.log('\n🎯 현재 환경에서 선택될 음성:')
      const selectedVoice = this.selectVoiceForDevice()
      if (selectedVoice) {
        const isFemale = this.isFemaleVoice(selectedVoice)
        const genderIcon = isFemale ? '👩' : '👨'
        console.log(`  선택된 음성: ${genderIcon} ${selectedVoice.name} (${selectedVoice.lang})`)
        console.log(`  성별: ${isFemale ? '여성' : '남성'}`)
        console.log(
          `  Pitch 조정: ${!isFemale && (this.isMobileChrome || this.isMobile) ? 'YES (1.5-1.6)' : 'NO/기본'}`,
        )
      } else {
        console.log('  ❌ 선택된 음성 없음')
      }

      // 🆕 문제 분석
      console.log('\n🚨 문제 분석:')
      if (this.isMobileChrome || this.isMobile) {
        console.log('  - 현재 모바일 환경이므로 한국어 음성만 사용')
        console.log('  - 일본어 TTS로 한국어 텍스트 읽으면 "피리오도" 발생')
        console.log('  - 남성 음성 선택 시 pitch를 높여서 여성스럽게 조정')

        const femaleKoreanCount = koreanVoices.filter((v) => this.isFemaleVoice(v)).length
        if (femaleKoreanCount === 0) {
          console.log('  ⚠️ 여성 한국어 음성이 없어서 남성 음성을 pitch 조정해서 사용')
        } else {
          console.log(`  ✅ 여성 한국어 음성 ${femaleKoreanCount}개 사용 가능`)
        }
      }

      // 🆕 권장사항
      console.log('\n💡 권장사항:')
      if (this.isMobileChrome || this.isMobile) {
        if (koreanVoices.filter((v) => this.isFemaleVoice(v)).length === 0) {
          console.log('  - 시스템 설정에서 여성 한국어 음성을 추가 다운로드하세요')
          console.log('  - 현재는 pitch 조정으로 남성 음성을 여성스럽게 만들고 있습니다')
        }
      }
    }
  }

  // 🆕 상태 확인 메서드 강화
  getStatus() {
    let deviceType = '💻 데스크톱'
    let voiceMode = '일본인 여성 목소리'
    let safetyMode = '일반 모드'

    if (this.isMobileSafari) {
      deviceType = '📱 모바일 사파리'
      voiceMode = '한국어 음성'
      safetyMode = '사파리 최적화'
    } else if (this.isMobileChrome) {
      deviceType = '📱 모바일 크롬'
      voiceMode = '한국어 음성'
      safetyMode = '피리오도 방지 + 여성 음성 우선' // 🆕
    } else if (this.isMobile) {
      deviceType = '📱 모바일 브라우저'
      voiceMode = '한국어 음성'
      safetyMode = '모바일 안전 모드 + 여성 음성 우선' // 🆕
    } else if (this.isEdge) {
      deviceType = '🌐 Edge'
    }

    // 🆕 현재 선택된 음성 정보
    const selectedVoice = this.selectVoiceForDevice()
    let currentVoiceInfo = '음성 정보 없음'
    let genderAdjustment = '없음'

    if (selectedVoice) {
      const isFemale = this.isFemaleVoice(selectedVoice)
      const genderIcon = isFemale ? '👩' : '👨'
      currentVoiceInfo = `${genderIcon} ${selectedVoice.name} (${selectedVoice.lang})`

      if (!isFemale && (this.isMobileChrome || this.isMobile)) {
        genderAdjustment = 'Pitch 조정 (1.5-1.6) - 남성 음성을 여성스럽게'
      }
    }

    return {
      isPlaying: this.isPlaying,
      device: deviceType,
      mobileSafari: this.isMobileSafari,
      mobileChrome: this.isMobileChrome,
      mobile: this.isMobile,
      edgeOptimized: this.isEdge,
      speechSupported: !!window.speechSynthesis,
      voicesAvailable: window.speechSynthesis ? speechSynthesis.getVoices().length : 0,
      engine: 'Web Speech API (디바이스 최적화)',
      voiceType: voiceMode,
      safetyMode: safetyMode,
      languageMode: this.isMobileChrome || this.isMobile ? 'ko-KR (피리오도 방지)' : 'ja-JP/ko-KR',
      pireriodoPrevention: this.isMobileChrome || this.isMobile,
      currentVoice: currentVoiceInfo, // 🆕
      genderAdjustment: genderAdjustment, // 🆕
      femaleVoicePriority: this.isMobileChrome || this.isMobile, // 🆕
    }
  }

  // 🆕 음성 테스트 메서드 (개발용)
  testVoiceSelection() {
    console.log('\n🧪 음성 선택 테스트:')

    const voices = speechSynthesis.getVoices()
    if (voices.length === 0) {
      console.log('❌ 사용 가능한 음성이 없습니다.')
      return
    }

    console.log(`📊 전체 음성 수: ${voices.length}`)

    // 한국어 음성 분석
    const koreanVoices = voices.filter((v) => v.lang.includes('ko'))
    const femaleKoreanVoices = koreanVoices.filter((v) => this.isFemaleVoice(v))
    const maleKoreanVoices = koreanVoices.filter((v) => !this.isFemaleVoice(v))

    console.log(`🇰🇷 한국어 음성: ${koreanVoices.length}개`)
    console.log(`👩 여성 한국어: ${femaleKoreanVoices.length}개`)
    console.log(`👨 남성 한국어: ${maleKoreanVoices.length}개`)

    // 선택 결과
    const selectedVoice = this.selectVoiceForDevice()
    if (selectedVoice) {
      const isFemale = this.isFemaleVoice(selectedVoice)
      console.log(`\n🎯 최종 선택: ${selectedVoice.name}`)
      console.log(`   언어: ${selectedVoice.lang}`)
      console.log(`   성별: ${isFemale ? '👩 여성' : '👨 남성'}`)
      console.log(
        `   Pitch 조정: ${!isFemale && (this.isMobileChrome || this.isMobile) ? '적용됨' : '없음'}`,
      )
    }

    return {
      totalVoices: voices.length,
      koreanVoices: koreanVoices.length,
      femaleKorean: femaleKoreanVoices.length,
      maleKorean: maleKoreanVoices.length,
      selectedVoice: selectedVoice ? selectedVoice.name : null,
      selectedGender: selectedVoice
        ? this.isFemaleVoice(selectedVoice)
          ? 'female'
          : 'male'
        : null,
    }
  }
}

// 전역에서 접근 가능하도록 (개발용)
if (typeof window !== 'undefined') {
  window.AudioManager = AudioManager
}

// 🆕 모바일 크롬 사용 예제
/*
// 기본 사용법 (모바일 크롬에서 피리오도 방지)
const audioManager = new AudioManager()
audioManager.toggleSpeech("안녕하세요! 이제 피리오도 소리가 안 나요.", speakerElement)

// 디바이스별 디버깅
audioManager.debugDevice()

// 피리오도 방지 상태 확인
const status = audioManager.getStatus()
console.log('피리오도 방지:', status.pireriodoPrevention)
console.log('안전 모드:', status.safetyMode)
*/
