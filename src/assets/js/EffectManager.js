/**
 * 효과 관리 클래스 - 시각 효과 담당
 */
export class EffectManager {
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
