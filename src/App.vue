<template>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <title>복음퍼즐-펜토미노-이도겸</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</template>

<script>
/**
 * 오디오 관리 클래스 - TTS 기능 담당
 */
class AudioManager {
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

/**
 * 효과 관리 클래스 - 시각 효과 담당
 */
class EffectManager {
  createSparkles(element) {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.createSparkle(centerX, centerY)
      }, i * 100)
    }
  }

  createSparkle(x, y) {
    const sparkle = document.createElement('div')
    sparkle.style.position = 'fixed'
    sparkle.style.left = x + 'px'
    sparkle.style.top = y + 'px'
    sparkle.style.width = '4px'
    sparkle.style.height = '4px'
    sparkle.style.background = '#FFD700'
    sparkle.style.borderRadius = '50%'
    sparkle.style.pointerEvents = 'none'
    sparkle.style.zIndex = '9999'
    sparkle.style.boxShadow = '0 0 10px #FFD700'

    const randomX = (Math.random() - 0.5) * 100
    const randomY = (Math.random() - 0.5) * 100

    sparkle.style.animation = 'sparkleFloat 1.5s ease-out forwards'
    sparkle.style.setProperty('--random-x', randomX + 'px')
    sparkle.style.setProperty('--random-y', randomY + 'px')

    document.body.appendChild(sparkle)

    setTimeout(() => {
      sparkle.remove()
    }, 1500)
  }

  createBlessedLight(element) {
    const rect = element.getBoundingClientRect()
    const light = document.createElement('div')
    light.style.position = 'fixed'
    light.style.left = rect.left + 'px'
    light.style.top = rect.top + 'px'
    light.style.width = rect.width + 'px'
    light.style.height = rect.height + 'px'
    light.style.background = 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)'
    light.style.borderRadius = '10px'
    light.style.pointerEvents = 'none'
    light.style.zIndex = '9998'
    light.style.animation = 'blessedGlow 2s ease-out forwards'

    document.body.appendChild(light)

    setTimeout(() => {
      light.remove()
    }, 2000)
  }
}

/**
 * 퍼즐 렌더링 클래스 - 퍼즐 보드 렌더링 담당
 */
class PuzzleRenderer {
  constructor(containerId, options) {
    this.containerId = containerId
    this.options = options
    this.puzzlePattern = [
      ['red', 'red', 'yellow', 'yellow', 'yellow', 'green'],
      ['red', 'red', 'yellow', 'yellow', 'green', 'green'],
      ['red', 'red', 'yellow', 'white', 'green', 'green'],
      ['red', 'red', 'white', 'white', 'green', 'green'],
      ['white', 'white', 'white', 'black', 'black', 'black'],
      ['white', 'white', 'black', 'black', 'black', 'black'],
    ]
  }

  render(container) {
    container.innerHTML = `
      <div class="gospel-pentomino-container">
        <div class="gospel-pentomino-header">
          <h1 class="gospel-pentomino-title">${this.options.title}</h1>
          <div class="gospel-pentomino-verse">${this.options.verse}</div>
        </div>

        <div class="gospel-pentomino-frame">
          <div class="gospel-pentomino-board" id="${this.containerId}-board" style="width: ${this.options.width}; height: ${this.options.height}">
            ${this.createPuzzleBoard()}
          </div>
        </div>

        <div class="gospel-pentomino-subtitle">${this.options.subtitle}</div>
      </div>

      <!-- 모달 다이얼로그 -->
      <div id="${this.containerId}-modal" class="gospel-pentomino-modal">
        <div class="gospel-pentomino-modal-content">
          <span class="gospel-pentomino-close">&times;</span>
          <div class="gospel-pentomino-color-indicator" id="${this.containerId}-colorIndicator"></div>
          <h2 id="${this.containerId}-modalTitle">
            <div class="gospel-pentomino-speaker" id="${this.containerId}-speaker">🔊</div>
          </h2>
          <p id="${this.containerId}-modalText"></p>
          <div class="gospel-pentomino-bible-verse" id="${this.containerId}-bibleVerse"></div>
        </div>
      </div>
    `
  }

  createPuzzleBoard() {
    let boardHTML = ''
    this.puzzlePattern.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        boardHTML += `
          <div class="gospel-pentomino-piece gospel-pentomino-${color}"
               data-color="${color}"
               data-row="${rowIndex}"
               data-col="${colIndex}">
          </div>
        `
      })
    })
    return boardHTML
  }

  removeSameColorBorders(container) {
    this.puzzlePattern.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        const currentPiece = container.querySelector(
          `[data-row="${rowIndex}"][data-col="${colIndex}"]`,
        )

        // 오른쪽 조각 체크
        if (colIndex < row.length - 1) {
          const rightColor = this.puzzlePattern[rowIndex][colIndex + 1]
          if (color === rightColor) {
            currentPiece.style.borderRight = 'none'
            const rightPiece = container.querySelector(
              `[data-row="${rowIndex}"][data-col="${colIndex + 1}"]`,
            )
            rightPiece.style.borderLeft = 'none'
          }
        }

        // 아래쪽 조각 체크
        if (rowIndex < this.puzzlePattern.length - 1) {
          const bottomColor = this.puzzlePattern[rowIndex + 1][colIndex]
          if (color === bottomColor) {
            currentPiece.style.borderBottom = 'none'
            const bottomPiece = container.querySelector(
              `[data-row="${rowIndex + 1}"][data-col="${colIndex}"]`,
            )
            bottomPiece.style.borderTop = 'none'
          }
        }

        // 왼쪽, 위쪽도 체크
        if (colIndex > 0) {
          const leftColor = this.puzzlePattern[rowIndex][colIndex - 1]
          if (color === leftColor) {
            currentPiece.style.borderLeft = 'none'
          }
        }

        if (rowIndex > 0) {
          const topColor = this.puzzlePattern[rowIndex - 1][colIndex]
          if (color === topColor) {
            currentPiece.style.borderTop = 'none'
          }
        }
      })
    })
  }
}

/**
 * 메인 복음 펜토미노 컴포넌트 클래스 - 전체 제어 담당
 */
class GospelPentomino {
  constructor(containerId, options = {}) {
    this.containerId = containerId
    this.container = document.getElementById(containerId)
    this.options = {
      title: options.title || '복음퍼즐-펜토미노',
      subtitle: options.subtitle || '© Copyright is owned by 이도겸',
      verse: options.verse || '"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니" - 요한복음 3:16',
      width: options.width || 'min(80vw, 80vh)',
      height: options.height || 'min(80vw, 80vh)',
      ...options,
    }

    this.selectedColor = null

    // 모듈 인스턴스 생성
    this.audioManager = new AudioManager()
    this.effectManager = new EffectManager()
    this.puzzleRenderer = new PuzzleRenderer(containerId, this.options)

    this.colorMessages = {
      red: {
        title: '빨간색 - 예수님의 사랑과 희생',
        text: '빨간색은 예수 그리스도께서 우리 죄를 위해 십자가에서 흘리신 보혈을 상징합니다. 하나님의 무한한 사랑이 이 색깔 안에 담겨있습니다.',
        verse:
          '"그가 찔림은 우리의 허물 때문이요 그가 상함은 우리의 죄악 때문이라 그가 징계를 받으므로 우리는 평화를 누리고 그가 채찍에 맞으므로 우리는 나음을 받았도다" - 이사야 53:5',
      },
      black: {
        title: '검은색 - 죄와 어둠에서 벗어남',
        text: '검은색은 우리 모두가 가지고 있던 죄와 영적 어둠을 나타냅니다. 하지만 예수님의 빛이 이 어둠을 이기셨습니다.',
        verse:
          '"모든 사람이 죄를 범하였으매 하나님의 영광에 이르지 못하더니 그리스도 예수 안에 있는 속량으로 말미암아 하나님의 은혜로 값없이 의롭다 하심을 얻은 자 되었느니라" - 로마서 3:23-24',
      },
      yellow: {
        title: '노란색 - 천국과 하나님의 영광',
        text: '노란색(금색)은 하나님의 영광과 천국의 찬란함을 상징합니다. 영원한 생명과 하나님의 임재를 나타냅니다.',
        verse:
          '"그 성은 해나 달의 비침이 쓸 데 없으니 이는 하나님의 영광이 비치고 어린 양이 그 등불이 되심이라" - 요한계시록 21:23',
      },
      green: {
        title: '초록색 - 새 생명과 영적 성장',
        text: '초록색은 그리스트 안에서 얻는 새 생명과 계속되는 영적 성장을 나타냅니다. 하나님의 말씀으로 자라가는 믿음을 상징합니다.',
        verse:
          '"그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다" - 고린도후서 5:17',
      },
      white: {
        title: '흰색 - 순결과 구원의 완성',
        text: '흰색은 예수님을 믿는 자가 받는 죄 사함과 순결함을 상징합니다. 하나님 앞에서 의롭게 여김 받는 상태를 나타냅니다.',
        verse:
          '"너희 죄가 주홍 같을지라도 눈과 같이 희어질 것이요 진홍 같이 붉을지라도 양털 같이 되리라" - 이사야 1:18',
      },
    }

    this.init()
  }

  init() {
    this.puzzleRenderer.render(this.container)
    this.setupEventListeners()
    this.puzzleRenderer.removeSameColorBorders(this.container)
  }

  setupEventListeners() {
    // 조각 클릭 이벤트
    const pieces = this.container.querySelectorAll('.gospel-pentomino-piece')
    pieces.forEach((piece) => {
      piece.addEventListener('click', (e) => this.handlePieceClick(e))
      piece.addEventListener('mouseenter', (e) => this.effectManager.createSparkles(e.target))
    })

    // 모달 관련 이벤트
    const modal = document.getElementById(`${this.containerId}-modal`)
    const closeBtn = this.container.querySelector('.gospel-pentomino-close')
    const speakerBtn = document.getElementById(`${this.containerId}-speaker`)

    closeBtn.addEventListener('click', () => this.closeModal())
    speakerBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      this.handleSpeakerClick()
    })

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal()
      }
    })

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal()
      }
    })
  }

  handleSpeakerClick() {
    const text = document.getElementById(`${this.containerId}-modalText`).textContent
    const speaker = document.getElementById(`${this.containerId}-speaker`)
    this.audioManager.toggleSpeech(text, speaker)
  }

  handlePieceClick(event) {
    const element = event.currentTarget
    const color = element.dataset.color

    // 이전 선택 제거
    this.container.querySelectorAll('.gospel-pentomino-piece').forEach((piece) => {
      piece.classList.remove('active')
    })

    // 같은 색깔 조각들 하이라이트
    this.container.querySelectorAll(`.gospel-pentomino-${color}`).forEach((piece) => {
      piece.classList.add('active')
    })

    this.selectedColor = color
    this.showColorModal(color)
    this.effectManager.createBlessedLight(element)
  }

  showColorModal(color) {
    const modal = document.getElementById(`${this.containerId}-modal`)
    const indicator = document.getElementById(`${this.containerId}-colorIndicator`)
    const title = document.getElementById(`${this.containerId}-modalTitle`)
    const text = document.getElementById(`${this.containerId}-modalText`)
    const verse = document.getElementById(`${this.containerId}-bibleVerse`)

    const message = this.colorMessages[color]
    if (message) {
      indicator.className = `gospel-pentomino-color-indicator gospel-pentomino-${color}`
      title.innerHTML =
        message.title +
        `<span class="gospel-pentomino-speaker" id="${this.containerId}-speaker">🔊</span>`
      text.textContent = message.text
      verse.textContent = message.verse
      modal.style.display = 'block'

      // 스피커 버튼 이벤트 재설정
      const newSpeaker = document.getElementById(`${this.containerId}-speaker`)
      newSpeaker.addEventListener('click', (e) => {
        e.stopPropagation()
        this.handleSpeakerClick()
      })
    }
  }

  closeModal() {
    const modal = document.getElementById(`${this.containerId}-modal`)
    modal.style.display = 'none'

    // 음성 재생 중이면 중지
    this.audioManager.stop()

    // 선택 효과 제거
    this.container.querySelectorAll('.gospel-pentomino-piece').forEach((piece) => {
      piece.classList.remove('active')
    })

    this.selectedColor = null
  }

  // 공개 메서드들
  destroy() {
    this.audioManager.stop()
    this.container.innerHTML = ''
  }

  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions }
    this.puzzleRenderer.options = this.options
    this.init()
  }

  highlightColor(color) {
    this.container.querySelectorAll('.gospel-pentomino-piece').forEach((piece) => {
      piece.classList.remove('active')
    })
    this.container.querySelectorAll(`.gospel-pentomino-${color}`).forEach((piece) => {
      piece.classList.add('active')
    })
  }

  showMessage(color) {
    this.showColorModal(color)
  }
}

// 사용 예제
document.addEventListener('DOMContentLoaded', function () {
  // 기본 사용법
  const pentomino1 = new GospelPentomino('app')

  // 음성 기능을 위한 초기화
  if ('speechSynthesis' in window) {
    // 음성 목록 로드
    speechSynthesis.getVoices()
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices()
      }
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

body {
  font-family: 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
  background:
    radial-gradient(ellipse at center, #1a1a1a 0%, #000000 70%),
    linear-gradient(
      45deg,
      rgba(255, 215, 0, 0.03) 0%,
      rgba(255, 255, 255, 0.01) 50%,
      rgba(255, 215, 0, 0.03) 100%
    );
  position: relative;
}

/* 성스러운 배경 효과 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.08) 0%, transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.06) 0%, transparent 55%),
    radial-gradient(circle at 60% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 40%);
  animation: divineLight 12s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes divineLight {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.gospel-pentomino-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
}

.gospel-pentomino-header {
  text-align: center;
  margin-bottom: 20px;
}

.gospel-pentomino-title {
  font-size: clamp(4rem, 5vw, 4.5rem);
  color: #ffd700;
  text-shadow:
    0 0 15px rgba(255, 215, 0, 0.8),
    0 0 30px rgba(255, 215, 0, 0.6),
    0 0 45px rgba(255, 215, 0, 0.4),
    0 0 60px rgba(255, 215, 0, 0.2);
  margin-bottom: 10px;
  animation: holyGlow 5s ease-in-out infinite alternate;
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;
}

@keyframes holyGlow {
  from {
    text-shadow:
      0 0 15px rgba(255, 215, 0, 0.8),
      0 0 30px rgba(255, 215, 0, 0.6),
      0 0 45px rgba(255, 215, 0, 0.4),
      0 0 60px rgba(255, 215, 0, 0.2);
    transform: scale(1);
  }
  to {
    text-shadow:
      0 0 25px rgba(255, 215, 0, 1),
      0 0 40px rgba(255, 215, 0, 0.8),
      0 0 55px rgba(255, 215, 0, 0.6),
      0 0 70px rgba(255, 215, 0, 0.4);
    transform: scale(1.02);
  }
}

.gospel-pentomino-subtitle {
  font-size: clamp(1.5rem, 2.5vw, 1.5rem);
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
  margin-top: 8px;
  font-weight: 200;
  letter-spacing: 1px;
}

.gospel-pentomino-verse {
  font-size: clamp(0.8rem, 2vw, 1.1rem);
  color: rgba(255, 215, 0, 0.9);
  font-style: italic;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* 나무 색상 프레임 */
.gospel-pentomino-frame {
  position: relative;
  padding: 20px;
  background:
    linear-gradient(145deg, #8b4513, #a0522d, #8b4513),
    linear-gradient(
      45deg,
      rgba(139, 69, 19, 0.9) 0%,
      rgba(160, 82, 45, 0.7) 50%,
      rgba(139, 69, 19, 0.9) 100%
    );
  border-radius: 20px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(205, 133, 63, 0.3),
    inset 0 -1px 0 rgba(92, 51, 23, 0.5),
    0 0 60px rgba(139, 69, 19, 0.25);
  position: relative;
  border: 2px solid rgba(160, 82, 45, 0.4);
}

.gospel-pentomino-frame::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 2px solid transparent;
  border-radius: 15px;
  background: linear-gradient(
      45deg,
      rgba(205, 133, 63, 0.4),
      rgba(160, 82, 45, 0.2),
      rgba(205, 133, 63, 0.4)
    )
    border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: subtract;
  mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;
  pointer-events: none;
}

.gospel-pentomino-frame::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  background: linear-gradient(
    45deg,
    rgba(139, 69, 19, 0.6) 0%,
    rgba(205, 133, 63, 0.4) 25%,
    rgba(139, 69, 19, 0.6) 50%,
    rgba(205, 133, 63, 0.4) 75%,
    rgba(139, 69, 19, 0.6) 100%
  );
  z-index: -1;
  animation: woodGlow 6s ease-in-out infinite;
}

@keyframes woodGlow {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

.gospel-pentomino-board {
  width: min(80vw, 80vh);
  height: min(80vw, 80vh);
  max-width: 600px;
  max-height: 600px;
  background:
    linear-gradient(135deg, #0a0a0a, #1a1a1a, #0a0a0a),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 1px,
      rgba(255, 215, 0, 0.02) 1px,
      rgba(255, 215, 0, 0.02) 2px
    );
  border-radius: 15px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 0px;
  overflow: hidden;
  box-shadow:
    inset 0 8px 25px rgba(0, 0, 0, 0.6),
    inset 0 -8px 25px rgba(255, 215, 0, 0.05),
    inset 0 0 50px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.gospel-pentomino-piece {
  position: relative;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  border: 0.1px solid rgba(0, 0, 0, 0.05);
}

.gospel-pentomino-piece::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, transparent 30%, rgba(255, 255, 255, 0.1) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.gospel-pentomino-piece:hover::before {
  opacity: 1;
}

.gospel-pentomino-piece:hover {
  transform: scale(1.03);
  z-index: 100;
  box-shadow:
    0 0 40px rgba(255, 215, 0, 0.8),
    0 0 60px rgba(255, 215, 0, 0.4),
    inset 0 0 25px rgba(255, 255, 255, 0.25);
  filter: brightness(1.2) saturate(1.1);
}

.gospel-pentomino-piece.active {
  animation: divineSelection 2.5s ease-in-out;
  z-index: 200;
}

@keyframes divineSelection {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
  }
  25% {
    transform: scale(1.06);
    box-shadow:
      0 0 60px rgba(255, 215, 0, 1),
      0 0 100px rgba(255, 215, 0, 0.6);
  }
  50% {
    transform: scale(1.08);
    box-shadow:
      0 0 80px rgba(255, 215, 0, 1),
      0 0 120px rgba(255, 215, 0, 0.8);
  }
  75% {
    transform: scale(1.06);
    box-shadow:
      0 0 60px rgba(255, 215, 0, 1),
      0 0 100px rgba(255, 215, 0, 0.6);
  }
}

/* 색깔별 그라디언트 */
.gospel-pentomino-red {
  background:
    radial-gradient(ellipse at 30% 30%, #ff8a80 0%, #ff5252 30%, #d32f2f 70%, #b71c1c 100%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.2),
    inset 0 -2px 8px rgba(0, 0, 0, 0.3);
}
.gospel-pentomino-yellow {
  background:
    radial-gradient(ellipse at 30% 30%, #fff59d 0%, #ffeb3b 30%, #f57f17 70%, #e65100 100%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.3),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);
}
.gospel-pentomino-green {
  background:
    radial-gradient(ellipse at 30% 30%, #a5d6a7 0%, #4caf50 30%, #2e7d32 70%, #1b5e20 100%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.2),
    inset 0 -2px 8px rgba(0, 0, 0, 0.3);
}
.gospel-pentomino-black {
  background:
    radial-gradient(ellipse at 30% 30%, #616161 0%, #424242 30%, #212121 70%, #000000 100%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.1),
    inset 0 -2px 8px rgba(0, 0, 0, 0.5);
}
.gospel-pentomino-white {
  background:
    radial-gradient(ellipse at 30% 30%, #ffffff 0%, #f5f5f5 30%, #e0e0e0 70%, #bdbdbd 100%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.4),
    inset 0 -2px 8px rgba(0, 0, 0, 0.1);
}

/* 모달 스타일 */
.gospel-pentomino-modal {
  display: none;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  animation: modalFadeIn 0.5s ease;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(10px);
  }
}

.gospel-pentomino-modal-content {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  margin: 5% auto;
  padding: 40px;
  border-radius: 25px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.3),
    0 0 50px rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.3);
}

@keyframes modalSlideIn {
  from {
    transform: translateY(-100px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.gospel-pentomino-close {
  position: absolute;
  right: 25px;
  top: 25px;
  font-size: 35px;
  cursor: pointer;
  color: #999;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.gospel-pentomino-close:hover {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  transform: scale(1.1);
}

.gospel-pentomino-color-indicator {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  margin: 0 auto 25px;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  animation: indicatorGlow 2s ease-in-out infinite alternate;
}

@keyframes indicatorGlow {
  from {
    box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.2),
      inset 0 2px 10px rgba(255, 255, 255, 0.3);
  }
  to {
    box-shadow:
      0 8px 35px rgba(0, 0, 0, 0.3),
      inset 0 2px 15px rgba(255, 255, 255, 0.5);
  }
}

.gospel-pentomino-modal h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 400;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  padding-right: 50px;
}

.gospel-pentomino-speaker {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 30px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
}

.gospel-pentomino-speaker:hover {
  color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-50%) scale(1.1);
}

.gospel-pentomino-speaker.playing {
  color: #ffd700;
  animation: speakerPulse 1s ease-in-out infinite;
}

@keyframes speakerPulse {
  0%,
  100% {
    transform: translateY(-50%) scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4);
  }
  50% {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
}

.gospel-pentomino-modal p {
  line-height: 1.8;
  color: #555;
  text-align: center;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  margin-bottom: 15px;
}

.gospel-pentomino-bible-verse {
  font-style: italic;
  color: #666;
  font-size: clamp(0.9rem, 2vw, 1rem);
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .gospel-pentomino-frame {
    padding: 15px;
  }

  .gospel-pentomino-board {
    width: min(85vw, 85vh);
    height: min(85vw, 85vh);
  }

  .gospel-pentomino-modal-content {
    margin: 10% auto;
    padding: 25px;
  }

  .gospel-pentomino-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  .gospel-pentomino-subtitle {
    font-size: clamp(0.8rem, 2vw, 1rem);
  }

  .gospel-pentomino-verse {
    font-size: clamp(0.7rem, 1.8vw, 0.9rem);
  }
}

@media (max-width: 480px) {
  .gospel-pentomino-frame {
    padding: 10px;
  }

  .gospel-pentomino-board {
    width: min(90vw, 90vh);
    height: min(90vw, 90vh);
  }

  .gospel-pentomino-header {
    margin-bottom: 15px;
  }

  .gospel-pentomino-modal-content {
    margin: 15% auto;
    padding: 20px;
  }
}

/* 가로 모드 최적화 */
@media (orientation: landscape) and (max-height: 600px) {
  .gospel-pentomino-header {
    margin-bottom: 10px;
  }

  .gospel-pentomino-title {
    font-size: clamp(1.2rem, 3vw, 2rem);
  }

  .gospel-pentomino-subtitle {
    font-size: clamp(0.7rem, 1.5vw, 0.9rem);
    margin-bottom: 5px;
  }

  .gospel-pentomino-verse {
    font-size: clamp(0.6rem, 1.2vw, 0.8rem);
  }

  .gospel-pentomino-board {
    width: min(60vh, 60vw);
    height: min(60vh, 60vw);
  }
}

/* 마우스 커서 효과 */
.gospel-pentomino-piece {
  cursor:
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><radialGradient id="g"><stop offset="0%" stop-color="%23FFD700"/><stop offset="70%" stop-color="%23FFA500"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><circle cx="16" cy="16" r="12" fill="url(%23g)" opacity="0.8"/><circle cx="16" cy="16" r="6" fill="%23FFD700"/></svg>')
      16 16,
    pointer;
}

body {
  cursor:
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="%23FFD700" stroke-width="2" opacity="0.6"/><circle cx="12" cy="12" r="2" fill="%23FFD700"/></svg>')
      12 12,
    auto;
}

/* 애니메이션 키프레임 */
@keyframes sparkleFloat {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--random-x), var(--random-y)) scale(0);
    opacity: 0;
  }
}

@keyframes blessedGlow {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
