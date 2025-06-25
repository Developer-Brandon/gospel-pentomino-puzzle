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
 * 부가적인 class들
 * **/
import { AudioManager } from './assets/js/AudioManager.js'
import { EffectManager } from './assets/js/EffectManager.js'
import { PuzzleRenderer } from './assets/js/PuzzleRenderer.js'

/**
 * 메인 복음 펜토미노 컴포넌트 클래스 - 전체 렌더링 및 제어 담당
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
    this.isMobileChrome = /Android.*Chrome/.test(navigator.userAgent)

    // 모듈 인스턴스 생성
    this.audioManager = new AudioManager()
    this.effectManager = new EffectManager()
    this.puzzleRenderer = new PuzzleRenderer(containerId, this.options)

    this.colorMessages = {
      red: {
        title: '예수님의 사랑과 희생',
        text: '빨간색은 예수 그리스도께서 우리 죄를 위해 십자가에서 흘리신 보혈을 상징합니다. 하나님의 무한한 사랑이 이 색깔 안에 담겨있습니다.',
        verse:
          '"그가 찔림은 우리의 허물 때문이요 그가 상함은 우리의 죄악 때문이라 그가 징계를 받으므로 우리는 평화를 누리고 그가 채찍에 맞으므로 우리는 나음을 받았도다" - 이사야 53:5',
      },
      black: {
        title: '죄와 어둠에서 벗어남',
        text: '검은색은 우리 모두가 가지고 있던 죄와 영적 어둠을 나타냅니다. 하지만 예수님의 빛이 이 어둠을 이기셨습니다.',
        verse:
          '"모든 사람이 죄를 범하였으매 하나님의 영광에 이르지 못하더니 그리스도 예수 안에 있는 속량으로 말미암아 하나님의 은혜로 값없이 의롭다 하심을 얻은 자 되었느니라" - 로마서 3:23-24',
      },
      yellow: {
        title: '천국과 하나님의 영광',
        text: '노란색(금색)은 하나님의 영광과 천국의 찬란함을 상징합니다. 영원한 생명과 하나님의 임재를 나타냅니다.',
        verse:
          '"그 성은 해나 달의 비침이 쓸 데 없으니 이는 하나님의 영광이 비치고 어린 양이 그 등불이 되심이라" - 요한계시록 21:23',
      },
      green: {
        title: '새 생명과 영적 성장',
        text: '초록색은 그리스트 안에서 얻는 새 생명과 계속되는 영적 성장을 나타냅니다. 하나님의 말씀으로 자라가는 믿음을 상징합니다.',
        verse:
          '"그런즉 누구든지 그리스도 안에 있으면 새로운 피조물이라 이전 것은 지나갔으니 보라 새 것이 되었도다" - 고린도후서 5:17',
      },
      white: {
        title: '순결과 구원의 완성',
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

      // 모바일 크롬 최적화
      if (this.isMobileChrome) {
        modal.style.animation = 'none'
        modal.style.display = 'block'

        requestAnimationFrame(() => {
          const content = modal.querySelector('.gospel-pentomino-modal-content')
          content.style.animation = 'mobileModalFadeIn 0.2s ease-out'
        })
      } else {
        modal.style.display = 'block'
      }

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
  new GospelPentomino('app')

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

<style type="text/scss">
@import './assets/scss/main.scss';
@import './assets/scss/keyframes.scss';
@import './assets/scss/sys-util.scss';

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

.gospel-pentomino-subtitle {
  font-size: clamp(1.5rem, 2.5vw, 1.5rem);
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
  margin-top: 8px;
  font-weight: 200;
  letter-spacing: 1px;
}

.gospel-pentomino-verse {
  font-size: clamp(1rem, 2.3vw, 1.3rem);
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
  /* 하드웨어 가속 적용 */
  will-change: transform;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
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
  transform: scale(1.03) translateZ(0);
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

/* 모달 스타일 - 안드로이드 크롬 최적화 */
.gospel-pentomino-modal {
  display: none;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* backdrop-filter 제거하고 불투명도 증가 */
  background: rgba(0, 0, 0, 0.9);
  animation: modalFadeIn 0.3s ease;
  /* 하드웨어 가속 적용 */
  will-change: opacity;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
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
  animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.3),
    0 0 50px rgba(255, 215, 0, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.3);
  /* 하드웨어 가속 적용 */
  will-change: transform, opacity;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
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
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin: 0 auto 25px;
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.2),
    inset 0 2px 10px rgba(255, 255, 255, 0.3);
  animation: indicatorGlow 2s ease-in-out infinite alternate;
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
}

.gospel-pentomino-modal h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: clamp(2rem, 4vw, 2rem);
  font-weight: 400;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  padding-right: 50px;
  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 1vw, 1.3rem);
  }
}

.gospel-pentomino-modal p {
  line-height: 1.8;
  color: #555;
  text-align: center;
  font-size: clamp(1.7rem, 2.5vw, 1.5rem);
  margin-bottom: 15px;
  @media (max-width: 480px) {
    font-size: clamp(1.2rem, 1.5vw, 1.2rem);
  }
}

.gospel-pentomino-bible-verse {
  font-style: italic;
  color: #666;
  font-size: clamp(1.7rem, 2.5vw, 1.5rem);
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  @media (max-width: 480px) {
    font-size: clamp(1rem, 1.5vw, 1rem);
  }
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

/* 모바일 전용 애니메이션 */
@keyframes mobileModalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95) translate3d(0, 0, 0);
  }
  to {
    opacity: 1;
    transform: scale(1) translate3d(0, 0, 0);
  }
}

/* 단순화된 애니메이션 */
@keyframes modalFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translate3d(0, -20px, 0);
  }
  to {
    opacity: 1;
    transform: scale(1) translate3d(0, 0, 0);
  }
}

/* 모바일 최적화 - 안드로이드 크롬 전용 */
@media (max-width: 768px) and (-webkit-min-device-pixel-ratio: 1) {
  .gospel-pentomino-modal {
    /* 모바일에서는 더 간단한 배경 */
    background: rgba(0, 0, 0, 0.95);
    animation: none;
  }

  .gospel-pentomino-modal-content {
    /* 모바일에서는 애니메이션 단순화 */
    animation: mobileModalFadeIn 0.2s ease-out;
    transform: translate3d(0, 0, 0);
  }

  /* 모바일에서는 그라디언트 단순화 */
  .gospel-pentomino-piece {
    transition: transform 0.2s ease;
  }

  .gospel-pentomino-piece:hover {
    transform: scale(1.02) translateZ(0);
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
</style>
