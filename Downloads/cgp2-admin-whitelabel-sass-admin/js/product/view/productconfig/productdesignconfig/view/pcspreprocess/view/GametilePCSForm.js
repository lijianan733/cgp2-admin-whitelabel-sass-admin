/**
 * Created by nan on 2021/5/29
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.ConditionFieldV3',
    'CGP.pagecontentschema.view.ShapeConfigFieldSet',
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.GametilePCSForm', {
        extend: 'Ext.ux.form.ErrorStrickForm',
        alias: 'widget.gametilepcsform',
        defaults: {
            margin: '5 25 0 25',
            width: 350,
            allowBlank: false,
        },
        layout: {
            type: 'table',
            columns: 2
        },
        PMVTId: null,
        recordId: null,
        closable: true,
        autoScroll: true,
        isValidForItems: true,//是否校验时用item.forEach来处理
        pcsConfigData: null,//pcs源数据
        createOrEdit: 'create',
        contentData: null,
        diyGetValue: function () {
            var me = this;
            var result = me.getValue();
            result.condition = '';
            var conditionDto = me.getComponent('conditionDTO');
            result.condition = conditionDto.getExpression();
            return result;
        },
        diySetValue: function () {
            var me = this;
            var result = me.getValue();
            result.condition = '';
            var conditionDto = me.getComponent('conditionDTO');
            result.condition = conditionDto.getExpression();
            return result;
        },
        initComponent: function () {
            var me = this;
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
            me.pcsConfigData = controller.getPCSData(me.PMVTId);
            me.items = [
                {
                    xtype: 'textfield',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    xtype: 'textfield',
                    name: 'clazz',
                    itemId: 'clazz',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig',
                    fieldLabel: i18n.getKey('clazz')
                },
                {
                    xtype: 'conditionfieldv3',
                    name: 'conditionDTO',
                    itemId: 'conditionDTO',
                    fieldLabel: i18n.getKey('condition'),
                    contentData: me.contentData,
                    allowBlank: true,
                },
                {
                    xtype: 'numberfield',
                    name: 'index',
                    itemId: 'index',
                    fieldLabel: i18n.getKey('index')
                },
                {
                    xtype: 'valueexfield',
                    name: 'itemQty',
                    itemId: 'itemQty',
                    fieldLabel: i18n.getKey('循环次数'),
                    commonPartFieldConfig: {
                        expressionConfig: {
                            value: "function expression(args){return args.context['9120809']}//取属性gametiles片数属性值"
                        },
                        defaultValueConfig: {
                            type: 'Number',
                            typeSetReadOnly: true,
                        }
                    }
                },
                {
                    xtype: 'uxfieldcontainer',
                    name: 'itemSize',
                    colspan: 2,
                    itemId: 'itemSize',
                    labelAlign: 'left',
                    fieldLabel: i18n.getKey('cyclic')+i18n.getKey('container')+i18n.getKey('size'),
                    layout: {
                        type: 'hbox',
                    },
                    defaults: {
                        labelWidth: 30,
                        allowBlank: false,
                        margin: '0 0 0 5',
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'width',
                            minValue: 0,
                            flex: 1,
                            itemId: 'width',
                            fieldLabel: i18n.getKey('width')
                        }, {
                            xtype: 'numberfield',
                            name: 'height',
                            minValue: 0,
                            flex: 1,
                            itemId: 'height',
                            fieldLabel: i18n.getKey('height')

                        }, {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            fieldLabel: i18n.getKey('clazz'),
                            value: "com.qpp.cgp.domain.pcspreprocess.operatorconfig.Rectangle"
                        }
                    ],
                },
                {
                    xtype: 'uxfieldset',
                    name: 'layout',
                    itemId: 'layout',
                    colspan: 2,
                    width: 600,
                    title: i18n.getKey('layout'),
                    defaults: {
                        margin: '5 0 5 50',
                        allowBlank: false,
                        width: 500
                    },
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'maxQty',
                            itemId: 'maxQty',
                            width: 225,
                            fieldLabel: i18n.getKey('每行最大数量')
                        },
                        {
                            xtype: 'combo',
                            name: 'arrangeRule',
                            itemId: 'arrangeRule',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            width: 225,
                            fieldLabel: i18n.getKey('arrangeRule'),
                            value: 'LeftToRight',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [
                                    {
                                        display: i18n.getKey('LeftToRight'),
                                        value: 'LeftToRight'
                                    }, {
                                        display: i18n.getKey('RightToLeft'),
                                        value: 'RightToLeft'
                                    }, {
                                        display: i18n.getKey('TopToBottom'),
                                        value: 'TopToBottom'
                                    }, {
                                        display: i18n.getKey('BottomToTop'),
                                        value: 'BottomToTop'
                                    },
                                ]
                            })
                        },
                        {
                            xtype: 'uxfieldset',
                            name: 'margin',
                            minValue: 0,
                            flex: 1,
                            itemId: 'margin',
                            colspan: 2,
                            title: i18n.getKey('margin'),
                            autoScroll: false,
                            layout: {
                                type: 'hbox'
                            },
                            height: 60,
                            defaults: {
                                width: 110,
                                labelWidth: 25,
                                labelAlign: 'right',
                                margin: 5,
                                value: 20,
                                allowBlank: false,
                            },
                            getFieldLabel: function () {
                                return this.title;
                            },
                            getErrors: function () {
                                return '该输入项为必输项';
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'top',
                                    itemId: 'top',
                                    fieldLabel: i18n.getKey('up')
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bottom',
                                    itemId: 'bottom',
                                    fieldLabel: i18n.getKey('down')
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'left',
                                    itemId: 'left',
                                    fieldLabel: i18n.getKey('left')
                                }, {
                                    xtype: 'numberfield',
                                    name: 'right',
                                    itemId: 'right',
                                    fieldLabel: i18n.getKey('right')
                                },
                            ]
                        },
                        {
                            xtype: 'uxfieldset',
                            name: 'padding',
                            minValue: 0,
                            flex: 1,
                            colspan: 2,
                            itemId: 'padding',
                            title: i18n.getKey('padding'),
                            layout: {
                                type: 'hbox'
                            },
                            autoScroll: false,
                            height: 60,
                            getFieldLabel: function () {
                                return this.title;
                            },
                            getErrors: function () {
                                return '该输入项为必输项';
                            },
                            defaults: {
                                width: 110,
                                labelWidth: 25,
                                labelAlign: 'right',
                                margin: 5,
                                value: 10,
                                allowBlank: false,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'top',
                                    itemId: 'top',
                                    fieldLabel: i18n.getKey('up')
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'bottom',
                                    itemId: 'bottom',
                                    fieldLabel: i18n.getKey('down')
                                }, {
                                    xtype: 'numberfield',
                                    name: 'left',
                                    itemId: 'left',
                                    fieldLabel: i18n.getKey('left')
                                }, {
                                    xtype: 'numberfield',
                                    name: 'right',
                                    itemId: 'right',
                                    fieldLabel: i18n.getKey('right')
                                },
                            ]
                        },
                    ]
                },
                {
                    xtype: 'uxfieldset',
                    name: 'design',
                    itemId: 'design',
                    colspan: 2,
                    width: 600,
                    title: i18n.getKey('定制层'),
                    items: [
                        {
                            xtype: 'uxfieldcontainer',
                            name: 'innerContainer',//内层container
                            fieldLabel: i18n.getKey('第二层container'),
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            defaults: {
                                margin: '5 0 5 50',
                                allowBlank: false,
                                width: 500
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('偏移量(x)'),
                                    name: 'x',
                                    width: 225,
                                    labelWidth: 80,
                                    itemId: 'x'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('偏移量(y)'),
                                    name: 'y',
                                    width: 225,
                                    labelWidth: 80,
                                    itemId: 'y'
                                },
                                {
                                    xtype: 'uxfieldset',
                                    name: 'padding',
                                    minValue: 0,
                                    flex: 1,
                                    itemId: 'padding',
                                    title: i18n.getKey('padding'),
                                    height: 60,
                                    colspan: 2,
                                    margin: '5 0 15 50',
                                    autoScroll: false,
                                    layout: {
                                        type: 'hbox'
                                    },
                                    getFieldLabel: function () {
                                        return this.title;
                                    },
                                    getErrors: function () {
                                        return '该输入项为必输项';
                                    },
                                    defaults: {
                                        width: 110,
                                        labelWidth: 25,
                                        labelAlign: 'right',
                                        margin: 5,
                                        value: 10,
                                        allowBlank: false,
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'top',
                                            itemId: 'top',
                                            fieldLabel: i18n.getKey('up')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'bottom',
                                            itemId: 'bottom',
                                            fieldLabel: i18n.getKey('down')
                                        }, {
                                            xtype: 'numberfield',
                                            name: 'left',
                                            itemId: 'left',
                                            fieldLabel: i18n.getKey('left')
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'right',
                                            itemId: 'right',
                                            fieldLabel: i18n.getKey('right')
                                        },
                                    ]
                                },
                                {
                                    name: 'clipPath',
                                    xtype: 'shapeconfigfieldset',
                                    title: i18n.getKey('clipPath'),
                                    itemId: 'clipPath',
                                    labelAlign: 'top',
                                    minHeight: 0,
                                    colspan: 2,
                                    margin: '5 0 30 50',
                                    onlySubProperty: true,
                                    legendItemConfig: {
                                        disabledBtn: {
                                            isUsable: false,
                                            hidden: false,
                                            disabled: false,
                                        }
                                    },
                                }
                            ],
                            getErrors: function () {
                                return '数据必须完备';
                            },
                        },
                        {
                            xtype: 'uxfieldcontainer',
                            name: 'moveAreaConstraintRule',//内层container
                            fieldLabel: i18n.getKey('MoveAreaConstraintRule'),
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            defaults: {
                                margin: '5 0 5 50',
                                allowBlank: false,
                                width: 500
                            },
                            items: [
                                {
                                    xtype: 'hiddenfield',
                                    itemId: 'clazz',
                                    name: 'clazz',
                                    value: 'MoveAreaConstraintRule',
                                },
                                {
                                    xtype: 'checkbox',
                                    itemId: 'isStrictMode',
                                    name: 'isStrictMode',
                                    width: 225,
                                    colspan: 1,
                                    fieldLabel: i18n.getKey('isStrictMode'),
                                    tipInfo: 'true:整个组件都必须在容器内<br>false:整个组件不能全部超出容器',
                                    isDiyShowTip: true,
                                    id: 'isStrictMode2',//不能和另一个组件重复
                                    listeners: {
                                        afterrender: function () {
                                            var tip = Ext.create('Ext.tip.ToolTip', {
                                                target: 'isStrictMode2-tipInfoEl',
                                                items: [
                                                    {
                                                        xtype: 'image',
                                                        width: 500,
                                                        height: 300,
                                                        autoEl: 'div', // wrap in a div
                                                        imgCls: 'imgAutoSize',
                                                        src: imageServer + '56ff45198ba5e4092033b4f52b72ea6d.jpg'
                                                    }
                                                ]
                                            })
                                        }
                                    }
                                },
                                {
                                    xtype: 'combo',
                                    name: 'elementBound',
                                    itemId: 'elementBound',
                                    editable: false,
                                    width: 225,
                                    valueField: 'value',
                                    colspan: 1,
                                    displayField: 'display',
                                    value: 'BBOX',
                                    fieldLabel: i18n.getKey('elementBound'),
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: 'BBOX',
                                                display: 'BBOX '
                                            },
                                            {
                                                value: 'CLIP',
                                                display: 'CLIP(未实现)'
                                            }
                                        ]
                                    })
                                },
                                {
                                    xtype: 'shapeconfigfieldset',
                                    margin: '5 0 30 50',
                                    name: 'areaShape',
                                    colspan: 2,
                                    itemId: 'areaShape',
                                    legendItemConfig: {
                                        disabledBtn: {
                                            isUsable: true,
                                            hidden: true,
                                            disabled: false,
                                        }
                                    }
                                },
                            ],
                            getErrors: function () {
                                return '数据必须完备';
                            },
                        }
                    ]
                },
                {
                    xtype: 'uxfieldset',
                    name: 'display',
                    itemId: 'display',
                    colspan: 2,
                    width: 600,
                    margin: '5 25 25 25',
                    title: i18n.getKey('显示层'),
                    items: [
                        {
                            xtype: 'uxfieldcontainer',
                            name: 'text',
                            itemId: 'text',
                            fieldLabel: i18n.getKey('text'),
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            defaults: {
                                allowBlank: false,
                                margin: '0 0 0 50',
                                width: 225,

                            },
                            getErrors: function () {
                                return '数据必须完备';
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('偏移上一层坐标(x)'),
                                    name: 'x',
                                    labelWidth: 120,
                                    itemId: 'x'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('偏移上一层坐标(y)'),
                                    name: 'y',
                                    labelWidth: 120,
                                    itemId: 'y'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('width'),
                                    name: 'width',
                                    labelWidth: 120,
                                    margin: '5 0 0 50',
                                    itemId: 'width'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('height'),
                                    name: 'height',
                                    labelWidth: 120,
                                    margin: '5 0 0 50',
                                    itemId: 'height'
                                }
                            ]
                        },
                        {
                            xtype: 'uxfieldcontainer',
                            name: 'jsonFilter',
                            itemId: 'jsonFilter',
                            fieldLabel: i18n.getKey('itemsProcess'),
                            margin: '25 0 0 0',
                            defaults: {
                                margin: '5 0 5 50',
                                allowBlank: false,
                                width: 500
                            },
                            getErrors: function () {
                                return '数据必须完备';
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('selector'),
                                    name: 'selector',
                                    itemId: 'selector',
                                    value: '$.items[0].text'
                                },
                                {
                                    xtype: 'valueexfield',
                                    fieldLabel: i18n.getKey('value'),
                                    name: 'value',
                                    itemId: 'value',
                                    value: {
                                        clazz: "com.qpp.cgp.value.ExpressionValueEx",
                                        constraints: [],
                                        expression: {
                                            clazz: "com.qpp.cgp.expression.Expression",
                                            expression: "function expression(input){var itemQty= input.context.itemQty;var titleArray = [];for(var i = 0;i < itemQty;i++){titleArray.push('Tile'+(i+1))}return titleArray}",
                                            expressionEngine: "JavaScript",
                                            inputs: [],
                                            resultType: "Array",
                                        },
                                        type: "Array",
                                    },
                                    commonPartFieldConfig: {
                                        defaultValueConfig: {
                                            type: 'Array',
                                            clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                                            typeSetReadOnly: true,
                                            clazzSetReadOnly: false,
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'uxfieldcontainer',
                            name: 'image',
                            itemId: 'image',
                            fieldLabel: i18n.getKey('image'),
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            margin: '25 0 50 0',
                            defaults: {
                                margin: '5 0 5 50',
                                allowBlank: false,
                                width: 500
                            },
                            getErrors: function () {
                                return '数据必须完备';
                            },
                            items: [
                                {
                                    xtype: 'fileuploadv2',
                                    fieldLabel: i18n.getKey('imageName'),
                                    name: 'imageName',
                                    colspan: 2,
                                    labelWidth: 80,
                                    allowBlank: false,
                                    valueUrlType: 'part',
                                    itemId: 'imageName'
                                }
                            ]
                        }
                    ]
                }
            ];
            me.callParent();
        }
    }
)