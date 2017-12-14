import './lib/pixi.min'

export default class OneStroke {
    constructor(config) {
        let { lineColor, vertexColor, strokeColor, activeVertexColor, lines } = config
        this.app = PIXI.autoDetectRenderer(375,603,
            {
				transparent: true
			}
        )
        this.view = document.getElementById('onestroke')
        this.view.appendChild(this.app.view)
        this.stage = new PIXI.Container()
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
        this.render()

        this.touchstart = 'touchstart' || 'mousedown'
        this.touchmove = 'touchmove' || 'mousemove'
        this.touchend = 'touchend' || 'mouseup'
        this.touchstartHandle = this.touchstartHandle.bind(this)
        this.touchmoveHandle = this.touchmoveHandle.bind(this)
        // this.touchendHandle = this.touchendHandle.bind(this)
        this.view.addEventListener(this.touchstart, this.touchstartHandle)
        this.view.addEventListener(this.touchmove, this.touchmoveHandle)
        // this.view.addEventListener(this.touchend, this.touchendHandle)
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
        this.baseLines = this.lines.map(({ x1, x2, y1, y2 }) => {
            let line = new PIXI.Graphics()
                .lineStyle(this.lineWidth, this.lineColor, 1)
                .moveTo(x1, y1)
                .lineTo(x2, y2)
                .closePath()
            this.stage.addChild(line)
            return line
        })
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

    render() {
		this.app.render(this.stage)
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
        } else {
            if (this.check(x, y)) {
                this.currNode = this.check(x, y)
                console.log(this.check(x, y))
            }
        }
    }

    touchmoveHandle(e) {
        
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
}

