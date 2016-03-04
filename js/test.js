/// <reference path="../libs/easeljs/easeljs.d.ts" />
/**
 * Created by kawakatsu on 2016/03/04.
 */
var Main = (function () {
    function Main() {
        this.init();
    }
    Main.prototype.init = function () {
        var _this = this;
        var selectBox = document.getElementById("selectBox");
        //selectBox.addEventListener("select", ()=>function(event:Event):void{this.onSelect(event)})
        // Stageオブジェクトを作成します
        this.stage = new createjs.Stage("myCanvas");
        this.graphContainer = new createjs.Container();
        this.stage.addChild(this.graphContainer);
        this.randomFunc = this.random2;
        this.countDistribution();
        createjs.Ticker.addEventListener("tick", function () { _this.handleTick(); });
    };
    Main.prototype.handleTick = function () {
        this.stage.update();
    };
    Main.prototype.onSelect = function (event) {
        console.log(event);
        switch (event) {
            case 1:
                this.randomFunc = this.random1;
                break;
            case 2:
                this.randomFunc = this.random2;
                break;
            case 3:
                this.randomFunc = this.random3;
                break;
            case 4:
                this.randomFunc = this.random4;
                break;
            default:
                break;
        }
        this.countDistribution();
    };
    Main.prototype.countDistribution = function () {
        this.graphContainer.removeAllChildren();
        var values = [];
        for (var i = 0; i < Main.DIVISION_NUMBER; i++) {
            values[i] = 0;
        }
        for (var i = 0; i < Main.SAMPLE_NUM; i++) {
            var value = this.randomFunc();
            var quantized = Math.floor(value * Main.DIVISION_NUMBER);
            values[quantized] += 1;
        }
        var maxCount = 0;
        for (var i = 0; i < Main.DIVISION_NUMBER; i++) {
            var count = values[i];
            if (count > maxCount) {
                maxCount = count;
            }
        }
        var dy = Main.GRAPH_HEIGHT / maxCount;
        for (var i = 0; i < Main.DIVISION_NUMBER; i++) {
            this.drawPoint(i * 5, values[i] * dy);
        }
    };
    Main.prototype.drawPoint = function (posX, posY) {
        var shape = new createjs.Shape();
        shape.graphics.beginFill(createjs.Graphics.getHSL(posX / Main.GRAPH_WIDTH * 300, 90, 40));
        shape.graphics.drawCircle(0, 0, 5);
        shape.x = posX;
        shape.y = posY;
        this.graphContainer.addChild(shape);
        this.graphContainer.addChild(shape);
    };
    //
    Main.prototype.random1 = function () {
        return Math.random();
    };
    Main.prototype.random2 = function () {
        var r = Math.random();
        return r * r;
    };
    Main.prototype.random3 = function () {
        return Math.random() * Math.random();
    };
    Main.prototype.random4 = function () {
        return Math.sqrt(Math.random());
    };
    Main.prototype.random5 = function () {
        return (Math.random() + Math.random()) / 2;
    };
    Main.SAMPLE_NUM = 500;
    Main.DIVISION_NUMBER = 100;
    Main.GRAPH_WIDTH = 500;
    Main.GRAPH_HEIGHT = 500;
    return Main;
})();
;
window.addEventListener("load", function () { new Main(); });
//# sourceMappingURL=test.js.map