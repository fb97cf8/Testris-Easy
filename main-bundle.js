(() => {
    "use strict";
    var n = globalThis.btoa,
        t = globalThis.atob,
        r = function () {
            return window.location.reload();
        },
        o = function (e) {
            return function () {
                return e;
            };
        },
        i = {
            SHAPES: [
                [
                    [1, 1, 1],
                    [0, 1, 0],
                    [0, 0, 0],
                ],
                [
                    [2, 2],
                    [2, 2],
                ],
                [
                    [0, 0, 3, 0],
                    [0, 0, 3, 0],
                    [0, 0, 3, 0],
                    [0, 0, 3, 0],
                ],
                [
                    [0, 4, 0],
                    [0, 4, 0],
                    [0, 4, 4],
                ],
                [
                    [0, 5, 0],
                    [0, 5, 0],
                    [5, 5, 0],
                ],
                [
                    [0, 6, 6],
                    [6, 6, 0],
                    [0, 0, 0],
                ],
                [
                    [7, 7, 0],
                    [0, 7, 7],
                    [0, 0, 0],
                ],
            ],
            ARENA_WIDTH: 10,
            ARENA_HEIGHT: 18,
            SCALE: 45,
            DROP_INTERVAL: 350,
            DROP_KEY_INTERVAL: 44,
            LOCK_DELAY: 450,
            HORIZONTAL_MOVEMENT_INTERVAL: 76,
            DANGER_ROWS: 3,
            RANDOM_START_PIECES: 10,
            MAX_REPEATS: 2,
            MAX_UNDO_HISTORY: 500,
            font: { FAMILY: "Arial, Helvetica, sans-serif", COLOR: "white" },
            COLORS: ["#FF0D72", "#0DC2FF", "#0DFF72", "#F538FF", "#FF8E0D", "#FFE138", "#3877FF", "#FF0000"],
            controls: { ROTATE: ["w", "ArrowUp"], LEFT: ["a", "ArrowLeft"], DROP: ["s", "ArrowDown"], RIGHT: ["d", "ArrowRight"], HARDDROP: [" "], UNDO: ["r"] },
            scorePoints: { DROP: 1, HARDDROP: 3, LANDING: 10, LINECLEAR: 75 },
            storageKeys: { localStorage: { GAMESTATE: "gameState", UNDO_HISTORY: "undoHistory", HIGHSCORE_OLD: "_hscore" }, chromeStorage: { HIGHSCORE: n("highScore"), LEGACY_HIGHSCORE_CHECKED: n("legacyHighScoreChecked"), ADS: n("stored-ads") } },
        };
    const a = Object.freeze(i);
    var c = function (e, n, t, r, o, i) {
            for (var a = 0; a < n.length; a++)
                for (var c = 0; c < n[0].length; c++)
                    if (n[a][c] > 0) {
                        var u = n[a][c];
                        (e.fillStyle = i(e, u, c, a, n)), e.fillRect((t + c) * o, (r + a) * o, o, o);
                    }
        },
        u = function (e, n, t, r) {
            (e.font = n + "px " + t), (e.fillStyle = r || e.fillStyle);
        },
        l = function (e, n, t, r) {
            e.fillText(n, t, r);
        },
        s = 2 * a.SCALE,
        f = {
            ANY: "*",
            keys: {},
            keyDownListeners: {},
            initialize: function () {
                var e = this;
                window.document.addEventListener("keyup", this.keyEvent.bind(this)),
                    window.document.addEventListener("keydown", function (n) {
                        var t = n.key.toLowerCase();
                        e.emitEvent(t, n), e.emitEvent(f.ANY, n), e.keyEvent(n);
                    }),
                    window.addEventListener("blur", function () {
                        return Object.keys(e.keys).forEach(function (n) {
                            return (e.keys[n] = !1);
                        });
                    });
            },
            emitEvent: function (e, n) {
                if (this.keyDownListeners[e])
                    for (
                        var t = this.keyDownListeners[e].map(function (e) {
                                return [e(n), e];
                            }),
                            r = 0,
                            o = t;
                        r < o.length;
                        r++
                    ) {
                        var i = o[r],
                            a = i[0],
                            c = i[1];
                        if (a) {
                            var u = this.keyDownListeners[e].indexOf(c);
                            this.keyDownListeners[e].splice(u, 1);
                        }
                    }
            },
            keyEvent: function (e) {
                this.keys[e.key.toLowerCase()] = "keydown" === e.type;
            },
            keyDown: function (e) {
                var n = this;
                return e === this.ANY
                    ? Object.keys(this.keys).some(function (e) {
                          return !0 === n.keys[e];
                      })
                    : !!this.keys[e.toLowerCase()];
            },
            keysDown: function () {
                for (var e = this, n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
                return n.some(function (n) {
                    return e.keyDown(n);
                });
            },
            onKeyDown: function (e, n) {
                var t = this;
                return (
                    (e = e.toLowerCase()),
                    this.keyDownListeners[e] || (this.keyDownListeners[e] = []),
                    this.keyDownListeners[e].push(n),
                    function () {
                        var r = t.keyDownListeners[e].indexOf(n);
                        t.keyDownListeners[e].splice(r, 1);
                    }
                );
            },
            onKeysDown: function (e, n) {
                var t = this,
                    r = e.map(function (e) {
                        return t.onKeyDown(e, n);
                    });
                return function () {
                    r.forEach(function (e) {
                        return e();
                    });
                };
            },
            onKeyStart: function (e, n) {
                var t = this;
                return this.onKeyDown(e, function (r) {
                    return !t.keyDown(e) && n(r);
                });
            },
            onFirstPress: function (e, n) {
                this.onKeyDown(e, function () {
                    for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
                    return n.apply(void 0, e), !0;
                });
            },
        };
    const h = f;
    var y,
        p = function (e) {
            return e
                .map(function (e) {
                    return e.slice();
                })
                .slice();
        },
        d = function (e, n) {
            for (var t, r = 0; r < e.length; ++r) for (var o = 0; o < r; ++o) (t = [e[r][o], e[o][r]]), (e[o][r] = t[0]), (e[r][o] = t[1]);
            n > 0
                ? e.forEach(function (e) {
                      return e.reverse();
                  })
                : e.reverse();
        },
        collides = function (arena, shape, px, py) {
            for (var row = 0; row < shape.length; row++)
                for (var col = 0; col < shape[row].length; col++)
                    if (shape[row][col] > 0) {
                        var ay = py + row,
                            ax = px + col;
                        if (ax < 0 || ax >= a.ARENA_WIDTH || ay >= a.ARENA_HEIGHT || (ay >= 0 && arena[ay][ax] > 0)) return !0;
                    }
            return !1;
        },
        // Removes full rows from `arena` in place and returns how many were cleared.
        clearFullRows = function (arena) {
            var cleared = 0;
            for (var row = arena.length - 1; row >= 0; row--)
                arena[row].every(function (cell) {
                    return cell > 0;
                }) && (arena.splice(row, 1), cleared++);
            for (var k = 0; k < cleared; k++) arena.unshift(Array(a.ARENA_WIDTH).fill(0));
            return cleared;
        },
        // Number of empty cells left directly underneath the piece once it has landed at (px, py).
        gapsUnder = function (arena, shape, px, py) {
            for (var gaps = 0, col = 0; col < shape[0].length; col++)
                for (var row = shape.length - 1; row >= 0; row--)
                    if (shape[row][col] > 0) {
                        for (var below = py + row + 1; below < a.ARENA_HEIGHT && 0 === arena[below][px + col]; below++) gaps++;
                        break;
                    }
            return gaps;
        },
        // Every distinct hard-drop landing of `shape` (any rotation, any column) that doesn't end the game,
        // with how many gaps it leaves underneath.
        landings = function (arena, shape) {
            var result = [],
                seen = {};
            shape = p(shape);
            for (var rotation = 0; rotation < 4; rotation++, d(shape, 1))
                for (var x = -shape.length; x < a.ARENA_WIDTH; x++) {
                    var y = -shape.length;
                    if (!collides(arena, shape, x, y)) {
                        for (; !collides(arena, shape, x, y + 1); ) y++;
                        for (var board = p(arena), cells = [], overflowed = !1, row = 0; row < shape.length; row++)
                            for (var col = 0; col < shape[row].length; col++)
                                shape[row][col] > 0 && (y + row < 0 ? (overflowed = !0) : ((board[y + row][x + col] = shape[row][col]), cells.push(y + row + ":" + (x + col))));
                        var key = cells.join(",");
                        overflowed ||
                            seen[key] ||
                            ((seen[key] = !0),
                            clearFullRows(board),
                            board.slice(0, a.DANGER_ROWS).some(function (r) {
                                return r.some(function (cell) {
                                    return cell > 0;
                                });
                            }) || result.push(gapsUnder(arena, shape, x, y)));
                    }
                }
            return result;
        },
        // Picks a shape that fits flush (no gaps underneath) on the current board. Each shape's chance is
        // proportional to how many places it fits, so the best fit is likeliest but not guaranteed.
        // It is re-run on the real board every spawn, so if the player places a piece somewhere else
        // the next pick adapts to that. If nothing fits flush any more, only the shapes leaving the
        // fewest gaps are considered. The first RANDOM_START_PIECES pieces are purely random.
        // No shape is dealt more than MAX_REPEATS times in a row: when that limit is hit, the repeated
        // shape is ruled out and the best remaining shape is dealt instead.
        // Takes the game state and records the dealt piece in `piecesDealt` and `recentPieces`.
        g = function (state) {
            var board = p(state.arena),
                piecesDealt = state.piecesDealt || 0,
                recent = state.recentPieces || [],
                blocked =
                    recent.length >= a.MAX_REPEATS &&
                    recent.every(function (type) {
                        return type === recent[0];
                    })
                        ? recent[0]
                        : -1,
                allowed = a.SHAPES.map(function (shape, type) {
                    return { shape: shape, type: type, gaps: 0, count: 1 };
                }).filter(function (fit) {
                    return fit.type !== blocked;
                }),
                candidates = allowed;
            if (piecesDealt >= a.RANDOM_START_PIECES) {
                clearFullRows(board),
                    allowed.forEach(function (fit) {
                        var gaps = landings(board, fit.shape);
                        (fit.gaps = Math.min.apply(Math, gaps)),
                            (fit.count = gaps.filter(function (n) {
                                return n === fit.gaps;
                            }).length);
                    });
                var fewestGaps = Math.min.apply(
                    Math,
                    allowed.map(function (fit) {
                        return fit.gaps;
                    })
                );
                (candidates = allowed.filter(function (fit) {
                    return fit.gaps === fewestGaps && fit.count > 0;
                })),
                    -1 !== blocked &&
                        candidates.length &&
                        (candidates = candidates.filter(function (fit, k, all) {
                            return (
                                fit.count ===
                                Math.max.apply(
                                    Math,
                                    all.map(function (other) {
                                        return other.count;
                                    })
                                )
                            );
                        })),
                    candidates.length || (candidates = allowed);
            }
            var total = 0;
            candidates.forEach(function (fit) {
                total += fit.count || 1;
            });
            for (var roll = Math.random() * total, k = 0; k < candidates.length - 1 && (roll -= candidates[k].count || 1) >= 0; k++);
            var picked = candidates[k],
                t = p(picked.shape);
            return (
                (state.piecesDealt = piecesDealt + 1),
                (state.recentPieces = recent.concat(picked.type).slice(-a.MAX_REPEATS)),
                { x: Math.floor(a.ARENA_WIDTH / 2 - t[0].length / 2), y: -t.length, shape: t }
            );
        },
        // Undo history: one snapshot per piece, taken the moment it spawns. The last entry is always the
        // current piece. It's kept out of the game state (which is saved every frame) and stored
        // separately only when it changes.
        undoHistory = [],
        saveUndoHistory = function () {
            L(a.storageKeys.localStorage.UNDO_HISTORY, undoHistory);
        },
        recordSpawn = function (state) {
            undoHistory.push(
                JSON.parse(
                    JSON.stringify({
                        arena: state.arena,
                        player: state.player,
                        score: state.score,
                        piecesDealt: state.piecesDealt,
                        recentPieces: state.recentPieces,
                        piecesPlaced: state.piecesPlaced,
                    })
                )
            ),
                undoHistory.length > a.MAX_UNDO_HISTORY && undoHistory.shift(),
                saveUndoHistory();
        },
        resetUndoHistory = function (state) {
            (undoHistory = []), recordSpawn(state);
        },
        loadUndoHistory = function (state) {
            (undoHistory = O(a.storageKeys.localStorage.UNDO_HISTORY) || []), undoHistory.length || recordSpawn(state);
        },
        // Drops the current piece and rewinds to the moment the last placed piece spawned.
        undo = function (state) {
            undoHistory.length < 2 ||
                (undoHistory.pop(), Object.assign(state, JSON.parse(JSON.stringify(undoHistory[undoHistory.length - 1])), { lost: !1 }), saveUndoHistory());
        },
        w = function (e) {
            return !!A(e) && ((e.player.y -= 1), !0);
        },
        E = function (e, n) {
            void 0 === n && (n = !0),
                (function (e) {
                    for (var n = 0; n < e.player.shape.length; n++)
                        for (var t = 0; t < e.player.shape[n].length; t++)
                            if (0 !== e.player.shape[n][t]) {
                                var r = e.player.y + n,
                                    o = e.player.x + t;
                                void 0 !== e.arena[r] && void 0 !== e.arena[r][o] && (e.arena[r][o] = e.player.shape[n][t]);
                            }
                })(e),
                (e.piecesPlaced = (e.piecesPlaced || 0) + 1),
                (e.player = g(e)),
                n && (e.score += a.scorePoints.LANDING),
                recordSpawn(e);
        },
        A = function (e) {
            for (var n = 0; n < e.player.shape.length; n++)
                for (var t = 0; t < e.player.shape[n].length; t++)
                    if (e.player.shape[n][t] > 0) {
                        var r = e.player.y + n,
                            o = e.player.x + t;
                        if (o >= a.ARENA_WIDTH || r >= a.ARENA_HEIGHT || o < 0 || (r >= 0 && e.arena[r][o] > 0)) return !0;
                    }
            return !1;
        },
        m = function () {
            return (
                (m =
                    Object.assign ||
                    function (e) {
                        for (var n, t = 1, r = arguments.length; t < r; t++) for (var o in (n = arguments[t])) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
                        return e;
                    }),
                m.apply(this, arguments)
            );
        },
        b = function (e) {
            return e.time - e.lastTime;
        },
        S = { b64name: !0, b64value: !0 },
        L = function (e, t, r) {
            void 0 === r && (r = {}), Object.assign(S, r);
            var o = r.b64name ? n(e) : e,
                i = (function (e, t) {
                    void 0 === t && (t = !0);
                    var r = JSON.stringify(e);
                    return t ? n(r) : r;
                })(t, r.b64value);
            window.localStorage.setItem(o, i);
        },
        O = function (e, r) {
            void 0 === r && (r = {}), Object.assign(S, r);
            var o = r.b64name ? n(e) : e,
                i = window.localStorage.getItem(o);
            return null !== i
                ? (function (e, n) {
                      void 0 === n && (n = !0);
                      var r = n ? t(e) : e;
                      return JSON.parse(r);
                  })(i, r.b64value)
                : null;
        };
    !(function (e) {
        (e.LOCAL = "local"), (e.SYNC = "sync");
    })(y || (y = {}));
    var C = function (e) {
            return chrome && chrome.storage && chrome.storage[e];
        },
        k = function (e) {
            return function (n, t) {
                return new Promise(function (r) {
                    var o;
                    C(e) ? chrome.storage[e].set((((o = {})[n] = t), o), r) : (L(n, t), r());
                });
            };
        },
        D = function (e) {
            return function (n) {
                return new Promise(function (t, r) {
                    var o = "item with key [" + n + "] does not exist";
                    if (C(e))
                        chrome.storage[e].get(n, function (e) {
                            return e[n] ? t(e[n]) : r(o);
                        });
                    else {
                        var i = O(n);
                        null !== i ? t(i) : r(o);
                    }
                });
            };
        },
        R = D(y.LOCAL),
        H = k(y.LOCAL),
        x = (D(y.SYNC), k(y.SYNC)),
        T = function (e) {
            L(a.storageKeys.localStorage.GAMESTATE, e);
        },
        I = function () {
            return new Promise(function (e) {
                return (
                    (t = void 0),
                    (r = void 0),
                    (c = function () {
                        var t, r, i, c;
                        return (function (e, n) {
                            var t,
                                r,
                                o,
                                i,
                                a = {
                                    label: 0,
                                    sent: function () {
                                        if (1 & o[0]) throw o[1];
                                        return o[1];
                                    },
                                    trys: [],
                                    ops: [],
                                };
                            return (
                                (i = { next: c(0), throw: c(1), return: c(2) }),
                                "function" == typeof Symbol &&
                                    (i[Symbol.iterator] = function () {
                                        return this;
                                    }),
                                i
                            );
                            function c(i) {
                                return function (c) {
                                    return (function (i) {
                                        if (t) throw new TypeError("Generator is already executing.");
                                        for (; a; )
                                            try {
                                                if (((t = 1), r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done)) return o;
                                                switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
                                                    case 0:
                                                    case 1:
                                                        o = i;
                                                        break;
                                                    case 4:
                                                        return a.label++, { value: i[1], done: !1 };
                                                    case 5:
                                                        a.label++, (r = i[1]), (i = [0]);
                                                        continue;
                                                    case 7:
                                                        (i = a.ops.pop()), a.trys.pop();
                                                        continue;
                                                    default:
                                                        if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || (6 !== i[0] && 2 !== i[0]))) {
                                                            a = 0;
                                                            continue;
                                                        }
                                                        if (3 === i[0] && (!o || (i[1] > o[0] && i[1] < o[3]))) {
                                                            a.label = i[1];
                                                            break;
                                                        }
                                                        if (6 === i[0] && a.label < o[1]) {
                                                            (a.label = o[1]), (o = i);
                                                            break;
                                                        }
                                                        if (o && a.label < o[2]) {
                                                            (a.label = o[2]), a.ops.push(i);
                                                            break;
                                                        }
                                                        o[2] && a.ops.pop(), a.trys.pop();
                                                        continue;
                                                }
                                                i = n.call(e, a);
                                            } catch (e) {
                                                (i = [6, e]), (r = 0);
                                            } finally {
                                                t = o = 0;
                                            }
                                        if (5 & i[0]) throw i[1];
                                        return { value: i[0] ? i[1] : void 0, done: !0 };
                                    })([i, c]);
                                };
                            }
                        })(this, function (u) {
                            switch (u.label) {
                                case 0:
                                    return [4, R(a.storageKeys.chromeStorage.HIGHSCORE).catch(o(0))];
                                case 1:
                                    return (t = u.sent()), [4, R(a.storageKeys.chromeStorage.HIGHSCORE).catch(o(0))];
                                case 2:
                                    return (r = u.sent()), (i = 0), [4, R(a.storageKeys.chromeStorage.LEGACY_HIGHSCORE_CHECKED).catch(o(!1))];
                                case 3:
                                    return (
                                        u.sent() ||
                                            (null !== (i = O(a.storageKeys.localStorage.HIGHSCORE_OLD, { b64name: !1, b64value: !1 })) &&
                                                (function (e, t) {
                                                    void 0 === t && (t = {}), Object.assign(S, t);
                                                    var r = t.b64name ? n(e) : e;
                                                    window.localStorage.removeItem(r);
                                                })(a.storageKeys.localStorage.HIGHSCORE_OLD, { b64name: !1 }),
                                            H(a.storageKeys.chromeStorage.LEGACY_HIGHSCORE_CHECKED, !0)),
                                        (c = Math.max(t, r, i)),
                                        x(a.storageKeys.chromeStorage.HIGHSCORE, c),
                                        H(a.storageKeys.chromeStorage.HIGHSCORE, c),
                                        e(c),
                                        [2]
                                    );
                            }
                        });
                    }),
                    new ((i = void 0) || (i = Promise))(function (e, n) {
                        function o(e) {
                            try {
                                u(c.next(e));
                            } catch (e) {
                                n(e);
                            }
                        }
                        function a(e) {
                            try {
                                u(c.throw(e));
                            } catch (e) {
                                n(e);
                            }
                        }
                        function u(n) {
                            var t;
                            n.done
                                ? e(n.value)
                                : ((t = n.value),
                                  t instanceof i
                                      ? t
                                      : new i(function (e) {
                                            e(t);
                                        })).then(o, a);
                        }
                        u((c = c.apply(t, r || [])).next());
                    })
                );
                var t, r, i, c;
            });
        },
        N = function (e) {
            return !e.every(function (e) {
                return 0 === e;
            });
        },
        P = function (e) {
            return e.every(function (e) {
                return e > 0;
            });
        },
        _ = function (e, n, t, r) {
            return new (t || (t = Promise))(function (o, i) {
                function a(e) {
                    try {
                        u(r.next(e));
                    } catch (e) {
                        i(e);
                    }
                }
                function c(e) {
                    try {
                        u(r.throw(e));
                    } catch (e) {
                        i(e);
                    }
                }
                function u(e) {
                    var n;
                    e.done
                        ? o(e.value)
                        : ((n = e.value),
                          n instanceof t
                              ? n
                              : new t(function (e) {
                                    e(n);
                                })).then(a, c);
                }
                u((r = r.apply(e, n || [])).next());
            });
        },
        K = function (e, n) {
            var t,
                r,
                o,
                i,
                a = {
                    label: 0,
                    sent: function () {
                        if (1 & o[0]) throw o[1];
                        return o[1];
                    },
                    trys: [],
                    ops: [],
                };
            return (
                (i = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                    (i[Symbol.iterator] = function () {
                        return this;
                    }),
                i
            );
            function c(i) {
                return function (c) {
                    return (function (i) {
                        if (t) throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (((t = 1), r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done)) return o;
                                switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
                                    case 0:
                                    case 1:
                                        o = i;
                                        break;
                                    case 4:
                                        return a.label++, { value: i[1], done: !1 };
                                    case 5:
                                        a.label++, (r = i[1]), (i = [0]);
                                        continue;
                                    case 7:
                                        (i = a.ops.pop()), a.trys.pop();
                                        continue;
                                    default:
                                        if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || (6 !== i[0] && 2 !== i[0]))) {
                                            a = 0;
                                            continue;
                                        }
                                        if (3 === i[0] && (!o || (i[1] > o[0] && i[1] < o[3]))) {
                                            a.label = i[1];
                                            break;
                                        }
                                        if (6 === i[0] && a.label < o[1]) {
                                            (a.label = o[1]), (o = i);
                                            break;
                                        }
                                        if (o && a.label < o[2]) {
                                            (a.label = o[2]), a.ops.push(i);
                                            break;
                                        }
                                        o[2] && a.ops.pop(), a.trys.pop();
                                        continue;
                                }
                                i = n.call(e, a);
                            } catch (e) {
                                (i = [6, e]), (r = 0);
                            } finally {
                                t = o = 0;
                            }
                        if (5 & i[0]) throw i[1];
                        return { value: i[0] ? i[1] : void 0, done: !0 };
                    })([i, c]);
                };
            }
        },
        G = function (e, n, t) {
            var r = (function () {
                    try {
                        if (-1 !== window.location.href.indexOf("chrome-extension://")) return chrome.runtime.getManifest().version;
                    } catch (e) {}
                    return "null";
                })(),
                o = ["send", "event", e + "[" + location.host + "@" + r + "]", e + "[" + location.host + "@" + r + "]--" + n, e + "[" + location.host + "@" + r + "]--" + n + "--" + t];
            console.log("Event reported", o), ga.apply(void 0, o);
        },
        F = function (e, n) {
            console.error(e);
            var t = (function (e) {
                if (!(e instanceof Error)) return JSON.stringify(e);
                var n = {};
                return (
                    Object.getOwnPropertyNames(e).forEach(function (t) {
                        n[t] = e[t];
                    }, e),
                    JSON.stringify(n)
                );
            })(e);
            null != e && null != e.message && (t = e.message + " | " + t), G(e, n, t);
        },
        M = function (e) {
            return function () {
                for (var n = [], t = 0; t < arguments.length; t++) n[t] = arguments[t];
                return new Promise(function (t, r) {
                    return _(void 0, void 0, void 0, function () {
                        var o, i, a, c;
                        return K(this, function (u) {
                            switch (u.label) {
                                case 0:
                                    (o = !1),
                                        (i = function () {
                                            for (var e = [], n = 0; n < arguments.length; n++) e[n] = arguments[n];
                                            (o = !0), r.apply(void 0, e);
                                        }),
                                        (u.label = 1);
                                case 1:
                                    return (
                                        u.trys.push([1, 4, 5, 6]),
                                        (a = e.apply(void 0, n)) instanceof Promise
                                            ? [
                                                  4,
                                                  a.catch(function (e) {
                                                      return i(e);
                                                  }),
                                              ]
                                            : [3, 3]
                                    );
                                case 2:
                                    u.sent(), (u.label = 3);
                                case 3:
                                    return [3, 6];
                                case 4:
                                    return (c = u.sent()), i(c), [3, 6];
                                case 5:
                                    return o || t(), [7];
                                case 6:
                                    return [2];
                            }
                        });
                    });
                });
            };
        },
        Y = function (e, n) {
            return function () {
                for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
                return M(e)
                    .apply(void 0, t)
                    .catch(function (e) {
                        return F(e, n);
                    });
            };
        };
    const j = function (e, n) {
        return a.COLORS[n - 1];
    };
    var q = function (e, n) {
            void 0 === n && (n = !0);
            var t = window.document.querySelector("div.controls");
            !(function (e, n) {
                n ? e.classList.add("animated") : e.classList.remove("animated");
            })(t, n),
                e ? t.removeAttribute("hidden") : t.setAttribute("hidden", "");
        },
        W = function (e) {
            return void 0 === e && (e = !0), q(!1, e);
        },
        V = function (e) {
            return null === e ? null : window.document.querySelector(e);
        },
        z = function (e, n, t) {
            e.forEach(function (e, r, o) {
                return e.addEventListener(n, t(e, r, o));
            });
        },
        J = function (e, n) {
            return e.getAttribute(n);
        },
        B = function (e, n) {
            var t, r;
            (e.paused = n), (r = n ? "play" : "pause"), ((t = V("button#pause")).querySelector("img").src = "assets/" + r + ".png"), t.blur();
        },
        Z = Y(function (e, n, t) {
            return (
                (o = void 0),
                (i = void 0),
                (y = function () {
                    var o, i, f;
                    return (function (e, n) {
                        var t,
                            r,
                            o,
                            i,
                            a = {
                                label: 0,
                                sent: function () {
                                    if (1 & o[0]) throw o[1];
                                    return o[1];
                                },
                                trys: [],
                                ops: [],
                            };
                        return (
                            (i = { next: c(0), throw: c(1), return: c(2) }),
                            "function" == typeof Symbol &&
                                (i[Symbol.iterator] = function () {
                                    return this;
                                }),
                            i
                        );
                        function c(i) {
                            return function (c) {
                                return (function (i) {
                                    if (t) throw new TypeError("Generator is already executing.");
                                    for (; a; )
                                        try {
                                            if (((t = 1), r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done)) return o;
                                            switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
                                                case 0:
                                                case 1:
                                                    o = i;
                                                    break;
                                                case 4:
                                                    return a.label++, { value: i[1], done: !1 };
                                                case 5:
                                                    a.label++, (r = i[1]), (i = [0]);
                                                    continue;
                                                case 7:
                                                    (i = a.ops.pop()), a.trys.pop();
                                                    continue;
                                                default:
                                                    if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || (6 !== i[0] && 2 !== i[0]))) {
                                                        a = 0;
                                                        continue;
                                                    }
                                                    if (3 === i[0] && (!o || (i[1] > o[0] && i[1] < o[3]))) {
                                                        a.label = i[1];
                                                        break;
                                                    }
                                                    if (6 === i[0] && a.label < o[1]) {
                                                        (a.label = o[1]), (o = i);
                                                        break;
                                                    }
                                                    if (o && a.label < o[2]) {
                                                        (a.label = o[2]), a.ops.push(i);
                                                        break;
                                                    }
                                                    o[2] && a.ops.pop(), a.trys.pop();
                                                    continue;
                                            }
                                            i = n.call(e, a);
                                        } catch (e) {
                                            (i = [6, e]), (r = 0);
                                        } finally {
                                            t = o = 0;
                                        }
                                    if (5 & i[0]) throw i[1];
                                    return { value: i[0] ? i[1] : void 0, done: !0 };
                                })([i, c]);
                            };
                        }
                    })(this, function (y) {
                        var p, v, d;
                        return (
                            (o = n.player),
                            n.paused ||
                                n.lost ||
                                ((t.dropCounter += b(t)),
                                (t.horizontalMovementCounter += b(t)),
                                t.dropCounter > a.DROP_INTERVAL ? ((n.player.y += 1), (i = w(n)) ? (t.lockCounter += b(t)) : (t.dropCounter = 0), i && t.lockCounter > a.LOCK_DELAY && E(n)) : (t.lockCounter = 0),
                                t.dropCounter > a.DROP_KEY_INTERVAL &&
                                    h.keysDown.apply(h, a.controls.DROP) &&
                                    ((t.dropCounter = 0),
                                    (function (e) {
                                        return (e.player.y += 1), (e.score += a.scorePoints.DROP), !w(e) || ((e.score -= a.scorePoints.DROP), !1);
                                    })(n) || ((n.score += a.scorePoints.LANDING), E(n))),
                                t.horizontalMovementCounter > a.HORIZONTAL_MOVEMENT_INTERVAL &&
                                    ((t.horizontalMovementCounter = 0), (f = n.player.x), h.keysDown.apply(h, a.controls.RIGHT) ? (n.player.x += 1) : h.keysDown.apply(h, a.controls.LEFT) && (n.player.x -= 1), A(n) && (n.player.x = f)),
                                n.arena.filter(P).forEach(function (e, t) {
                                    var r, o;
                                    (r = n.arena), (o = n.arena.indexOf(e)), r.splice(o, 1), r.unshift(Array(a.ARENA_WIDTH).fill(0)), (n.score += a.scorePoints.LINECLEAR * Math.pow(2, t));
                                })),
                            n.lost && h.keyDown(h.ANY) && !h.keysDown.apply(h, a.controls.UNDO) && !n.isReloading && ((n.isReloading = !0), r()),
                            !n.lost &&
                                ((v = n.arena), v.slice(0, 3)).some(N) &&
                                ((n.lost = !0),
                                (n.player = o),
                                ((p = n.player).shape = p.shape.map(function (e) {
                                    return e.map(function (e) {
                                        return 0 === e ? e : 8;
                                    });
                                }))),
                            n.score > n.highScore && ((n.highScore = n.score), (d = n.highScore), H(a.storageKeys.chromeStorage.HIGHSCORE, d)),
                            T(n),
                            (function (e) {
                                (e.fillStyle = "#000000"), e.clearRect(0, 0, e.canvas.width, e.canvas.height), e.fillRect(0, 0, e.canvas.width, e.canvas.height);
                            })(e),
                            c(e, n.arena, 0, 0, a.SCALE, j),
                            (e.strokeStyle = "#FF0000"),
                            (e.lineWidth = 2),
                            (function (e, n, t, r, o) {
                                e.beginPath(), e.moveTo(0, t), e.lineTo(r, o), e.stroke();
                            })(e, 0, 3 * a.SCALE, a.ARENA_WIDTH * a.SCALE, 3 * a.SCALE),
                            (e.globalAlpha = Math.max(1 - t.lockCounter / a.LOCK_DELAY, t.lockCounter / a.LOCK_DELAY)),
                            c(e, n.player.shape, n.player.x, n.player.y, a.SCALE, j),
                            (e.globalAlpha = 1),
                            (function (e, n) {
                                u(e, s, a.font.FAMILY, a.font.COLOR), (e.textBaseline = "middle"), (e.textAlign = "center");
                                for (var t = "" + n; e.measureText(t).width > 5.5 * a.SCALE; ) u(e, (s -= 1), a.font.FAMILY, a.font.COLOR);
                                l(e, t, a.SCALE * (a.ARENA_WIDTH / 2), 1.75 * a.SCALE);
                            })(e, n.score),
                            (function (e, n) {
                                u(e, 0.6 * a.SCALE, a.font.FAMILY, a.font.COLOR), (e.textBaseline = "middle"), (e.textAlign = "center"), l(e, "High score: " + n, a.SCALE * (a.ARENA_WIDTH / 2), 4 * a.SCALE);
                            })(e, n.highScore),
                            (function (e, n) {
                                u(e, 0.4 * a.SCALE, a.font.FAMILY, a.font.COLOR), (e.textBaseline = "top"), (e.textAlign = "left"), l(e, "Blocks: " + n, 0.2 * a.SCALE, 0.15 * a.SCALE);
                            })(e, n.piecesPlaced || 0),
                            requestAnimationFrame(function (r) {
                                return Z(
                                    e,
                                    n,
                                    (function (e, n) {
                                        return m(m({}, e), { time: n, lastTime: e.time });
                                    })(t, r)
                                );
                            }),
                            [2]
                        );
                    });
                }),
                new ((f = void 0) || (f = Promise))(function (e, n) {
                    function t(e) {
                        try {
                            a(y.next(e));
                        } catch (e) {
                            n(e);
                        }
                    }
                    function r(e) {
                        try {
                            a(y.throw(e));
                        } catch (e) {
                            n(e);
                        }
                    }
                    function a(n) {
                        var o;
                        n.done
                            ? e(n.value)
                            : ((o = n.value),
                              o instanceof f
                                  ? o
                                  : new f(function (e) {
                                        e(o);
                                    })).then(t, r);
                    }
                    a((y = y.apply(o, i || [])).next());
                })
            );
            var o, i, f, y;
        }, "loop"),
        U = function (n) {
            var state = {
                arena: Array(a.ARENA_HEIGHT)
                    .fill(null)
                    .map(function () {
                        return Array(a.ARENA_WIDTH).fill(0);
                    }),
                piecesDealt: 0,
                piecesPlaced: 0,
                recentPieces: [],
                paused: !1,
                lost: !1,
                isReloading: !1,
                score: 0,
                highScore: n,
            };
            return (state.player = g(state)), resetUndoHistory(state), state;
        },
        Q = function (e) {
            return function () {
                var n = V(J(e, "data-close"));
                null == n || n.toggleAttribute("hidden");
            };
        },
        ee = function () {
            return (
                (ee =
                    Object.assign ||
                    function (e) {
                        for (var n, t = 1, r = arguments.length; t < r; t++) for (var o in (n = arguments[t])) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o]);
                        return e;
                    }),
                ee.apply(this, arguments)
            );
        },
        ne = function (e, n, t, r) {
            return new (t || (t = Promise))(function (o, i) {
                function a(e) {
                    try {
                        u(r.next(e));
                    } catch (e) {
                        i(e);
                    }
                }
                function c(e) {
                    try {
                        u(r.throw(e));
                    } catch (e) {
                        i(e);
                    }
                }
                function u(e) {
                    var n;
                    e.done
                        ? o(e.value)
                        : ((n = e.value),
                          n instanceof t
                              ? n
                              : new t(function (e) {
                                    e(n);
                                })).then(a, c);
                }
                u((r = r.apply(e, n || [])).next());
            });
        },
        te = function (e, n) {
            var t,
                r,
                o,
                i,
                a = {
                    label: 0,
                    sent: function () {
                        if (1 & o[0]) throw o[1];
                        return o[1];
                    },
                    trys: [],
                    ops: [],
                };
            return (
                (i = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                    (i[Symbol.iterator] = function () {
                        return this;
                    }),
                i
            );
            function c(i) {
                return function (c) {
                    return (function (i) {
                        if (t) throw new TypeError("Generator is already executing.");
                        for (; a; )
                            try {
                                if (((t = 1), r && (o = 2 & i[0] ? r.return : i[0] ? r.throw || ((o = r.return) && o.call(r), 0) : r.next) && !(o = o.call(r, i[1])).done)) return o;
                                switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
                                    case 0:
                                    case 1:
                                        o = i;
                                        break;
                                    case 4:
                                        return a.label++, { value: i[1], done: !1 };
                                    case 5:
                                        a.label++, (r = i[1]), (i = [0]);
                                        continue;
                                    case 7:
                                        (i = a.ops.pop()), a.trys.pop();
                                        continue;
                                    default:
                                        if (!((o = (o = a.trys).length > 0 && o[o.length - 1]) || (6 !== i[0] && 2 !== i[0]))) {
                                            a = 0;
                                            continue;
                                        }
                                        if (3 === i[0] && (!o || (i[1] > o[0] && i[1] < o[3]))) {
                                            a.label = i[1];
                                            break;
                                        }
                                        if (6 === i[0] && a.label < o[1]) {
                                            (a.label = o[1]), (o = i);
                                            break;
                                        }
                                        if (o && a.label < o[2]) {
                                            (a.label = o[2]), a.ops.push(i);
                                            break;
                                        }
                                        o[2] && a.ops.pop(), a.trys.pop();
                                        continue;
                                }
                                i = n.call(e, a);
                            } catch (e) {
                                (i = [6, e]), (r = 0);
                            } finally {
                                t = o = 0;
                            }
                        if (5 & i[0]) throw i[1];
                        return { value: i[0] ? i[1] : void 0, done: !0 };
                    })([i, c]);
                };
            }
        },
        re = function (e) {
            return ne(void 0, void 0, void 0, function () {
                var n;
                return te(this, function (t) {
                    return (
                        ((o = "click"),
                        (n = function (e, n) {
                            return (function (e) {
                                return function (n, t) {
                                    return V(n).addEventListener(e, t);
                                };
                            })(o)(e, Y(n, "click{" + e + "}"));
                        }))("button#restart", function () {
                            return (function (e) {
                                (e.lost = !0), T(e), r();
                            })(e);
                        }),
                        n("button#pause", function () {
                            B(e, !e.paused),
                                h.onFirstPress(h.ANY, function () {
                                    return B(e, !1);
                                });
                        }),
                        [2]
                    );
                    var o;
                });
            });
        };
    Y(function () {
        return ne(void 0, void 0, void 0, function () {
            var e, n, t;
            return te(this, function (r) {
                switch (r.label) {
                    case 0:
                        return (
                            (function () {
                                try {
                                    chrome.runtime.connect({ name: "popup" }), console.log("Runtime connected");
                                } catch (e) {
                                    location.href.indexOf("netlify") > 0 || location.href.indexOf("localhost") > 0 || F(e, "connectBackend");
                                }
                            })(),
                            h.initialize(),
                            (e = window.document.querySelector("canvas")),
                            (n = e.getContext("2d")),
                            [
                                4,
                                ne(void 0, void 0, void 0, function () {
                                    var e, n;
                                    return te(this, function (t) {
                                        switch (t.label) {
                                            case 0:
                                                return (e = O(a.storageKeys.localStorage.GAMESTATE)), [4, R(a.storageKeys.chromeStorage.HIGHSCORE).catch(o(0))];
                                            case 1:
                                                return (n = t.sent()), null === e || e.lost ? [2, U(n)] : (loadUndoHistory(e), [2, ee(ee({}, e), { paused: !1 })]);
                                        }
                                    });
                                }),
                            ]
                        );
                    case 1:
                        return (
                            (t = r.sent()),
                            re(t),
                            I()
                                .then(function (e) {
                                    return (t.highScore = e);
                                })
                                .catch(function (e) {
                                    return F(e, "sync");
                                }),
                            0 === t.score &&
                                (void 0 === i && (i = !0),
                                q(!0, i),
                                h.onFirstPress(
                                    h.ANY,
                                    (function (e) {
                                        for (var n = [], t = 1; t < arguments.length; t++) n[t - 1] = arguments[t];
                                        return function () {
                                            return e.apply(void 0, n);
                                        };
                                    })(W)
                                )),
                            (function (e, n) {
                                h.onKeysDown(a.controls.ROTATE, function () {
                                    return (
                                        !n.paused &&
                                        (function (e) {
                                            var n = e.player.x,
                                                t = 0;
                                            for (d(e.player.shape, 1); A(e); )
                                                if (((e.player.x += t), (t = t > 0 ? -t - 1 : 1 - t) > e.player.shape[0].length)) {
                                                    d(e.player.shape, -1), (e.player.x = n);
                                                    break;
                                                }
                                        })(n)
                                    );
                                }),
                                    h.onKeyStart(" ", function () {
                                        return (
                                            !n.paused &&
                                            (function (e) {
                                                var n = 0;
                                                do {
                                                    e.player.y++, n++;
                                                } while (!w(e));
                                                --n > 0 && (e.score += n * a.scorePoints.HARDDROP), E(e, !1);
                                            })(n)
                                        );
                                    }),
                                    h.onKeyStart(a.controls.UNDO[0], function () {
                                        n.paused || undo(n);
                                    }),
                                    requestAnimationFrame(function () {
                                        return Z(e, n, { time: 0, lastTime: 0, dropCounter: 0, lockCounter: 0, horizontalMovementCounter: 0 });
                                    });
                            })(n, t),
                            [2]
                        );
                }
                var i;
            });
        });
    }, "main")();
})();