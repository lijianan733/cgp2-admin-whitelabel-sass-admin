Ext.define("CGP.test.pagecontentpreprocess.PcsPreprocessPanel", {
    extend: "Ext.panel.Panel",
    //title: i18n.getKey(''),
    region: 'center',
    /*    width: '65%',
        minWidth: 250,*/
    state: 'initial',
    itemId: 'pcCompareBuilder',
    //split: true,
    //collapsible: true,
    initComponent: function () {
        var vm = this;
        window.canvasData = {
            "pens": [
                {
                    "type": 0,
                    "rect": {
                        "x": 34,
                        "y": 220,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 134,
                            "y": 270
                        },
                        "ex": 234,
                        "ey": 320
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "5215d98",
                    "name": "pcsCompOneAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "数据1",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "clazz": "rtObjectSource"
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 234,
                            "y": 270,
                            "direction": 2
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 234,
                            "y": 270,
                            "direction": 2
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 124,
                        "y": 230,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 174,
                            "y": 270
                        },
                        "ex": 224,
                        "ey": 310
                    },
                    "fullTextRect": {
                        "x": 44,
                        "y": 230,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 134,
                            "y": 270
                        },
                        "ex": 224,
                        "ey": 310
                    },
                    "iconRect": {
                        "x": 34,
                        "y": 220,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 74,
                            "y": 260
                        },
                        "ex": 114,
                        "ey": 300
                    },
                    "fullIconRect": {
                        "x": 44,
                        "y": 230,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 134,
                            "y": 270
                        },
                        "ex": 224,
                        "ey": 310
                    },
                    "elementRendered": false,
                    "TID": "41ba434",
                    "dockWatchers": [
                        {
                            "x": 134,
                            "y": 270
                        },
                        {
                            "x": 148,
                            "y": 356
                        },
                        {
                            "x": 348,
                            "y": 356
                        },
                        {
                            "x": 348,
                            "y": 456
                        },
                        {
                            "x": 148,
                            "y": 456
                        }
                    ],
                    "haveOut": true,
                    "haveIn": false
                },
                {
                    "type": 0,
                    "rect": {
                        "x": 34,
                        "y": 555,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 134,
                            "y": 605
                        },
                        "ex": 234,
                        "ey": 655
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "2cab901c",
                    "name": "pcsCompOneAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "数据2",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "clazz": "rtObjectSource"
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 234,
                            "y": 605,
                            "direction": 2
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 234,
                            "y": 605,
                            "direction": 2
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 124,
                        "y": 565,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 174,
                            "y": 605
                        },
                        "ex": 224,
                        "ey": 645
                    },
                    "fullTextRect": {
                        "x": 44,
                        "y": 565,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 134,
                            "y": 605
                        },
                        "ex": 224,
                        "ey": 645
                    },
                    "iconRect": {
                        "x": 34,
                        "y": 555,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 74,
                            "y": 595
                        },
                        "ex": 114,
                        "ey": 635
                    },
                    "fullIconRect": {
                        "x": 44,
                        "y": 565,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 134,
                            "y": 605
                        },
                        "ex": 224,
                        "ey": 645
                    },
                    "elementRendered": false,
                    "TID": "41ba434",
                    "dockWatchers": [
                        {
                            "x": 134,
                            "y": 605
                        },
                        {
                            "x": 130,
                            "y": 620
                        },
                        {
                            "x": 330,
                            "y": 620
                        },
                        {
                            "x": 330,
                            "y": 720
                        },
                        {
                            "x": 130,
                            "y": 720
                        }
                    ],
                    "haveOut": true,
                    "haveIn": false
                },
                {
                    "type": 0,
                    "rect": {
                        "x": 556,
                        "y": 455,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 656,
                            "y": 505
                        },
                        "ex": 756,
                        "ey": 555
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "3bfc3d52",
                    "name": "pcsCompMoreAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "Topology",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "expression": "",
                        "clazz": "calculation",
                        "args": [
                            {
                                "clazz": "rtObjectSource"
                            },
                            {
                                "clazz": "rtObjectSource"
                            }
                        ]
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 556,
                            "y": 505,
                            "direction": 4
                        },
                        {
                            "x": 656,
                            "y": 455,
                            "direction": 1
                        },
                        {
                            "x": 756,
                            "y": 505,
                            "direction": 2
                        },
                        {
                            "x": 656,
                            "y": 555,
                            "direction": 3
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 556,
                            "y": 505,
                            "direction": 4
                        },
                        {
                            "x": 656,
                            "y": 455,
                            "direction": 1
                        },
                        {
                            "x": 756,
                            "y": 505,
                            "direction": 2
                        },
                        {
                            "x": 656,
                            "y": 555,
                            "direction": 3
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 646,
                        "y": 465,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 696,
                            "y": 505
                        },
                        "ex": 746,
                        "ey": 545
                    },
                    "fullTextRect": {
                        "x": 566,
                        "y": 465,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 656,
                            "y": 505
                        },
                        "ex": 746,
                        "ey": 545
                    },
                    "iconRect": {
                        "x": 566,
                        "y": 465,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 606,
                            "y": 505
                        },
                        "ex": 646,
                        "ey": 545
                    },
                    "fullIconRect": {
                        "x": 566,
                        "y": 465,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 656,
                            "y": 505
                        },
                        "ex": 746,
                        "ey": 545
                    },
                    "elementRendered": false,
                    "TID": "41ba434",
                    "dockWatchers": [
                        {
                            "x": 656,
                            "y": 505
                        },
                        {
                            "x": 556,
                            "y": 455
                        },
                        {
                            "x": 756,
                            "y": 455
                        },
                        {
                            "x": 756,
                            "y": 555
                        },
                        {
                            "x": 556,
                            "y": 555
                        }
                    ],
                    "haveOut": true,
                    "haveIn": true
                },
                {
                    "type": 0,
                    "rect": {
                        "x": 909,
                        "y": 653,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 1009,
                            "y": 703
                        },
                        "ex": 1109,
                        "ey": 753
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "5deedd05",
                    "name": "pcsCompMoreAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "Topology",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "selector": "",
                        "operationType": "",
                        "valueType": "",
                        "clazz": "placeholder",
                        "template": {
                            "expression": "",
                            "clazz": "calculation",
                            "args": [
                                {
                                    "clazz": "rtObjectSource"
                                },
                                {
                                    "clazz": "rtObjectSource"
                                }
                            ]
                        },
                        "value": {
                            "clazz": "flowGridSource"
                        }
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 909,
                            "y": 703,
                            "direction": 4
                        },
                        {
                            "x": 1009,
                            "y": 653,
                            "direction": 1
                        },
                        {
                            "x": 1109,
                            "y": 703,
                            "direction": 2
                        },
                        {
                            "x": 1009,
                            "y": 753,
                            "direction": 3
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 909,
                            "y": 703,
                            "direction": 4
                        },
                        {
                            "x": 1009,
                            "y": 653,
                            "direction": 1
                        },
                        {
                            "x": 1109,
                            "y": 703,
                            "direction": 2
                        },
                        {
                            "x": 1009,
                            "y": 753,
                            "direction": 3
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 999,
                        "y": 663,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 1049,
                            "y": 703
                        },
                        "ex": 1099,
                        "ey": 743
                    },
                    "fullTextRect": {
                        "x": 919,
                        "y": 663,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 1009,
                            "y": 703
                        },
                        "ex": 1099,
                        "ey": 743
                    },
                    "iconRect": {
                        "x": 919,
                        "y": 663,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 959,
                            "y": 703
                        },
                        "ex": 999,
                        "ey": 743
                    },
                    "fullIconRect": {
                        "x": 919,
                        "y": 663,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 1009,
                            "y": 703
                        },
                        "ex": 1099,
                        "ey": 743
                    },
                    "elementRendered": false,
                    "TID": "41ba434",
                    "haveOut": false,
                    "haveIn": true,
                    "dockWatchers": [
                        {
                            "x": 1009,
                            "y": 703
                        },
                        {
                            "x": 909,
                            "y": 653
                        },
                        {
                            "x": 1109,
                            "y": 653
                        },
                        {
                            "x": 1109,
                            "y": 753
                        },
                        {
                            "x": 909,
                            "y": 753
                        }
                    ]
                },
                {
                    "type": 1,
                    "rect": {
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": 0,
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "ex": 0,
                        "ey": 0
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "background": "#fff"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "5a173d",
                    "name": "polyline",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "template",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "visible": true,
                    "data": "",
                    "controlPoints": [
                        {
                            "x": 882,
                            "y": 505,
                            "direction": 2,
                            "anchorIndex": 2,
                            "id": "3bfc3d52"
                        },
                        {
                            "x": 1009,
                            "y": 505
                        },
                        {
                            "x": 1009,
                            "y": 579,
                            "direction": 1,
                            "anchorIndex": 1,
                            "id": "5deedd05"
                        }
                    ],
                    "fromArrowSize": 5,
                    "toArrowSize": 5,
                    "borderWidth": 0,
                    "borderColor": "#000000",
                    "animateColor": "",
                    "animateSpan": 1,
                    "animatePos": 0,
                    "isAnimate": false,
                    "animateFromSize": 0,
                    "animateToSize": 0,
                    "animateDotSize": 3,
                    "from": {
                        "x": 756,
                        "y": 505,
                        "direction": 2,
                        "anchorIndex": 2,
                        "id": "3bfc3d52"
                    },
                    "to": {
                        "x": 1009,
                        "y": 653,
                        "direction": 1,
                        "anchorIndex": 1,
                        "id": "5deedd05"
                    },
                    "fromArrow": "",
                    "toArrow": "triangleSolid",
                    "textRect": {
                        "x": 819,
                        "y": 496,
                        "width": 253,
                        "height": 18,
                        "center": {
                            "x": 945.5,
                            "y": 505
                        },
                        "ex": 1072,
                        "ey": 514
                    },
                    "TID": "41ba434",
                    "bkType": 0,
                    "imageAlign": "center"
                },
                {
                    "type": 0,
                    "rect": {
                        "x": 473,
                        "y": 865,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 573,
                            "y": 915
                        },
                        "ex": 673,
                        "ey": 965
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "fa813eb",
                    "name": "pcsCompOneAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "Topology",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "clazz": "flowGridSource"
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 673,
                            "y": 915,
                            "direction": 2
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 673,
                            "y": 915,
                            "direction": 2
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 563,
                        "y": 875,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 613,
                            "y": 915
                        },
                        "ex": 663,
                        "ey": 955
                    },
                    "fullTextRect": {
                        "x": 483,
                        "y": 875,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 573,
                            "y": 915
                        },
                        "ex": 663,
                        "ey": 955
                    },
                    "iconRect": {
                        "x": 473,
                        "y": 865,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 513,
                            "y": 905
                        },
                        "ex": 553,
                        "ey": 945
                    },
                    "fullIconRect": {
                        "x": 483,
                        "y": 875,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 573,
                            "y": 915
                        },
                        "ex": 663,
                        "ey": 955
                    },
                    "elementRendered": false,
                    "TID": "41ba434",
                    "haveOut": true,
                    "haveIn": false,
                    "dockWatchers": [
                        {
                            "x": 573,
                            "y": 915
                        },
                        {
                            "x": 473,
                            "y": 865
                        },
                        {
                            "x": 673,
                            "y": 865
                        },
                        {
                            "x": 673,
                            "y": 965
                        },
                        {
                            "x": 473,
                            "y": 965
                        }
                    ]
                },
                {
                    "type": 1,
                    "rect": {
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": 0,
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "ex": 0,
                        "ey": 0
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "background": "#fff"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "6a6c024d",
                    "name": "polyline",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "value",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "visible": true,
                    "data": "",
                    "controlPoints": [
                        {
                            "x": 841,
                            "y": 915,
                            "direction": 2,
                            "anchorIndex": 0,
                            "id": "fa813eb"
                        },
                        {
                            "x": 1009,
                            "y": 915
                        },
                        {
                            "x": 1009,
                            "y": 834,
                            "direction": 3,
                            "anchorIndex": 3,
                            "id": "5deedd05"
                        }
                    ],
                    "fromArrowSize": 5,
                    "toArrowSize": 5,
                    "borderWidth": 0,
                    "borderColor": "#000000",
                    "animateColor": "",
                    "animateSpan": 1,
                    "animatePos": 0,
                    "isAnimate": false,
                    "animateFromSize": 0,
                    "animateToSize": 0,
                    "animateDotSize": 3,
                    "from": {
                        "x": 673,
                        "y": 915,
                        "direction": 2,
                        "anchorIndex": 0,
                        "id": "fa813eb"
                    },
                    "to": {
                        "x": 1009,
                        "y": 753,
                        "direction": 3,
                        "anchorIndex": 3,
                        "id": "5deedd05"
                    },
                    "fromArrow": "",
                    "toArrow": "triangleSolid",
                    "textRect": {
                        "x": 757,
                        "y": 906,
                        "width": 336,
                        "height": 18,
                        "center": {
                            "x": 925,
                            "y": 915
                        },
                        "ex": 1093,
                        "ey": 924
                    },
                    "TID": "41ba434",
                    "bkType": 0,
                    "imageAlign": "center"
                },
                {
                    "type": 0,
                    "rect": {
                        "x": 394,
                        "y": 186,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 494,
                            "y": 236
                        },
                        "ex": 594,
                        "ey": 286
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "fc8e8",
                    "name": "pcsCompMoreAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "参数1",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "key": "",
                        "clazz": "calculationArg",
                        "valueType": ""
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 394,
                            "y": 236,
                            "direction": 4
                        },
                        {
                            "x": 494,
                            "y": 186,
                            "direction": 1
                        },
                        {
                            "x": 594,
                            "y": 236,
                            "direction": 2
                        },
                        {
                            "x": 494,
                            "y": 286,
                            "direction": 3
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 394,
                            "y": 236,
                            "direction": 4
                        },
                        {
                            "x": 494,
                            "y": 186,
                            "direction": 1
                        },
                        {
                            "x": 594,
                            "y": 236,
                            "direction": 2
                        },
                        {
                            "x": 494,
                            "y": 286,
                            "direction": 3
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 484,
                        "y": 196,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 534,
                            "y": 236
                        },
                        "ex": 584,
                        "ey": 276
                    },
                    "fullTextRect": {
                        "x": 404,
                        "y": 196,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 494,
                            "y": 236
                        },
                        "ex": 584,
                        "ey": 276
                    },
                    "iconRect": {
                        "x": 404,
                        "y": 196,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 444,
                            "y": 236
                        },
                        "ex": 484,
                        "ey": 276
                    },
                    "fullIconRect": {
                        "x": 404,
                        "y": 196,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 494,
                            "y": 236
                        },
                        "ex": 584,
                        "ey": 276
                    },
                    "elementRendered": false,
                    "TID": "41ba434",
                    "dockWatchers": [
                        {
                            "x": 494,
                            "y": 236
                        },
                        {
                            "x": 394,
                            "y": 186
                        },
                        {
                            "x": 594,
                            "y": 186
                        },
                        {
                            "x": 594,
                            "y": 286
                        },
                        {
                            "x": 394,
                            "y": 286
                        }
                    ]
                },
                {
                    "type": 1,
                    "rect": {
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": 0,
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "ex": 0,
                        "ey": 0
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "background": "#fff"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "26da786e",
                    "name": "polyline",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "value",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "visible": true,
                    "data": "",
                    "controlPoints": [
                        {
                            "x": 314,
                            "y": 270,
                            "direction": 2,
                            "anchorIndex": 0,
                            "id": "5215d98"
                        },
                        {
                            "x": 314,
                            "y": 236,
                            "direction": 4,
                            "anchorIndex": 0,
                            "id": "fc8e8"
                        }
                    ],
                    "fromArrowSize": 5,
                    "toArrowSize": 5,
                    "borderWidth": 0,
                    "borderColor": "#000000",
                    "animateColor": "",
                    "animateSpan": 1,
                    "animatePos": 0,
                    "isAnimate": false,
                    "animateFromSize": 0,
                    "animateToSize": 0,
                    "animateDotSize": 3,
                    "from": {
                        "x": 234,
                        "y": 270,
                        "direction": 2,
                        "anchorIndex": 0,
                        "id": "5215d98"
                    },
                    "to": {
                        "x": 394,
                        "y": 236,
                        "direction": 4,
                        "anchorIndex": 0,
                        "id": "fc8e8"
                    },
                    "fromArrow": "",
                    "toArrow": "triangleSolid",
                    "textRect": {
                        "x": 234,
                        "y": 244,
                        "width": 160,
                        "height": 18,
                        "center": {
                            "x": 314,
                            "y": 253
                        },
                        "ex": 394,
                        "ey": 262
                    },
                    "TID": "41ba434",
                    "bkType": 0,
                    "imageAlign": "center"
                },
                {
                    "type": 0,
                    "rect": {
                        "x": 348,
                        "y": 570,
                        "width": 200,
                        "height": 100,
                        "center": {
                            "x": 448,
                            "y": 620
                        },
                        "ex": 548,
                        "ey": 670
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "#222",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "59a2bf6b",
                    "name": "pcsCompMoreAnchor",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "参数2",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "animateType": "",
                    "visible": true,
                    "data": {
                        "key": "",
                        "clazz": "calculationArg",
                        "valueType": ""
                    },
                    "zRotate": 0,
                    "anchors": [
                        {
                            "x": 348,
                            "y": 620,
                            "direction": 4
                        },
                        {
                            "x": 448,
                            "y": 570,
                            "direction": 1
                        },
                        {
                            "x": 548,
                            "y": 620,
                            "direction": 2
                        },
                        {
                            "x": 448,
                            "y": 670,
                            "direction": 3
                        }
                    ],
                    "rotatedAnchors": [
                        {
                            "x": 348,
                            "y": 620,
                            "direction": 4
                        },
                        {
                            "x": 448,
                            "y": 570,
                            "direction": 1
                        },
                        {
                            "x": 548,
                            "y": 620,
                            "direction": 2
                        },
                        {
                            "x": 448,
                            "y": 670,
                            "direction": 3
                        }
                    ],
                    "animateDuration": 0,
                    "animateFrames": [],
                    "borderRadius": 0.1,
                    "icon": "?",
                    "iconFamily": "topology",
                    "iconSize": null,
                    "iconColor": "#f17639",
                    "imageAlign": "center",
                    "bkType": 0,
                    "gradientAngle": 0,
                    "gradientRadius": 0.01,
                    "paddingTop": 10,
                    "paddingBottom": 10,
                    "paddingLeft": 10,
                    "paddingRight": 10,
                    "paddingLeftNum": 10,
                    "paddingRightNum": 10,
                    "paddingTopNum": 10,
                    "paddingBottomNum": 10,
                    "textRect": {
                        "x": 438,
                        "y": 580,
                        "width": 100,
                        "height": 80,
                        "center": {
                            "x": 488,
                            "y": 620
                        },
                        "ex": 538,
                        "ey": 660
                    },
                    "fullTextRect": {
                        "x": 358,
                        "y": 580,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 448,
                            "y": 620
                        },
                        "ex": 538,
                        "ey": 660
                    },
                    "iconRect": {
                        "x": 358,
                        "y": 580,
                        "width": 80,
                        "height": 80,
                        "center": {
                            "x": 398,
                            "y": 620
                        },
                        "ex": 438,
                        "ey": 660
                    },
                    "fullIconRect": {
                        "x": 358,
                        "y": 580,
                        "width": 180,
                        "height": 80,
                        "center": {
                            "x": 448,
                            "y": 620
                        },
                        "ex": 538,
                        "ey": 660
                    },
                    "elementRendered": false,
                    "TID": "41ba434"
                },
                {
                    "type": 1,
                    "rect": {
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": 0,
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "ex": 0,
                        "ey": 0
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "background": "#fff"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "939f800",
                    "name": "polyline",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "value",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "visible": true,
                    "data": "",
                    "controlPoints": [
                        {
                            "x": 291,
                            "y": 605,
                            "direction": 2,
                            "anchorIndex": 0,
                            "id": "2cab901c"
                        },
                        {
                            "x": 291,
                            "y": 620,
                            "direction": 4,
                            "anchorIndex": 0,
                            "id": "59a2bf6b"
                        }
                    ],
                    "fromArrowSize": 5,
                    "toArrowSize": 5,
                    "borderWidth": 0,
                    "borderColor": "#000000",
                    "animateColor": "",
                    "animateSpan": 1,
                    "animatePos": 0,
                    "isAnimate": false,
                    "animateFromSize": 0,
                    "animateToSize": 0,
                    "animateDotSize": 3,
                    "from": {
                        "x": 234,
                        "y": 605,
                        "direction": 2,
                        "anchorIndex": 0,
                        "id": "2cab901c"
                    },
                    "to": {
                        "x": 348,
                        "y": 620,
                        "direction": 4,
                        "anchorIndex": 0,
                        "id": "59a2bf6b"
                    },
                    "fromArrow": "",
                    "toArrow": "triangleSolid",
                    "textRect": {
                        "x": 234,
                        "y": 603.5,
                        "width": 114,
                        "height": 18,
                        "center": {
                            "x": 291,
                            "y": 612.5
                        },
                        "ex": 348,
                        "ey": 621.5
                    },
                    "TID": "41ba434",
                    "bkType": 0,
                    "imageAlign": "center"
                },
                {
                    "type": 1,
                    "rect": {
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": 0,
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "ex": 0,
                        "ey": 0
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "background": "#fff"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "4d7f022",
                    "name": "polyline",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "arg",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "visible": true,
                    "data": "",
                    "controlPoints": [
                        {
                            "x": 625,
                            "y": 236,
                            "direction": 2,
                            "anchorIndex": 2,
                            "id": "fc8e8"
                        },
                        {
                            "x": 656,
                            "y": 236
                        },
                        {
                            "x": 656,
                            "y": 346,
                            "direction": 1,
                            "anchorIndex": 1,
                            "id": "3bfc3d52"
                        }
                    ],
                    "fromArrowSize": 5,
                    "toArrowSize": 5,
                    "borderWidth": 0,
                    "borderColor": "#000000",
                    "animateColor": "",
                    "animateSpan": 1,
                    "animatePos": 0,
                    "isAnimate": false,
                    "animateFromSize": 0,
                    "animateToSize": 0,
                    "animateDotSize": 3,
                    "from": {
                        "x": 594,
                        "y": 236,
                        "direction": 2,
                        "anchorIndex": 2,
                        "id": "fc8e8"
                    },
                    "to": {
                        "x": 656,
                        "y": 455,
                        "direction": 1,
                        "anchorIndex": 1,
                        "id": "3bfc3d52"
                    },
                    "fromArrow": "",
                    "toArrow": "triangleSolid",
                    "textRect": {
                        "x": 590.5,
                        "y": 227,
                        "width": 100,
                        "height": 18,
                        "center": {
                            "x": 640.5,
                            "y": 236
                        },
                        "ex": 690.5,
                        "ey": 245
                    },
                    "TID": "41ba434",
                    "bkType": 0,
                    "imageAlign": "center"
                },
                {
                    "type": 1,
                    "rect": {
                        "x": 0,
                        "y": 0,
                        "width": 0,
                        "height": 0,
                        "center": {
                            "x": 0,
                            "y": 0
                        },
                        "ex": 0,
                        "ey": 0
                    },
                    "lineWidth": 1,
                    "rotate": 0,
                    "offsetRotate": 0,
                    "globalAlpha": 1,
                    "dash": 0,
                    "strokeStyle": "#222",
                    "fillStyle": "",
                    "font": {
                        "color": "",
                        "fontFamily": "\"Hiragino Sans GB\", \"Microsoft YaHei\", \"Helvetica Neue\", Helvetica, Arial",
                        "fontSize": 12,
                        "lineHeight": 1.5,
                        "fontStyle": "normal",
                        "fontWeight": "normal",
                        "textAlign": "center",
                        "textBaseline": "middle",
                        "background": "#fff"
                    },
                    "animateCycleIndex": 0,
                    "events": [],
                    "eventFns": ["link", "doAnimate", "doFn", "doWindowFn"],
                    "id": "e379934",
                    "name": "polyline",
                    "tags": [],
                    "lineDashOffset": 0,
                    "text": "arg",
                    "textOffsetX": 0,
                    "textOffsetY": 0,
                    "visible": true,
                    "data": "",
                    "controlPoints": [
                        {
                            "x": 602,
                            "y": 620,
                            "direction": 2,
                            "anchorIndex": 2,
                            "id": "59a2bf6b"
                        },
                        {
                            "x": 656,
                            "y": 620
                        },
                        {
                            "x": 656,
                            "y": 587,
                            "direction": 3,
                            "anchorIndex": 3,
                            "id": "3bfc3d52"
                        }
                    ],
                    "fromArrowSize": 5,
                    "toArrowSize": 5,
                    "borderWidth": 0,
                    "borderColor": "#000000",
                    "animateColor": "",
                    "animateSpan": 1,
                    "animatePos": 0,
                    "isAnimate": false,
                    "animateFromSize": 0,
                    "animateToSize": 0,
                    "animateDotSize": 3,
                    "from": {
                        "x": 548,
                        "y": 620,
                        "direction": 2,
                        "anchorIndex": 2,
                        "id": "59a2bf6b"
                    },
                    "to": {
                        "x": 656,
                        "y": 555,
                        "direction": 3,
                        "anchorIndex": 3,
                        "id": "3bfc3d52"
                    },
                    "fromArrow": "",
                    "toArrow": "triangleSolid",
                    "textRect": {
                        "x": 575,
                        "y": 611,
                        "width": 108,
                        "height": 18,
                        "center": {
                            "x": 629,
                            "y": 620
                        },
                        "ex": 683,
                        "ey": 629
                    },
                    "TID": "41ba434",
                    "bkType": 0,
                    "imageAlign": "center"
                }
            ],
            "lineName": "polyline",
            "fromArrowType": "",
            "toArrowType": "triangleSolid",
            "scale": 1,
            "locked": 0,
            "mqttOptions": {
                "clientId": "3e39722a"
            },
            "data": ""
        };
        vm.html = '<iframe id="tabs_iframe_' + 'pcCompare' + '" src="' +/*location.origin*/'https://dev-sz-qpson-nginx.qppdev.com/pcs-preprocess/' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>';
        //me.items = [];
        var iwindow;

        vm.listeners = {
            afterrender: function () {
                iwindow = window.frames['tabs_iframe_pcCompare'];
                vm.getCanvasData = function () {
                    //vm.testData = top.buidlerCompareData;
                    if (iwindow) {
                        if (iwindow.contentWindow) {
                            iwindow.contentWindow.getCanvasData();
                        }
                    }

                };

                vm.saveImagePng = function () {
                    if (iwindow) {
                        if (iwindow.contentWindow) {
                            iwindow.contentWindow.saveCanvasPng();
                        }
                    }
                };

                vm.saveCanvasJson = function () {
                    if (iwindow) {
                        if (iwindow.contentWindow) {
                            iwindow.contentWindow.saveCanvasJson();
                        }
                    }
                };
            }
        };

        vm.tbar = [
            {
                text: '保存',
                //disabled: true,
                handler: function () {
                    vm.getCanvasData()
                }
            },
            {
                text: '下载图片',
                //disabled: true,
                handler: function () {
                    vm.saveImagePng()
                }
            }/*,{
                text: '保存json',
                //disabled: true,
                handler: function () {
                    vm.saveCanvasJson()
                }
            }*/
        ]
        vm.callParent(arguments);
        //vm.mask = vm.setLoading('请选择PC!');
    },
    refreshData: function () {
        var me = this;
        //me.mask.hide();
        var toolbar = me.down('toolbar');
        Ext.each(toolbar.items.items, function (item) {
            item.setDisabled(false);
        });
        //me.testData = top.buidlerCompareData;
        me.pcUpdate();
        /*if(me.state == 'initial'){*/
        //me.update('<iframe id="tabs_iframe_' + 'pcCompare' + '" src="' +'https://dev-sz-qpson-nginx.qppdev.com/whitelabel-site/h5builder/builder-page-test/index.html' + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>')
        //}
    },
    transform: function (data) {
        var lines = [];
        var nodes = [];
        var tipMsgs = '';
        data.pens.forEach((item, idx, array) => {
            if (item.type === 0) {
                item.haveOut = false;
                item.haveIn = false;
                if (item.data.clazz === 'calculation') {
                    item.data.args = [];
                }
                nodes.push(item);
            } else if (item.type === 1) {
                lines.push(item);
            }
        });
        lines.forEach((line, idx, array) => {
            const inNode = nodes.find(function (node) {
                return node.id === line.to.id;
            });
            const outNode = nodes.find(function (node) {
                return node.id === line.from.id;
            });
            inNode.haveIn = true;
            outNode.haveOut = true;
            if (line.text === 'arg') {
                if (inNode.data.clazz === 'calculation') {
                    inNode.data.args.push(outNode.data);
                } else {
                    inNode.data.args = [];
                }
            } else {
                inNode.data[line.text] = outNode.data;
                delete inNode.data.args;
            }
        });
        let orignalNode = {};
        nodes.forEach((node, idx, array) => {
            tipMsgs += me.afterVerify(node.data, '', node.text);
            if (node.haveIn === true && node.haveOut === false) {
                orignalNode = node.data;
            }
        });
        if (tipMsgs !== '') {
            alert(tipMsgs);
        } else {
            alert('保存成功！');
        }
        console.log(orignalNode);

    },
    afterVerify: function (data, tipMsg, description) {
        if (data.clazz === 'calculation') {

            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + ')' + '存在错误关联: value' + '\n';
                delete data.value;
            }

            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
        } else if (data.clazz === 'placeholder') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args
            }
        } else if (data.clazz === 'calculationArg') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args
            }
            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
        } else if (data.clazz === 'svgSource' || data.clazz === 'simpleFlowGrid' || data.clazz === 'rtObjectSource' || data.clazz === 'flowGridSource') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + ')' + '存在错误关联: value' + '\n';
                delete data.value;
            }

            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
        } else if (data.clazz === 'jsonSelector') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('value')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: value' + '\n';
                delete data.value;
            }
        } else if (data.clazz === 'repeat') {
            if (data.hasOwnProperty('args')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: arg' + '\n';
                delete data.args;
            }
            if (data.hasOwnProperty('template')) {
                tipMsg += '类型:' + data.clazz + '(' + description + '),' + '存在错误关联: template' + '\n';
                delete data.template;
            }
        }
        return tipMsg;
    }


});