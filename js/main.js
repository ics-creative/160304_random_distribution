/// <reference path="../libs/easeljs/easeljs.d.ts" />
var demo;
(function (demo) {
    "use strict";
    // ページ読み込み後に実行
    window.addEventListener("DOMContentLoaded", function () {
        new Main();
    });
    /**
     * ランダムアルゴリズムの可視化デモのクラスです。
     */
    var Main = (function () {
        function Main() {
            this._rate = 2;
            this._isMax = false;
            this._isCalculating = false;
            this.init();
        }
        Main.prototype.init = function () {
            var _this = this;
            this.selectBox = document.getElementById("selectBox");
            this.selectBox.addEventListener("change", function (event) {
                _this.onSelect(event);
            });
            var btnNext = document.getElementById("btnNext");
            btnNext.addEventListener("click", function () {
                _this.selectBox.selectedIndex += 1;
                if (_this.selectBox.selectedIndex >= Main.NUM_LOGIC)
                    _this.selectBox.selectedIndex = 0;
                _this.onSelect(null);
            });
            var btnPrev = document.getElementById("btnPrev");
            btnPrev.addEventListener("click", function () {
                _this.selectBox.selectedIndex -= 1;
                if (_this.selectBox.selectedIndex < 0)
                    _this.selectBox.selectedIndex = Main.NUM_LOGIC - 1;
                _this.onSelect(null);
            });
            // Stageオブジェクトを作成します
            this.stage = new createjs.Stage("myCanvas");
            this.graphContainer = new createjs.Container();
            this.stage.addChild(this.graphContainer);
            this.createGraph();
            createjs.Ticker.timingMode = createjs.Ticker.RAF;
            createjs.Ticker.addEventListener("tick", function () {
                _this.handleTick();
            });
            this.onSelect(null);
        };
        Main.prototype.handleTick = function () {
            if (this._isCalculating == true) {
                for (var i = 0; i < 1000; i++) {
                    this.addValue(this.currentRandomFunc());
                    if (this._isMax == true) {
                        this._isCalculating = false; // 計算ループ終了
                        break;
                    }
                }
            }
            this.stage.update();
        };
        Main.prototype.onSelect = function (event) {
            switch (this.selectBox.selectedIndex) {
                case 0:
                    this.currentRandomFunc = this.calcRandom;
                    break;
                case 1:
                    this.currentRandomFunc = this.calcAddRandom;
                    break;
                case 2:
                    this.currentRandomFunc = this.calcMultiplyRandom;
                    break;
                case 3:
                    this.currentRandomFunc = this.calcSquareRandom;
                    break;
                case 4:
                    this.currentRandomFunc = this.calcSqrtRandom;
                    break;
                case 5:
                    this.currentRandomFunc = this.calcNormalRandom;
                    break;
                default:
                    break;
            }
            this.reset();
            this._isCalculating = true;
        };
        //
        Main.prototype.calcRandom = function () {
            // 通常の乱数
            var value = Math.random();
            return value;
        };
        Main.prototype.calcAddRandom = function () {
            // 加算の乱数
            var value = (Math.random() + Math.random()) / 2;
            return value;
        };
        Main.prototype.calcMultiplyRandom = function () {
            // 乗算の乱数
            var value = Math.random() * Math.random();
            return value;
        };
        Main.prototype.calcSquareRandom = function () {
            // 2乗の乱数
            var r = Math.random();
            var value = r * r;
            return value;
        };
        Main.prototype.calcSqrtRandom = function () {
            // 平方根の乱数
            var value = Math.sqrt(Math.random());
            return value;
        };
        Main.prototype.calcNormalRandom = function () {
            function calcNormal() {
                // 正規乱数
                var r1 = Math.random();
                var r2 = Math.random();
                var value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
                // 値を0以上1未満になるよう正規化する
                value = (value + 3) / 6;
                return value;
            }
            // 0.0未満、1.0以上になるケースがあるため
            // その時は再計算を行う
            var value;
            while (true) {
                value = calcNormal();
                if (0 <= value && value < 1) {
                    break;
                }
            }
            return value;
        };
        Main.prototype.createGraph = function () {
            this._markerList = [];
            for (var i = 0; i < Main.GRAPH_WIDTH; i++) {
                var marker = new createjs.Shape();
                marker.graphics
                    .beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50 + 10 * i / Main.GRAPH_WIDTH))
                    .drawRect(-2, -2, 4, 4)
                    .endFill()
                    .beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50, 0.2))
                    .drawRect(-6, -6, 12, 12)
                    .endFill();
                this._markerList.push(marker);
                this.graphContainer.addChild(marker);
                marker.x = i;
            }
            this.reset();
        };
        Main.prototype.reset = function () {
            this._isMax = false;
            this._valueList = [];
            for (var i = 0; i < Main.GRAPH_WIDTH; i++) {
                this._valueList.push(0);
                var marker = this._markerList[i];
                marker.y = Main.GRAPH_HEIGHT - this._valueList[i];
            }
        };
        Main.prototype.addValue = function (value) {
            var num = Math.floor(value * Main.GRAPH_WIDTH);
            this._valueList[num] += this._rate;
            var marker = this._markerList[num];
            marker.y = Main.GRAPH_HEIGHT - this._valueList[num];
            if (Main.GRAPH_HEIGHT <= this._valueList[num]) {
                this._isMax = true;
            }
        };
        Main.GRAPH_WIDTH = 400;
        Main.GRAPH_HEIGHT = 400;
        Main.NUM_LOGIC = 6;
        return Main;
    }());
})(demo || (demo = {}));
