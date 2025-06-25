/**
 * 퍼즐 렌더링 클래스 - 퍼즐 보드 렌더링 담당
 */
export class PuzzleRenderer {
  constructor(containerId, options) {
    this.containerId = containerId
    this.options = options
    this.puzzlePattern = [
      ['red', 'red', 'red', 'red', 'red', 'green'],
      ['red', 'yellow', 'red', 'white', 'green', 'green'],
      ['yellow', 'yellow', 'yellow', 'white', 'green', 'green'],
      ['white', 'yellow', 'white', 'white', 'green', 'green'],
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
