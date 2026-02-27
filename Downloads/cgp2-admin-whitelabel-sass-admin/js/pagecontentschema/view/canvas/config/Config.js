/**
 * Created by nan on 2021/4/29
 */
Ext.define('CGP.pagecontentschema.view.canvas.config.Config', {
    statics: {
        //单图约束
        constraint1: {
            "clazz": "CanvasConstraint",
            "elements": [
                {
                    "priority": 1,
                    "filter": {
                        "clazz": "ClassCanvasElementFilter",
                        "isInclude": true,
                        "className": "Picture"
                    },
                    "clazz": "CanvasConstraintElement"
                }
            ],
            "rules": [
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$EDIT"
                }
            ]
        },
        //多文本约束
        constraint2: {
            "clazz": "CanvasConstraint",
            "elements": [
                {
                    "priority": 2,
                    "filter": {
                        "clazz": "ClassCanvasElementFilter",
                        "isInclude": true,
                        "className": "MultiLineText"
                    },
                    "clazz": "CanvasConstraintElement"
                }
            ],
            "rules": [
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$EDIT"
                },
                {
                    "clazz": "ContinuousItemQtyConstraintRule",
                    "minValue": 0,
                    "isEqualToMin": true
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$DELETE"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$TRANSFORM"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$DRAG"
                },
                {
                    "clazz": "MoveAreaConstraintRule",
                    "areaShape": {
                        "clazz": "Rectangle",
                        "x": 0,
                        "y": 0,
                        "width": 39,
                        "height": 39,
                        "_id": "17121258"
                    },
                    "elementBound": "BBOX"
                }
            ]
        },
        //自由元素约束-Picture约束
        constraint3: {
            "clazz": "CanvasConstraint",
            "elements": [
                {
                    "priority": 1,
                    "filter": {
                        "clazz": "ClassCanvasElementFilter",
                        "isInclude": true,
                        "className": "Picture"
                    },
                    "clazz": "CanvasConstraintElement"
                }
            ],
            "rules": [
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$EDIT"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$DELETE"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$TRANSFORM"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$DRAG"
                },
                {
                    "clazz": "ContinuousItemQtyConstraintRule",
                    "minValue": 0,
                    "isEqualToMin": true
                },
                {
                    "clazz": "MoveAreaConstraintRule",
                    "areaShape": {
                        "clazz": "Rectangle",
                        "x": 0,
                        "y": 0,
                        "width": 811,
                        "height": 631,
                        "_id": 20342238
                    },
                    "elementBound": "BBOX"
                }
            ]
        },
        //自由元素约束-文本约束
        constraint4: {
            "clazz": "CanvasConstraint",
            "elements": [
                {
                    "priority": 2,
                    "filter": {
                        "clazz": "ClassCanvasElementFilter",
                        "isInclude": true,
                        "className": "MultiLineText"
                    },
                    "clazz": "CanvasConstraintElement"
                }
            ],
            "rules": [
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$EDIT"
                },
                {
                    "clazz": "ContinuousItemQtyConstraintRule",
                    "minValue": 0,
                    "isEqualToMin": true
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$DELETE"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$TRANSFORM"
                },
                {
                    "clazz": "ElementActionConstraintRule",
                    "value": {
                        "rtType": {
                            "clazz": "com.qpp.cgp.domain.bom.attribute.RtType",
                            "_id": "10591343"
                        },
                        "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
                        "objectJSON": {
                            "enable": true,
                            "clazz": "EnableRtType"
                        }
                    },
                    "key": "ENABLE$DRAG"
                },
                {
                    "clazz": "MoveAreaConstraintRule",
                    "areaShape": {
                        "clazz": "Rectangle",
                        "x": 17,
                        "y": 17,
                        "width": 777,
                        "height": 597,
                        "_id": "17121258"
                    },
                    "elementBound": "BBOX"
                }
            ]
        },
        PcsOperationIntention: [
            {
                value: 'Set',
                display: i18n.getKey('添加/修改 (Set)')
            },
            {
                value: 'Replace',
                display: i18n.getKey('替换 (Replace)')
            },
            {
                value: 'Add',
                display: i18n.getKey('添加 (Add)')
            },
            {
                value: 'Modify',
                display: i18n.getKey('修改 (Modify)')
            },
        ]
    }
})