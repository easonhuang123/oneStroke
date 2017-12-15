!function(t){function e(s){if(i[s])return i[s].exports;var o=i[s]={i:s,l:!1,exports:{}};return t[s].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var i={};e.m=t,e.c=i,e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=0)}([function(t,e,i){t.exports=i(1)},function(t,e,i){"use strict";var s=i(2),o=function(t){return t&&t.__esModule?t:{default:t}}(s),r={lineColor:14869218,vertexColor:9483087,strokeColor:4478500,activeVertexColor:9483087,lines:[{x1:375,y1:366,x2:200,y2:916},{x1:200,y1:916,x2:664,y2:576},{x1:664,y1:576,x2:88,y2:576},{x1:88,y1:576,x2:556,y2:916},{x1:556,y1:916,x2:375,y2:366}]};new o.default(r)},function(t,e,i){"use strict";function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}e.__esModule=!0;var o=function(){function t(e){s(this,t);var i=e.lineColor,o=e.vertexColor,r=e.strokeColor,n=e.activeVertexColor,h=e.lines;this.app=new PIXI.appication(375,603,{transparent:!0}),this.view=document.getElementById("onestroke"),this.view.appendChild(this.app.view),this.stage=this.app.stage,this.lines=[],this.nodes=[],this.validNodes=[],this.baseLines=[],this.baseNodes=[],this.lineColor=i,this.vertexColor=o,this.strokeColor=r,this.activeVertexColor=n,this.lineWidth=10,this.vertexRadius=9,this.touchRadius=15,this.currNode=null,this.currStroke=null,this.finger={},this.initStroke(h),this.initBoard(),this.getValidNodes(),this.render(),this.touchstart="touchstart",this.touchmove="touchmove",this.touchend="touchend",this.touchstartHandle=this.touchstartHandle.bind(this),this.touchmoveHandle=this.touchmoveHandle.bind(this),this.touchendHandle=this.touchendHandle.bind(this),this.view.addEventListener(this.touchstart,this.touchstartHandle),this.view.addEventListener(this.touchmove,this.touchmoveHandle),this.view.addEventListener(this.touchend,this.touchendHandle)}return t.prototype.initStroke=function(t){for(var e=0,i=t.length;e<i;e++){var s=t[e],o=s.x1,r=s.y1,n=s.x2,h=s.y2;this.lines.push({x1:o/2,y1:r/2,x2:n/2,y2:h/2}),this.checkAndGetNode(o/2,r/2)||this.nodes.push({x:o/2,y:r/2,validNodes:[]}),this.checkAndGetNode(n/2,h/2)||this.nodes.push({x:n/2,y:h/2,validNodes:[]})}},t.prototype.initBoard=function(){var t=this;this.baseLines=[this.lines.map(function(e){var i=e.x1,s=e.x2,o=e.y1,r=e.y2,n=(new PIXI.Graphics).lineStyle(t.lineWidth,t.lineColor,1).moveTo(i,o).lineTo(s,r).closePath();return t.stage.addChild(n),n})],this.baseNodes=this.nodes.map(function(e){var i=e.x,s=e.y,o=(new PIXI.Graphics).beginFill(t.vertexColor,1).drawCircle(0,0,t.vertexRadius);return o.x=i,o.y=s,t.stage.addChild(o),o}),this.validNodes=this.nodes},t.prototype.getValidNodes=function(){var t=this;this.nodes.forEach(function(e){t.lines.forEach(function(i){i.x1===e.x&&i.y1===e.y&&t.checkAndGetNode(i.x2,i.y2)&&e.validNodes.push(t.checkAndGetNode(i.x2,i.y2)),i.x2===e.x&&i.y2===e.y&&t.checkAndGetNode(i.x1,i.y1)&&e.validNodes.push(t.checkAndGetNode(i.x1,i.y1))})})},t.prototype.checkAndGetNode=function(t,e){if(this.nodes.length)for(var i=0;i<this.nodes.length;i++)if(this.nodes[i].x===t&&this.nodes[i].y===e)return this.nodes[i];return!1},t.prototype.render=function(){this.app.render(this.stage)},t.prototype.touchstartHandle=function(t){if("touchstart"===this.touchstart)var e=t.touches[0],i=e.pageX,s=e.pageY;else var i=t.clientX,s=t.clientY;this.finger={x:i,y:s},this.currStroke?(this.drawLine(),this.check(i,s)&&this.setCurrNode(this.check(i,s))):this.check(i,s)&&this.setCurrNode(this.check(i,s))},t.prototype.touchmoveHandle=function(t){if("touchstart"===this.touchstart)var e=t.touches[0],i=e.pageX,s=e.pageY;else var i=t.clientX,s=t.clientY;this.finger={x:i,y:s},(this.currStroke||this.currNode)&&(this.drawLine(),this.check(i,s)&&this.setCurrNode(this.check(i,s)))},t.prototype.touchendHandle=function(){this.currStroke||(this.currNode=null)},t.prototype.check=function(t,e){var i=this.validNodes.length;if(i)for(var s=0;s<i;s++)if(Math.pow(t-this.validNodes[s].x,2)+Math.pow(e-this.validNodes[s].y,2)<=Math.pow(this.touchRadius,2))return this.validNodes[s];return!1},t.prototype.drawLine=function(){var t=this.finger,e=t.x,i=t.y,s=this.currStroke.graphicsData[0].shape.points;s[2]=e,s[3]=i,this.render()},t.prototype.setCurrNode=function(t){var e=this.currNode=t,i=e.x,s=e.y;this.validNodes=this.currNode.validNodes;var o=(new PIXI.Graphics).beginFill(this.activeVertexColor,1).drawCircle(0,0,this.vertexRadius);o.x=i,o.y=s,this.stage.addChild(o),this.currStroke=(new PIXI.Graphics).lineStyle(this.lineWidth,this.strokeColor,1).moveTo(i,s).lineTo(i,s),this.stage.addChild(this.currStroke),this.render()},t}();e.default=o}]);
//# sourceMappingURL=onestroke.js.map