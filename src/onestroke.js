import './lib/pixi.min'
import './lib/utils'

export default class OneStroke {
    constructor(config) {
        let { lineColor, vertexColor, strokeColor, activeVertexColor, lines } = config
        this.app = new PIXI.Application(
			{
				width: 375, 
				height: 603, 
				antialias: true, 
				transparent: true
			}
		)
        this.view = document.getElementById('onestroke')
        this.view.appendChild(this.app.view)
        this.stage = this.app.stage
        this.lines = []
        this.nodes = []
        this.validNodes = []
        this.baseLines = []
        this.baseNodes = []
        this.lineColor = lineColor
        this.vertexColor = vertexColor
        this.strokeColor = strokeColor
        this.activeVertexColor = activeVertexColor
        this.lineWidth = 10
        this.vertexRadius = 9
        this.touchRadius = 15
        this.currNode = null
        this.currStroke = null
        this.finger = {}

        this.initStroke(lines)
        this.initBoard()
        this.getValidNodes()

        this.touchstart = 'touchstart' || 'mousedown'
        this.touchmove = 'touchmove' || 'mousemove'
        this.touchend = 'touchend' || 'mouseup'
        this.touchstartHandle = this.touchstartHandle.bind(this)
        this.touchmoveHandle = this.touchmoveHandle.bind(this)
        this.touchendHandle = this.touchendHandle.bind(this)
        this.view.addEventListener(this.touchstart, this.touchstartHandle)
        this.view.addEventListener(this.touchmove, this.touchmoveHandle)
        this.view.addEventListener(this.touchend, this.touchendHandle)
    }

    initStroke(lines) {
        for (let i = 0, l = lines.length; i < l; i++) {
            let { x1, y1, x2, y2 } = lines[i]
            this.lines.push({
                x1: x1 / 2,
                y1: y1 / 2,
                x2: x2 / 2,
                y2: y2 / 2
            })
            if (!this.checkAndGetNode(x1 / 2, y1 / 2)) {
                this.nodes.push({
                    x: x1 / 2,
                    y: y1 / 2,
                    validNodes: []
                })
            }
            if (!this.checkAndGetNode(x2 / 2, y2 / 2)) {
                this.nodes.push({
                    x: x2 / 2,
                    y: y2 / 2,
                    validNodes: []
                })
            }
        }
    }

    initBoard() {
        this.baseLines = [this.lines.map(({ x1, x2, y1, y2 }) => {
            let line = new PIXI.Graphics()
                .lineStyle(this.lineWidth, this.lineColor, 1)
                .moveTo(x1, y1)
                .lineTo(x2, y2)
                .closePath()
            this.stage.addChild(line)
            return line
        })]
        this.baseNodes = this.nodes.map(({ x, y }) => {
            let node = new PIXI.Graphics()
                .beginFill(this.vertexColor, 1)
                .drawCircle(0, 0, this.vertexRadius)
            node.x = x
            node.y = y
            this.stage.addChild(node)
            return node
        })
        this.validNodes = this.nodes
    }

    getValidNodes() {
        this.nodes.forEach((node) => {
            this.lines.forEach((line) => {
                if (line.x1 === node.x && line.y1 === node.y && this.checkAndGetNode(line.x2, line.y2)) {
                    node.validNodes.push(this.checkAndGetNode(line.x2, line.y2))
                }
                if (line.x2 === node.x && line.y2 === node.y && this.checkAndGetNode(line.x1, line.y1)) {
                    node.validNodes.push(this.checkAndGetNode(line.x1, line.y1))
                }
            })
        })
    }

    checkAndGetNode(x, y) {
        if (this.nodes.length) {
            for (let i = 0; i < this.nodes.length; i++){
                if (this.nodes[i].x === x && this.nodes[i].y === y) {
                    return this.nodes[i]
                }
            }
        }
        return false
    }

    touchstartHandle(e) {
        if (this.touchstart === 'touchstart') {
            var {pageX: x, pageY: y} = e.touches[0]
        } else {
            var {clientX: x, clientY: y} = e
        }
        this.finger = { x, y }
        if (this.currStroke) {
            this.drawLine()
            if (this.check(x, y)) {
                this.setCurrNode(this.check(x, y))
            }
        } else {
            if (this.check(x, y)) {
                this.setCurrNode(this.check(x, y))
            }
        }
    }

    touchmoveHandle(e) {
        if (this.touchstart === 'touchstart') {
            var {pageX: x, pageY: y} = e.touches[0]
        } else {
            var {clientX: x, clientY: y} = e
        }
        this.finger = { x, y }
        if (this.currStroke || this.currNode) {
            this.drawLine()
            if (this.check(x, y)) {
                this.setCurrNode(this.check(x, y))
            }
        }
    }

    touchendHandle() {
        if (!this.currStroke) {
            this.currNode = null
        }
    }

    check(x, y) {
        let l = this.validNodes.length
        if (l) {
            for (let i = 0; i < l; i++){
                if (Math.pow(x - this.validNodes[i].x,2) + Math.pow(y - this.validNodes[i].y,2) <= Math.pow(this.touchRadius,2)) {
                    return this.validNodes[i]
                }
            }
        }
        return false
    }

    drawLine() {
        let { x, y } = this.finger
        let points = this.currStroke.graphicsData[0].shape.points
        points[2] = x
        points[3] = y
        console.log(points)
    }

    setCurrNode(curr) {
        let { x, y } = this.currNode = curr
        this.validNodes = this.currNode.validNodes
        let node = new PIXI.Graphics()
            .beginFill(this.activeVertexColor, 1)
            .drawCircle(0, 0, this.vertexRadius)
        node.x = x
        node.y = y
        this.stage.addChild(node)

        this.currStroke = new PIXI.Graphics()
            .lineStyle(this.lineWidth, this.strokeColor, 1)
            .moveTo(x, y)
            .lineTo(x, y)
            .closePath()
        this.stage.addChild(this.currStroke)
        this.stage.setChildIndex(this.currStroke, this.baseLines.length)
    }
}

