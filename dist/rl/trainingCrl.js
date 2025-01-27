"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.TrainingCrl = exports.delay = void 0;
var delay = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
exports.delay = delay;
var TrainingCrl = /** @class */ (function () {
    /**
     * @param {RemoteControl} remoteControl
     * @param {BotTrainer} bot
     * @param {function} onReadyCallback
     */
    function TrainingCrl(remoteControl, bot, onReadyCallback) {
        var _this = this;
        this.trainingHasStarted = false;
        this.onListeningMode = false;
        this.cycleSeq = 0;
        this.debugging_log = true;
        this.stopRequested = false;
        this.resumeListeningPhase = function () {
            console.error('resumeListeningPhase not defined yet - should wait the initialise it on the first "update" call');
        };
        this._gotNextState = function (newGameSnapshot) {
            _this._debug("No one waiting for the next state");
        };
        this.onReady = onReadyCallback;
        this.bot = bot;
        this.remoteControl = remoteControl;
    }
    /**
     * Set the state of match randomly.
     */
    TrainingCrl.prototype.setEnvironment = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._debug("Reset state");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.bot.createNewInitialState(data)];
                    case 2:
                        _a.lastSnapshot = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        console.error("bot trainer failed to create initial state", e_1);
                        throw e_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TrainingCrl.prototype.getState = function () {
        try {
            this.cycleSeq++;
            this._debug("got state");
            return this.bot.getState(this.lastSnapshot);
        }
        catch (e) {
            console.error("bot trainer failed to return inputs from a particular state", e);
            throw e;
        }
    };
    TrainingCrl.prototype.update = function (action) {
        return __awaiter(this, void 0, void 0, function () {
            var previousState, updatedOrderSet, _a, _b, done, reward, e_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._debug("UPDATE");
                        if (!this.onListeningMode) {
                            throw new Error("faulty synchrony - got a new action when was still processing the last one");
                        }
                        previousState = this.lastSnapshot;
                        this.OrderSet.setTurn(this.lastSnapshot.getTurn());
                        return [4 /*yield*/, this.bot.play(this.OrderSet, this.lastSnapshot, action)];
                    case 1:
                        updatedOrderSet = _c.sent();
                        this._debug("got order set, passing down");
                        this.resumeListeningPhase(updatedOrderSet);
                        return [4 /*yield*/, (0, exports.delay)(20)]; // before calling next turn, let's wait just a bit to ensure the server got our order
                    case 2:
                        _c.sent(); // before calling next turn, let's wait just a bit to ensure the server got our order
                        _a = this;
                        return [4 /*yield*/, this.waitUntilNextListeningState()];
                    case 3:
                        _a.lastSnapshot = _c.sent();
                        this._debug("got new snapshot after order has been sent");
                        if (this.stopRequested) {
                            return [2 /*return*/, { done: true, reward: 0 }];
                        }
                        // TODO: if I want to skip the net N turns? I should be able too
                        this._debug("update finished (turn ".concat(this.lastSnapshot.getTurn(), " waiting for next action}"));
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this.bot.evaluate(previousState, this.lastSnapshot)];
                    case 5:
                        _b = _c.sent(), done = _b.done, reward = _b.reward;
                        return [2 /*return*/, { done: done, reward: reward }];
                    case 6:
                        e_2 = _c.sent();
                        console.error("bot trainer failed to evaluate game state", e_2);
                        throw e_2;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TrainingCrl.prototype.gameTurnHandler = function (orderSet, snapshot) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        /**
                         * This method is called when the game is on the `LISTENING` state.
                         * When the game starts it takes a while to enter this state.
                         *
                         * When the game enters in LISTENING state, we want to hold the game until the learning bot submit the action.
                         *
                         * Then we create the promise below that will only be resolved when the `resumeListeningPhase` is called.
                         *
                         * Read the following comments to understand the flow.
                         */
                        this._debug("new turn");
                        if (this.onListeningMode) {
                            throw new Error("faulty synchrony - got new turn while the trainer already was in listening mode  (check the lugo 'timer-mode')");
                        }
                        this._gotNextState(snapshot);
                        return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                                var maxWait;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    maxWait = setTimeout(function () {
                                        if (_this.stopRequested) {
                                            return resolve(orderSet);
                                        }
                                        console.error("max wait for a new action");
                                        reject();
                                    }, 30000);
                                    // [explaining flow] here we check if the bot asked to stop
                                    if (this.stopRequested) {
                                        this._debug("stop requested - will not defined call back for new actions");
                                        resolve(orderSet);
                                        clearTimeout(maxWait);
                                        return [2 /*return*/, null];
                                    }
                                    this.OrderSet = orderSet;
                                    // [explaining flow] here we will define the callback called when the bot returns the orders.
                                    this.resumeListeningPhase = function (updatedOrderSet) {
                                        _this._debug("sending new action");
                                        clearTimeout(maxWait);
                                        resolve(updatedOrderSet);
                                    };
                                    this.onListeningMode = true;
                                    this._debug("resumeListeningPhase defined, waiting for action (has started: ".concat(this.trainingHasStarted, ")"));
                                    if (!this.trainingHasStarted) {
                                        this.onReady(this);
                                        this.trainingHasStarted = true;
                                        this._debug("the training has started");
                                    }
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1: 
                    // [explaining flow] this promise will ensure that we will only return the bot order after resumeListeningPhase has been called.
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    TrainingCrl.prototype.waitUntilNextListeningState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolveTurn, rejectTurn) {
                        try {
                            _this.onListeningMode = false;
                            _this._gotNextState = function (newGameSnapshot) {
                                resolveTurn(newGameSnapshot);
                            };
                            _this._debug("resumeListening: ".concat(_this.lastSnapshot.getTurn()));
                            _this.remoteControl.resumeListening();
                        }
                        catch (e) {
                            rejectTurn();
                            console.error("failed to send the orders to the server", e);
                        }
                    })];
            });
        });
    };
    TrainingCrl.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stopRequested = true;
                return [2 /*return*/];
            });
        });
    };
    TrainingCrl.prototype._debug = function (msg) {
        if (this.debugging_log) {
            console.log("[".concat(this.cycleSeq, "] ").concat(msg));
        }
    };
    return TrainingCrl;
}());
exports.TrainingCrl = TrainingCrl;
function asyncToSync(asyncOriginalFunc) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, asyncOriginalFunc()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, function () {
                            return result;
                        }];
            }
        });
    });
}
