import p5 from 'p5'
import { largeInput } from './input'

const width = 1200
const height = 800

type grid = Map<string, number>


const parse = (s:string) => s
    .trim()
    .split('\n')
    .map(s =>
      s
        .split('->')
        .map(s =>
          s
            .split(',')
            .map(s => parseInt(s.trim()))))

const makeGrid = (lines: number[][][]) => {
  const g: grid = new Map()
  lines.forEach(line => {
    let px = line[0][0]
    let py = line[0][1]
    line.forEach(([x, y]) => {
      if (x === px && y === py) {
        return
      } else if (x === px) {
        for (let i = Math.min(y, py); i <= Math.max(y, py); i++) {
          g.set([x, i].join(','), 1)
        }
      } else if (y === py) {
        for (let i = Math.min(x, px); i <= Math.max(x, px); i++) {
          g.set([i, y].join(','), 1)
        }
      }
      px = x
      py = y
    })
  })
  return g
}

const s = async (p:p5) => {
  const lines = parse(largeInput)
  console.log(lines)
  const g: grid = makeGrid(lines)
  let pending: [number, number][] = []
  const sands: [number, number][] = []

  p.setup = function() {
    p.createCanvas(width, height)
    //p.frameRate(5)
  }

  let scl = 2.3
  p.draw = function() {
    if (p.frameCount % 5 == 0) {
      pending.push([500, 0])
    }

    pending = pending.map(([x, y]) => {
      if (!g.has([x, y+1].join(','))) {
        y++
      } else if (!g.has([x-1, y+1].join(','))) {
        x--
        y++
      } else if (!g.has([x+1, y+1].join(','))) {
        x++
        y++
      } else {
        g.set([x, y].join(','), 2)
        sands.push([x, y])
        x = -1
        y = -1
      }
      const out: [number, number] = [x, y]
      return out
    }).filter(([x, y]) => x !== -1 && y !== -1)


    p.background(200)
    p.fill(0)
    p.push()
    p.translate(-1600, 0)
    p.scale(scl)
    p.strokeWeight(0)
    Array.from(g.keys()).forEach(s => {
      const [x,y] = s.split(',').map(s => parseInt(s))
      if (g.get([x, y].join(',')) === 1) {
        p.fill(p.color('black'))
      } else {
        p.fill(p.color('blue'))
      }
      p.rect(x*2, y*2, 2, 2)
    })
    pending.forEach(([x, y]) => {
      p.fill(p.color('blue'))
      p.circle(x*2+1, y*2+1, 2)
    })
    p.pop()
  }
}

new p5(s)