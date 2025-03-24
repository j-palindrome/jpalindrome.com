import { CanvasForm, Group, Pt, PtLikeIterable } from 'pts'

export class AsemicGroup extends Group {
  at(i: number) {
    return super.at(i) as AsemicPt
  }

  static fromArray(pts: PtLikeIterable) {
    const newGroup = new AsemicGroup()
    for (let pt of pts) {
      newGroup.push(new AsemicPt(pt))
    }
    return newGroup
  }

  constructor(...pts: AsemicPt[]) {
    super(...pts)
  }
}

export class AsemicPt extends Pt {
  lerp(pt: Pt, amount: number) {
    return this.add(pt.$subtract(this).multiply(amount))
  }
  $lerp(pt: Pt, amount: number) {
    return this.$add(pt.$subtract(this).multiply(amount))
  }
}

export class AsemicForm {
  ctx: OffscreenCanvasRenderingContext2D
  canvas: OffscreenCanvas

  bezier(points: AsemicGroup) {
    this.ctx.strokeStyle = 'white'
    this.ctx.lineWidth = 10
    points.scale([this.ctx.canvas.width, this.ctx.canvas.height])
    this.ctx.beginPath()

    this.ctx.moveTo(points[0].x, points[0].y)
    if (points.length == 2) {
      this.ctx.lineTo(points[1].x, points[1].y)
    } else {
      for (let i = 1; i < points.length - 2; i++) {
        const endPoint = points.at(i).$lerp(points.at(i + 1), 0.5)
        this.ctx.quadraticCurveTo(
          points[i].x,
          points[i].y,
          endPoint.x,
          endPoint.y,
        )
      }
      this.ctx.quadraticCurveTo(
        points[points.length - 2].x,
        points[points.length - 2].y,
        points[points.length - 1].x,
        points[points.length - 1].y,
      )
    }
    this.ctx.stroke()
  }

  constructor() {
    this.canvas = new OffscreenCanvas(1080, 1080)
    this.ctx = this.canvas.getContext('2d')!
  }
}
