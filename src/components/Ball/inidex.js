//vector class
class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
    this.magnitude = Math.sqrt(x * x + y * y)
    this.angle = Math.atan2(y, x)
  }

  add(v) {
    this.x = this.x + v.x
    this.y = this.y + v.y
    this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y)
    this.angle = Math.atan2(this.y, this.x)
    return this
  }

  subtract(v) {
    this.x = this.x - v.x
    this.y = this.y - v.y
    this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y)
    this.angle = Math.atan2(this.y, this.x)
    return this
  }

  setAngle(angle) {
    this.angle = angle
    this.x = this.magnitude * Math.cos(angle)
    this.y = this.magnitude * Math.sin(angle)
    return this
  }

  setMagnitude(magnitude) {
    this.magnitude = magnitude
    this.x = Math.cos(this.angle) * magnitude
    this.y = Math.sin(this.angle) * magnitude
    return this
  }
}

//particle class
class Particle {
  constructor(opts) {
    this.x = opts.x || Math.random() * cW
    this.y = opts.y || Math.random() * cH
    this.radius = opts.radius || 15
    this.v = opts.v || new Vector()
    this.acc = opts.acc || new Vector()
    this.mass = opts.mass || 40
    this.color = opts.color || 320
    this.maxV = opts.maxV || 8
    this.maxA = opts.maxA || 0.5
    this.tasteTheRainbow = opts.tasteTheRainbow || false
    if (opts.trail) {
      this.trail = true
      this.trailLength = opts.trailLength || 10
      this.trajPoints = new Queue([])
    }
  }

  accelerate() {
    this.acc.magnitude = this.acc.magnitude > this.maxA ? this.acc.setMagnitude(this.maxA) : this.acc.magnitude
    this.v.add(this.acc)
  }

  isOnScreen() {
    return this.x <= cW || this.x >= 0 || this.y <= cH || this.y >= 0
  }

  update() {
    if (this.acc.magnitude) {
      this.accelerate()
    }
    if (this.trail) {
      const point = {
        x: this.x,
        y: this.y
      }
      this.trajPoints.enqueue(point)
      if (this.trajPoints.getLength() >= this.trailLength) {
        this.trajPoints.dequeue()
      }
    }
    this.v.magnitude = this.v.magnitude > this.maxV ? this.v.setMagnitude(this.maxV) : this.v.magnitude
    this.x += this.v.x
    this.y += this.v.y
    if (this.tasteTheRainbow) {
      this.color = this.color <= 360 ? ++this.color : 1
    }
  }

  render(context, trailContext = null) {
    context.beginPath()
    context.fillStyle = `hsl(${this.color}, 100%, 50%)`
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    context.fill()
    context.closePath()
    if (this.trail && trailContext) {
      const trajectory = this.trajPoints
      trailContext.beginPath()
      trailContext.strokeStyle = `hsl(${this.color}, 100%, 50%)`
      trailContext.lineWidth = 0.2
      trailContext.moveTo(trajectory.queue[0].x, trajectory.queue[0].y)
      for (let i = 1, len = trajectory.getLength(); i < len; i++) {
        trailContext.lineTo(trajectory.queue[i].x, trajectory.queue[i].y)
      }
      trailContext.stroke()
      trailContext.closePath()
    }
  }
}

class Planet extends Particle {
  gravitate(p) {
    if (Particle.prototype.isPrototypeOf(p)) {
      const d = Math.sqrt((this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y))
      const attractiveForce = (p.mass * this.mass) / (d * d)
      this.acc.setAngle(Math.atan2(p.y - this.y, p.x - this.x)).setMagnitude(attractiveForce)
    } else {
      throw new Error('The argument passed to the gravitate function must be a particle')
    }
    this.update()
  }

  gravitateStarCluster(cluster) {
    let gV = new Vector()
    for (let i = 0; i < cluster.length; i++) {
      const star = cluster[i]
      if (Particle.prototype.isPrototypeOf(star)) {
        const v = new Vector()
        const d = Math.sqrt((this.x - star.x) * (this.x - star.x) + (this.y - star.y) * (this.y - star.y))
        const attractiveForce = (star.mass * this.mass) / (d * d)
        v.setAngle(Math.atan2(star.y - this.y, star.x - this.x)).setMagnitude(attractiveForce)
        gV = gV.add(v)
      } else {
        throw new Error('The argument supplied to the gravitateStarCluster function must be an array of particles')
      }
    }
    this.acc.setAngle(gV.angle).setMagnitude(gV.magnitude)
    this.update()
  }
}

class Queue {
  constructor(array) {
    this.queue = array
  }

  getLength() {
    return this.queue.length
  }

  enqueue(element) {
    this.queue.unshift(element)
  }

  dequeue() {
    this.queue.pop()
  }

  display() {
    for (let i = 0; i < this.getLength; i++) {
      console.log(this.queue[i])
    }
  }
}

//util function to paint entire canvas of specified color
function paintCanvas(color, context) {
  const W = context.canvas.clientWidth
  const H = context.canvas.clientHeight
  context.save()
  context.fillStyle = color
  context.fillRect(0, 0, W, H)
  context.restore()
}

//util function that returns a random number in a given range
function randomInRange(min, max) {
  const result = min + Math.random() * (max - min)
  return result
}

//////////////////////////////////////
// -- THIS ANIMATION'S VARIABLES -- //
//////////////////////////////////////

//canvas
const trailCanvas = document.getElementById('trails')
const particlesCanvas = document.getElementById('particles')
const trailCtx = trailCanvas.getContext('2d')
const particleCtx = particlesCanvas.getContext('2d')

let cW = (particlesCanvas.width = trailCanvas.width = window.innerWidth)
let cH = (particlesCanvas.height = trailCanvas.height = window.innerHeight)

//animation constants
const settings = {
  STAR_MASS: 1500,
  PLANET_MASS: 20,
  PLANET_V_X: 2,
  P_TRAIL: true,
  P_MAX_VELOCITY: 8,
  P_MAX_ACC: 0.5,
  P_MIN_VELOCITY: 5,
  PARTICLE_NUM: 70,
  BOUNDS: false,
  TRAIL_LENGTH: 90,
  TRAIL_CNVS: trailCanvas,
  PARTICLE_CNVS: particlesCanvas,
  COLOR: 320,
  TRAIL_CTXT: trailCtx,
  TASTETHERAINBOW: true,
  PARTICLE_CTXT: particleCtx
}

window.addEventListener('resize', function() {
  cW = particlesCanvas.width = trailCanvas.width = window.innerWidth
  cH = particlesCanvas.height = trailCanvas.height = window.innerHeight
})

//mouse events and stuff
let mX = -1
let mY = -1
let draggingStar = false

document.addEventListener('mousemove', function(e) {
  mX = e.clientX
  mY = e.clientY
})

settings.PARTICLE_CNVS.addEventListener('click', function() {
  draggingStar = !draggingStar
})

//stars and particles
const s = []
let p = []

const star = new Particle({
  x: cW / 2,
  y: cH / 2,
  radius: 15,
  color: settings.COLOR,
  tasteTheRainbow: settings.TASTETHERAINBOW,
  mass: settings.STAR_MASS
})

for (let i = 0; i < settings.PARTICLE_NUM; i++) {
  const planet = new Planet({
    x: Math.random() * cW,
    y: Math.random() * cH,
    radius: 2,
    mass: settings.PLANET_MASS,
    trail: settings.P_TRAIL,
    trailLength: settings.TRAIL_LENGTH,
    color: settings.COLOR,
    maxV: settings.P_MAX_VELOCITY,
    maxA: settings.P_MAX_ACC,
    tasteTheRainbow: settings.TASTETHERAINBOW,
    v: new Vector(Math.random() < 0.5 ? -settings.P_MIN_VELOCITY : settings.P_MIN_VELOCITY, 0)
  })

  p.push(planet)
}

//animation function
function animate() {
  settings.PARTICLE_CTXT.clearRect(0, 0, cW, cH)

  settings.TRAIL_CTXT.clearRect(0, 0, cW, cH)
  paintCanvas('black', settings.TRAIL_CTXT)

  star.update()
  star.render(settings.PARTICLE_CTXT)

  for (let i = 0; i < p.length; i++) {
    p[i].gravitate(star)
    if (settings.BOUNDS) {
      if (p[i].x > cW) {
        p[i].x = cW
      }
      if (p[i].x < 0) {
        p[i].x = 0
      }
      if (p[i].y > cH) {
        p[i].y = cH
      }
      if (p[i].y < 0) {
        p[i].y = 0
      }
    }
    if (p[i].isOnScreen()) {
      p[i].render(settings.PARTICLE_CTXT, settings.TRAIL_CTXT)
    }
  }

  if (draggingStar) {
    star.x += (mX - star.x) * 0.1
    star.y += (mY - star.y) * 0.1
  }

  requestAnimationFrame(animate)
}

//start loop!
animate()

//instructions panel script
const instructionsPanel = document.querySelector('#instructions')
const closeButton = document.querySelector('#instructions > i')

closeButton.addEventListener('click', function() {
  instructionsPanel.classList.add('hidden')
})

//datgui thangs
const gui = new dat.GUI()
gui
  .add(settings, 'STAR_MASS', 500, 10000)
  .name('star mass')
  .onFinishChange(function() {
    star.mass = settings.STAR_MASS
  })
gui
  .add(settings, 'P_TRAIL')
  .name('particle trail')
  .onFinishChange(function() {
    for (let i = 0; i < settings.PARTICLE_NUM; i++) {
      p[i].trail = settings.P_TRAIL
      p[i].trajPoints = new Queue([])
    }
  })
gui
  .add(settings, 'P_MAX_VELOCITY', 4, 14)
  .name('max velocity')
  .onFinishChange(function() {
    for (let i = 0; i < settings.PARTICLE_NUM; i++) {
      p[i].maxV = settings.P_MAX_VELOCITY
    }
  })
gui
  .add(settings, 'P_MAX_ACC', 0.2, 2)
  .name('max acceleration')
  .onFinishChange(function() {
    for (let i = 0; i < settings.PARTICLE_NUM; i++) {
      p[i].maxA = settings.P_MAX_ACC
    }
  })
gui
  .add(settings, 'PARTICLE_NUM', 1, 250)
  .name('particles number')
  .onFinishChange(function() {
    p = []
    settings.TRAIL_CTXT.clearRect(0, 0, cW, cH)
    for (let i = 0; i < settings.PARTICLE_NUM; i++) {
      const planet = new Planet({
        x: Math.random() * cW,
        y: Math.random() * cH,
        radius: 2,
        mass: settings.PLANET_MASS,
        trail: settings.P_TRAIL,
        trailLength: settings.TRAIL_LENGTH,
        color: settings.COLOR,
        maxV: settings.P_MAX_VELOCITY,
        maxA: settings.P_MAX_ACC,
        tasteTheRainbow: settings.TASTETHERAINBOW,
        v: new Vector(Math.random() < 0.5 ? -settings.P_MIN_VELOCITY : settings.P_MIN_VELOCITY, 0)
      })
      p.push(planet)
    }
    star.color = settings.COLOR
  })
gui.add(settings, 'BOUNDS').name('bounds')
gui
  .add(settings, 'TRAIL_LENGTH', 10, 200)
  .name('trail length')
  .onFinishChange(function() {
    settings.TRAIL_CTXT.clearRect(0, 0, cW, cH)
    for (let i = 0; i < settings.PARTICLE_NUM; i++) {
      p[i].trajPoints = new Queue([])
      p[i].trailLength = settings.TRAIL_LENGTH
    }
  })

//for debugging without printing stuff 1000000000 times in the console
//window.setInterval(function(){ console.log(); }, 2000);
