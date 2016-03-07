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
            var _this = this;
            this._speed = 2;
            this._isPeak = false;
            this._isCalculating = false;
            this.selectBox = document.getElementById("selectBox");
            this.selectBox.addEventListener("change", function (event) {
                _this.onSelect(event);
            });
            var btnNext = document.getElementById("btnNext");
            btnNext.addEventListener("click", function () {
                if (_this.selectBox.selectedIndex >= _this.selectBox.length - 1) {
                    _this.selectBox.selectedIndex = 0;
                }
                else {
                    _this.selectBox.selectedIndex += 1;
                }
                _this.onSelect(null);
            });
            var btnPrev = document.getElementById("btnPrev");
            btnPrev.addEventListener("click", function () {
                _this.selectBox.selectedIndex -= 1;
                if (_this.selectBox.selectedIndex < 0)
                    _this.selectBox.selectedIndex = _this.selectBox.length - 1;
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
        }
        Main.prototype.handleTick = function () {
            if (this._isCalculating == true) {
                for (var i = 0; i < 1000; i++) {
                    this.addValue(this.currentRandomFunc());
                    if (this._isPeak == true) {
                        this._isCalculating = false; // 計算ループ終了
                        break;
                    }
                }
            }
            this.stage.update();
        };
        Main.prototype.onSelect = function (event) {
            switch (this.selectBox.value) {
                case "default":
                    this.currentRandomFunc = this.calcRandom;
                    break;
                case "add":
                    this.currentRandomFunc = this.calcAddRandom;
                    break;
                case "multiply":
                    this.currentRandomFunc = this.calcMultiplyRandom;
                    break;
                case "multiply-inverse":
                    this.currentRandomFunc = this.calcMultiplyInverse;
                    break;
                case "square":
                    this.currentRandomFunc = this.calcSquareRandom;
                    break;
                case "square-inverse":
                    this.currentRandomFunc = this.calcSquareInverse;
                    break;
                case "sqrt":
                    this.currentRandomFunc = this.calcSqrtRandom;
                    break;
                case "sqrt-inverse":
                    this.currentRandomFunc = this.calcSqrtInverse;
                    break;
                case "normal":
                    this.currentRandomFunc = this.calcNormalRandom;
                    break;
                default:
                    break;
            }
            this.reset();
            this._isCalculating = true;
        };
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
        Main.prototype.calcMultiplyInverse = function () {
            // 乗算の乱数
            var base = Math.random() * Math.random();
            // 反転
            var value = 1.0 - base;
            return value;
        };
        Main.prototype.calcSquareRandom = function () {
            // 2乗の乱数
            var r = Math.random();
            var value = r * r;
            return value;
        };
        Main.prototype.calcSquareInverse = function () {
            // 2乗の乱数
            var r = Math.random();
            var base = r * r;
            // 反転
            var value = 1.0 - base;
            return value;
        };
        Main.prototype.calcSqrtRandom = function () {
            // 平方根の乱数
            var value = Math.sqrt(Math.random());
            return value;
        };
        Main.prototype.calcSqrtInverse = function () {
            // 平方根の乱数
            var base = Math.sqrt(Math.random());
            // 反転
            var value = 1.0 - base;
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
        Main.prototype.calcInverse = function (randomValue) {
            // 平方根の乱数
            var value = 1.0 - randomValue;
            return value;
        };
        Main.prototype.createGraph = function () {
            this._dotArray = [];
            for (var i = 0; i < Main.GRAPH_WIDTH; i++) {
                var marker = new createjs.Shape();
                marker.graphics
                    .beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50 + 10 * i / Main.GRAPH_WIDTH))
                    .drawRect(-2, -2, 4, 4)
                    .endFill()
                    .beginFill(createjs.Graphics.getHSL(40 * i / Main.GRAPH_WIDTH + 180, 100, 50, 0.2))
                    .drawRect(-6, -6, 12, 12)
                    .endFill();
                this._dotArray.push(marker);
                this.graphContainer.addChild(marker);
                marker.x = i;
            }
            this.reset();
        };
        Main.prototype.reset = function () {
            this._isPeak = false;
            this._valueArray = [];
            for (var i = 0; i < Main.GRAPH_WIDTH; i++) {
                this._valueArray.push(0);
                var marker = this._dotArray[i];
                marker.y = Main.GRAPH_HEIGHT - this._valueArray[i];
            }
        };
        Main.prototype.addValue = function (value) {
            var num = Math.floor(value * Main.GRAPH_WIDTH);
            this._valueArray[num] += this._speed;
            var marker = this._dotArray[num];
            marker.y = Main.GRAPH_HEIGHT - this._valueArray[num];
            if (Main.GRAPH_HEIGHT <= this._valueArray[num]) {
                this._isPeak = true;
            }
        };
        Main.GRAPH_WIDTH = 400;
        Main.GRAPH_HEIGHT = 400;
        return Main;
    }());
})(demo || (demo = {}));
