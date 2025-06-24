<template lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>복음 펜토미노 - 하나님의 사랑</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
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
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-x: hidden;
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
        z-index: 10;
        position: relative;
      }

      .gospel-pentomino-header {
        text-align: center;
        margin-bottom: 50px;
      }

      .gospel-pentomino-title {
        font-size: clamp(3rem, 6vw, 5rem);
        color: #ffd700;
        text-shadow:
          0 0 15px rgba(255, 215, 0, 0.8),
          0 0 30px rgba(255, 215, 0, 0.6),
          0 0 45px rgba(255, 215, 0, 0.4),
          0 0 60px rgba(255, 215, 0, 0.2);
        margin-bottom: 20px;
        animation: holyGlow 5s ease-in-out infinite alternate;
        font-weight: 200;
        letter-spacing: 3px;
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
        font-size: clamp(1.2rem, 3vw, 1.6rem);
        color: rgba(255, 255, 255, 0.95);
        text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
        margin-bottom: 15px;
        font-weight: 200;
        letter-spacing: 1px;
      }

      .gospel-pentomino-verse {
        font-size: clamp(1rem, 2.2vw, 1.3rem);
        color: rgba(255, 215, 0, 0.9);
        font-style: italic;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
        font-weight: 300;
        letter-spacing: 0.5px;
      }

      .gospel-pentomino-frame {
        position: relative;
        padding: 35px;
        background:
          linear-gradient(145deg, #2c2c2c, #1a1a1a),
          linear-gradient(
            45deg,
            rgba(255, 215, 0, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 215, 0, 0.1) 100%
          );
        border-radius: 30px;
        box-shadow:
          0 25px 80px rgba(0, 0, 0, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 -1px 0 rgba(0, 0, 0, 0.3),
          0 0 60px rgba(255, 215, 0, 0.15);
        position: relative;
        border: 1px solid rgba(255, 215, 0, 0.2);
      }

      .gospel-pentomino-frame::before {
        content: '';
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        border: 2px solid transparent;
        border-radius: 20px;
        background: linear-gradient(
            45deg,
            rgba(255, 215, 0, 0.3),
            rgba(255, 255, 255, 0.1),
            rgba(255, 215, 0, 0.3)
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
        border-radius: 32px;
        background: linear-gradient(
          45deg,
          rgba(255, 215, 0, 0.4) 0%,
          rgba(255, 255, 255, 0.2) 25%,
          rgba(255, 215, 0, 0.4) 50%,
          rgba(255, 255, 255, 0.2) 75%,
          rgba(255, 215, 0, 0.4) 100%
        );
        z-index: -1;
        animation: luxuryGlow 6s ease-in-out infinite;
      }

      @keyframes luxuryGlow {
        0%,
        100% {
          opacity: 0.3;
        }
        50% {
          opacity: 0.7;
        }
      }

      .gospel-pentomino-board {
        width: clamp(400px, 70vw, 800px);
        height: clamp(320px, 56vw, 640px);
        background:
          linear-gradient(135deg, #0a0a0a, #1a1a1a, #0a0a0a),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 1px,
            rgba(255, 215, 0, 0.02) 1px,
            rgba(255, 215, 0, 0.02) 2px
          );
        border-radius: 20px;
        position: relative;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(8, 1fr);
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
        background: radial-gradient(
          circle at center,
          transparent 30%,
          rgba(255, 255, 255, 0.1) 70%
        );
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
        margin: 10% auto;
        padding: 40px;
        border-radius: 25px;
        width: 90%;
        max-width: 600px;
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
        width: 100px;
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
          padding: 20px;
        }

        .gospel-pentomino-modal-content {
          margin: 20% auto;
          padding: 30px;
        }
      }

      @media (max-width: 480px) {
        .gospel-pentomino-frame {
          padding: 15px;
        }

        .gospel-pentomino-modal-content {
          margin: 25% auto;
          padding: 25px;
        }
      }

      /* 전체화면 최적화 */
      @media (min-width: 1200px) {
        .gospel-pentomino-board {
          width: 80vw;
          height: 64vw;
          max-width: 1000px;
          max-height: 800px;
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
  </head>
  <body>
    <!-- 사용 예제 -->
    <div id="app"></div>

    <script>
      /**
       * 복음 펜토미노 컴포넌트 클래스
       * 재사용 가능한 복음 퍼즐 컴포넌트
       */
      class GospelPentomino {
        constructor(containerId, options = {}) {
          this.containerId = containerId
          this.container = document.getElementById(containerId)
          this.options = {
            title: options.title || '복음 펜토미노',
            subtitle: options.subtitle || '하나님의 사랑을 담은 퍼즐',
            verse:
              options.verse ||
              '"하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니" - 요한복음 3:16',
            width: options.width || 'clamp(400px, 70vw, 800px)',
            height: options.height || 'clamp(320px, 56vw, 640px)',
            ...options,
          }

          this.selectedColor = null
          this.puzzlePattern = [
            [
              'white',
              'white',
              'black',
              'yellow',
              'yellow',
              'yellow',
              'yellow',
              'black',
              'black',
              'black',
            ],
            ['red', 'red', 'black', 'yellow', 'white', 'white', 'white', 'green', 'green', 'black'],
            ['red', 'red', 'red', 'red', 'white', 'green', 'green', 'green', 'green', 'green'],
            ['red', 'red', 'red', 'white', 'white', 'green', 'black', 'black', 'yellow', 'yellow'],
            [
              'white',
              'white',
              'white',
              'white',
              'black',
              'black',
              'black',
              'yellow',
              'yellow',
              'yellow',
            ],
            ['red', 'red', 'red', 'black', 'black', 'green', 'green', 'green', 'yellow', 'white'],
            [
              'red',
              'white',
              'white',
              'white',
              'green',
              'green',
              'yellow',
              'yellow',
              'yellow',
              'white',
            ],
            ['red', 'red', 'black', 'black', 'black', 'green', 'green', 'white', 'white', 'white'],
          ]

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
              text: '초록색은 그리스도 안에서 얻는 새 생명과 계속되는 영적 성장을 나타냅니다. 하나님의 말씀으로 자라가는 믿음을 상징합니다.',
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
          this.render()
          this.setupEventListeners()
          this.removeSameColorBorders()
        }

        render() {
          this.container.innerHTML = `
                    <div class="gospel-pentomino-container">
                        <div class="gospel-pentomino-header">
                            <h1 class="gospel-pentomino-title">${this.options.title}</h1>
                            <div class="gospel-pentomino-subtitle">${this.options.subtitle}</div>
                            <div class="gospel-pentomino-verse">${this.options.verse}</div>
                        </div>

                        <div class="gospel-pentomino-frame">
                            <div class="gospel-pentomino-board" id="${this.containerId}-board" style="width: ${this.options.width}; height: ${this.options.height}">
                                ${this.createPuzzleBoard()}
                            </div>
                        </div>
                    </div>

                    <!-- 모달 다이얼로그 -->
                    <div id="${this.containerId}-modal" class="gospel-pentomino-modal">
                        <div class="gospel-pentomino-modal-content">
                            <span class="gospel-pentomino-close">&times;</span>
                            <div class="gospel-pentomino-color-indicator" id="${this.containerId}-colorIndicator"></div>
                            <h2 id="${this.containerId}-modalTitle"></h2>
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

        setupEventListeners() {
          // 조각 클릭 이벤트
          const pieces = this.container.querySelectorAll('.gospel-pentomino-piece')
          pieces.forEach((piece) => {
            piece.addEventListener('click', (e) => this.handlePieceClick(e))
            piece.addEventListener('mouseenter', (e) => this.createSparkles(e.target))
          })

          // 모달 관련 이벤트
          const modal = document.getElementById(`${this.containerId}-modal`)
          const closeBtn = this.container.querySelector('.gospel-pentomino-close')

          closeBtn.addEventListener('click', () => this.closeModal())

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
          this.createBlessedLight(element)
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
            title.textContent = message.title
            text.textContent = message.text
            verse.textContent = message.verse
            modal.style.display = 'block'
          }
        }

        closeModal() {
          const modal = document.getElementById(`${this.containerId}-modal`)
          modal.style.display = 'none'

          // 선택 효과 제거
          this.container.querySelectorAll('.gospel-pentomino-piece').forEach((piece) => {
            piece.classList.remove('active')
          })

          this.selectedColor = null
        }

        removeSameColorBorders() {
          this.puzzlePattern.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
              const currentPiece = this.container.querySelector(
                `[data-row="${rowIndex}"][data-col="${colIndex}"]`,
              )

              // 오른쪽 조각 체크
              if (colIndex < row.length - 1) {
                const rightColor = this.puzzlePattern[rowIndex][colIndex + 1]
                if (color === rightColor) {
                  currentPiece.style.borderRight = 'none'
                  const rightPiece = this.container.querySelector(
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
                  const bottomPiece = this.container.querySelector(
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
          light.style.background =
            'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)'
          light.style.borderRadius = '10px'
          light.style.pointerEvents = 'none'
          light.style.zIndex = '9998'
          light.style.animation = 'blessedGlow 2s ease-out forwards'

          document.body.appendChild(light)

          setTimeout(() => {
            light.remove()
          }, 2000)
        }

        // 공개 메서드들
        destroy() {
          this.container.innerHTML = ''
        }

        updateOptions(newOptions) {
          this.options = { ...this.options, ...newOptions }
          this.render()
          this.setupEventListeners()
          this.removeSameColorBorders()
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

        // 커스터마이징 예제
        /*
            const pentomino2 = new GospelPentomino('app', {
                title: '맞춤 제목',
                subtitle: '맞춤 부제목',
                verse: '맞춤 성경구절',
                width: '600px',
                height: '480px'
            });
            */
      })
    </script>
  </body>
</template>
