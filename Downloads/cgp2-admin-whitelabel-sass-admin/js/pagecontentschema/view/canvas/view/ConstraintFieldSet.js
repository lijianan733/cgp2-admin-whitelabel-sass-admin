/**
 * Created by nan on 2020/8/28.
 */
Ext.Loader.syncRequire([
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectFieldContainer',
    'CGP.pagecontentschema.view.ShapeConfigFieldSet',
    'CGP.pagecontentschema.view.canvas.view.ElementFilter'
])
Ext.define('CGP.pagecontentschema.view.canvas.view.ConstraintFieldSet', {
    extend: 'Ext.ux.form.field.ItemFieldSet',
    alias: 'widget.constraintfieldset',
    data: null,
    listeners: {
        afterrender: function (fieldset) {
            if (fieldset.data) {
                fieldset.setValue(fieldset.data);
            }
        }
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.pagecontentschema.view.canvas.controller.Controller');
        var mapping = {
            'ENABLE$EDIT': '10591343',
            'ENABLE$TRANSFORM': '10591343',
            'ENABLE$DELETE': '10591343',
            'ENABLE$ORDER': '10591343',
            'ENABLE$DRAG': '10591343',
            'ITEMS$QTY_RANGE': '10591405',
            'IMAGE$DPI': '10591405',
            'TRANSFORM$ROTATE': '10591405',
            'TRANSFORM$SCALE': '10591405',
            'TRANSFORM$FLIP': '10591394',
            'TRANSFORM$RESIZE': '22099957',
            'ECT': 'root'
        };
        me.items = [
            {
                xtype: 'textfield',
                name: 'clazz',
                hidden: true,
                itemId: 'clazz',
                value: 'CanvasConstraint'
            },
            {
                name: 'elements',
                xtype: 'gridfieldwithcrud',
                labelAlign: 'top',
                fieldLabel: i18n.getKey('elements'),
                itemId: 'elements',
                allowBlank: false,
                gridConfig: {
                    height: 150,
                    width: '100%',
                    renderTo: JSGetUUID(),
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        data: [],
                        fields: [
                            {
                                name: 'priority',
                                type: 'int'
                            }, {
                                name: 'filter',
                                type: 'object',
                            }, {
                                name: 'clazz',
                                type: 'string',
                                defaultValue: 'CanvasConstraintElement'
                            }
                        ]
                    }),
                    columns: [
                        {
                            text: i18n.getKey('filter'),
                            sortable: false,
                            dataIndex: 'filter',
                            flex: 1,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip=' + value;
                                var resultStr = '';
                                var items = [];
                                for (var i in value) {
                                    items.push({
                                        title: i,
                                        value: value[i]
                                    })
                                }
                                return JSCreateHTMLTable(items);
                            }
                        },
                        {
                            text: i18n.getKey('priority'),
                            dataIndex: 'priority',
                            width: 150,
                            sortable: false
                        }
                    ],
                },
                formItems: [
                    {
                        xtype: 'numberfield',
                        name: 'priority',
                        allowBlank: true,
                        fieldLabel: i18n.getKey('priority'),
                        itemId: 'priority',
                        minValue: 0
                    },
                    {
                        xtype: 'elementfilter',
                        name: 'filter',
                        fieldLabel: i18n.getKey('filter'),
                        itemId: 'filter',
                    }
                ]
            },
            {
                name: 'rules',
                xtype: 'gridfieldwithcrud',
                labelAlign: 'top',
                fieldLabel: i18n.getKey('rules'),
                itemId: 'rules',
                allowBlank: false,
                diyGetValue: function () {
                    var me = this;
                    var dataArr = me.getSubmitValue();
                    var result = [];
                    for (var i = 0; i < dataArr.length; i++) {
                        var data = dataArr[i];
                        if (data.clazz == 'ElementActionConstraintRule') {
                            result.push({
                                clazz: data.clazz,
                                value: data.value,
                                key: data.key
                            })
                        } else if (data.clazz == 'MoveAreaConstraintRule') {
                            result.push({
                                clazz: data.clazz,
                                areaShape: data.areaShape,
                                elementBound: data.elementBound
                            })
                        } else if (data.clazz == 'FixItemQtyConstraintRule') {
                            result.push({
                                clazz: data.clazz,
                                value: data.value
                            })
                        } else if (data.clazz == 'ContinuousItemQtyConstraintRule') {
                            result.push({
                                clazz: data.clazz,
                                maxValue: data.maxValue,
                                minValue: data.minValue,
                                isEqualToMax: data.isEqualToMax,
                                isEqualToMin: data.isEqualToMin
                            })
                        }
                    }
                    return result;

                },
                formConfig: {
                    bodyStyle: 'overflow-x:hidden;overflow-y:auto', //与autoScrol:true不能共存
                    width: 650,
                    minHeight: 250,
                    maxHeight: 550,
                    defaults: {
                        width: 550,
                        labelWidth: 100
                    }
                },
                setValueHandler: function (data) {
                    var win = this;
                    var form = win.getComponent('form');
                    form.items.items.forEach(function (item) {
                        if (item.disabled == false) {
                            if (item.diySetValue) {
                                if (item.itemId == 'rangeValueField') {
                                    item.diySetValue(data);
                                } else {
                                    item.diySetValue(data[item.getName()]);
                                }
                            } else {
                                item.setValue(data[item.getName()]);
                            }
                        }
                    })
                },
                saveHandler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    if (form.isValid()) {
                        var data = {};
                        form.items.items.forEach(function (item) {
                            if (item.disabled == false) {
                                //自定义获取值优先级高于普通getValue
                                if (item.diyGetValue) {
                                    if (item.itemId == 'rangeValueField') {
                                        data = Ext.Object.merge(data, item.diyGetValue());
                                    } else {
                                        data[item.getName()] = item.diyGetValue();
                                    }
                                } else {
                                    data[item.getName()] = item.getValue();
                                }
                            }
                        });
                        if (win.createOrEdit == 'create') {
                            win.outGrid.store.add(data);
                        } else {
                            for (var i in data) {
                                win.record.set(i, data[i]);
                            }
                        }
                        win.close();
                    }
                },
                gridConfig: {
                    height: 350,
                    width: '100%',
                    renderTo: JSGetUUID(),
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        data: [],
                        fields: [
                            {
                                name: 'clazz',
                                type: 'string'
                            }, {
                                name: 'key',
                                type: 'string',
                                useNull: true,
                            }, {
                                name: 'value',
                                type: 'object',
                                useNull: true,
                                convert: function (v, data) {
                                    return v;
                                },
                            }, {
                                name: 'areaShape',
                                type: 'object',
                                useNull: true,
                            }, {
                                name: 'elementBound',
                                type: 'string',
                                useNull: true,
                            }, {
                                //严格模式的话元素的任意部份都不能超出定制区域
                                name: 'isStrictMode',
                                type: 'boolean',
                            }, {
                                name: 'minValue',
                                type: 'number',
                                useNull: true,
                            }, {
                                name: 'maxValue',
                                type: 'number',
                                useNull: true,
                            }, {
                                name: 'isEqualToMin',
                                type: 'boolean',
                                useNull: true,
                            }, {
                                name: 'isEqualToMax',
                                type: 'boolean',
                                useNull: true,
                            },
                        ]
                    }),
                    columns: [
                        {
                            text: i18n.getKey('约束类型'),
                            sortable: false,
                            dataIndex: 'clazz',
                            width: 250,
                            renderer: function (value, metadata, record) {
                                if (value == 'ElementActionConstraintRule') {
                                    return '动作约束' + '(' + record.get('key') + ')';
                                } else if (value == 'MoveAreaConstraintRule') {
                                    return '移动约束';
                                } else if (value == 'FixItemQtyConstraintRule') {
                                    return '固定数量约束';
                                } else {
                                    return '区间数量约束';
                                }
                            }
                        },
                        {
                            text: i18n.getKey('详情'),
                            flex: 1,
                            sortable: false,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                if (record.get('clazz') == 'ElementActionConstraintRule') {
                                    var items = [];
                                    var rtObject = record.get('value').objectJSON;

                                    for (var i in rtObject) {
                                        items.push({
                                            title: i,
                                            value: rtObject[i]
                                        })
                                    }
                                    return JSCreateHTMLTable(items);
                                } else if (record.get('clazz') == 'MoveAreaConstraintRule') {
                                    return {
                                        xtype: 'fieldcontainer',
                                        layout: 'vbox',
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                fieldLabel: i18n.getKey('移动形状'),
                                                value: '<a   href="#" style="color: blue" title="查看物料"  href="#")>areaShape</a>',
                                                listeners: {
                                                    render: function (display) {
                                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                        ela.on("click", function () {
                                                            controller.checkAreaShape(record.get('areaShape'));
                                                        });
                                                    }
                                                }
                                            },
                                            {
                                                xtype: 'displayfield',
                                                fieldLabel: i18n.getKey('isStrictMode'),
                                                value: function () {
                                                    var isStrictMode = record.get('isStrictMode');
                                                    return isStrictMode;
                                                }(),
                                            },
                                            {
                                                xtype: 'displayfield',
                                                fieldLabel: i18n.getKey('元素边界类型'),
                                                value: function () {
                                                    var elementBound = record.get('elementBound');
                                                    return elementBound;
                                                }(),
                                            }
                                        ]
                                    }
                                } else if (record.get('clazz') == 'FixItemQtyConstraintRule') {
                                    return '数量为：' + record.get('value')

                                } else {
                                    var minValue = record.get('minValue');
                                    var maxValue = record.get('maxValue');
                                    var isEqualToMin = record.get('isEqualToMin');
                                    var isEqualToMax = record.get('isEqualToMax');
                                    return '数量范围为:' + (Ext.isEmpty(minValue) ? '' : (minValue + (isEqualToMin ? '<=' : '<'))) + '数量' + (Ext.isEmpty(maxValue) ? '' : ((isEqualToMax ? '<=' : '<') + maxValue));
                                }

                            }
                        }
                    ]
                },
                formItems: [
                    {
                        xtype: 'combo',
                        editable: false,
                        name: 'clazz',
                        itemId: 'clazz',
                        value: 'ElementActionConstraintRule',
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey('type'),
                        mapping: {
                            ElementActionConstraintRule: ['key', 'value'],
                            MoveAreaConstraintRule: ['isStrictMode', 'elementBound', 'areaShape'],
                            FixItemQtyConstraintRule: ['fixValue'],
                            ContinuousItemQtyConstraintRule: [/*'maxValue', 'minValue', 'isEqualToMax', 'isEqualToMin'*/'rangeValueField']
                        },
                        /*
                                                readOnly: true,
                        */
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'ElementActionConstraintRule',
                                    display: '动作约束'
                                },
                                {
                                    value: 'MoveAreaConstraintRule',
                                    display: '移动约束'
                                },
                                {
                                    value: 'FixItemQtyConstraintRule',
                                    display: '固定数量约束'
                                },
                                {
                                    value: 'ContinuousItemQtyConstraintRule',
                                    display: '区间数量约束'
                                }
                            ]
                        }),
                        onTriggerClick: function () {
                            var me = this;
                            if (me.readOnly == true) {
                                return false;
                            }
                            var records = me.ownerCt.ownerCt.gridField.getSubmitValue();
                            var excludeClazz = [];
                            for (var i = 0; i < records.length; i++) {
                                var item = records[i];
                                if (item.clazz == 'MoveAreaConstraintRule') {
                                    excludeClazz.push(item.clazz);
                                } else if (item.clazz == 'FixItemQtyConstraintRule' || item.clazz == 'ContinuousItemQtyConstraintRule') {
                                    excludeClazz.push('FixItemQtyConstraintRule');
                                    excludeClazz.push('ContinuousItemQtyConstraintRule');
                                }
                            }
                            me.store.filterBy(function (item) {
                                if (Ext.Array.contains(excludeClazz, item.get('value'))) {
                                    return false;
                                } else {
                                    return true
                                }
                            });
                            if (me.isExpanded) {
                                me.collapse();
                            } else {
                                me.expand();
                            }
                            me.inputEl.focus();
                        },
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var form = combo.ownerCt;
                                for (var i = 0; i < form.items.items.length; i++) {
                                    var item = form.items.items[i];
                                    if (item.itemId == 'clazz') {
                                    } else {
                                        if (Ext.Array.contains(combo.mapping[newValue], item.itemId)) {
                                            item.show();
                                            item.setDisabled(false);
                                        } else {
                                            item.hide();
                                            item.setDisabled(true);
                                        }
                                    }
                                }
                            },
                            afterrender: function (combo) {
                                var form = combo.ownerCt;
                                if (form.ownerCt.createOrEdit == 'edit') {
                                    combo.setFieldStyle('background-color: silver');
                                    combo.setReadOnly(true);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'combo',
                        name: 'key',
                        editable: false,
                        fieldLabel: i18n.getKey('key'),
                        itemId: 'key',
                        valueField: 'value',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 'ENABLE$EDIT',
                                    display: 'ENABLE$EDIT'
                                }, {
                                    value: 'ENABLE$TRANSFORM',
                                    display: 'ENABLE$TRANSFORM'
                                }, {
                                    value: 'ENABLE$DELETE',
                                    display: 'ENABLE$DELETE'
                                }, {
                                    value: 'ENABLE$DRAG',
                                    display: 'ENABLE$DRAG'
                                }, /*{
                                    value: 'ITEMS$QTY_RANGE',
                                    display: 'ITEMS$QTY_RANGE'
                                },*/ {
                                    value: 'IMAGE$DPI',
                                    display: 'IMAGE$DPI'
                                }, {
                                    value: 'TRANSFORM$ROTATE',
                                    display: 'TRANSFORM$ROTATE'
                                }, {
                                    value: 'TRANSFORM$FLIP',
                                    display: 'TRANSFORM$FLIP'
                                }, {
                                    value: 'TRANSFORM$SCALE',
                                    display: 'TRANSFORM$SCALE'
                                }, {
                                    value: 'TRANSFORM$RESIZE',
                                    display: 'TRANSFORM$RESIZE'
                                },{
                                    value: 'ENABLE$ORDER',
                                    display: 'ENABLE$ORDER'
                                },/*, {
                                    value: 'ECT',
                                    display: 'ECT'
                                }*/
                            ]
                        }),
                        onTriggerClick: function () {
                            var me = this;
                            if (me.readOnly == true) {
                                return false;
                            }
                            var records = me.ownerCt.ownerCt.gridField.getSubmitValue();
                            var excludeClazz = [];
                            for (var i = 0; i < records.length; i++) {
                                var item = records[i];
                                if (item.clazz == 'ElementActionConstraintRule') {
                                    excludeClazz.push(item.key);
                                }
                            }
                            me.store.filterBy(function (item) {
                                if (Ext.Array.contains(excludeClazz, item.get('value'))) {
                                    return false;
                                } else {
                                    return true
                                }
                            });
                            if (me.isExpanded) {
                                me.collapse();
                            } else {
                                me.expand();
                            }
                            me.inputEl.focus();
                        },
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var value = combo.ownerCt.getComponent('value');
                                var rtTypeId = mapping[newValue];
                                if (rtTypeId) {
                                    value.setValue({
                                        rtType: {
                                            _id: rtTypeId,
                                        },
                                        rtObject: {}
                                    });
                                } else {
                                    value.setValue({
                                        rtType: {
                                            _id: rtTypeId
                                        },
                                        rtObject: {}
                                    });
                                }
                            },
                            afterrender: function (combo) {
                                var form = combo.ownerCt;
                                if (form.ownerCt.createOrEdit == 'edit') {
                                    combo.setFieldStyle('background-color: silver');
                                    combo.setReadOnly(true);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'rttypetortobjectfieldcontainer',
                        itemId: 'value',
                        name: 'value',
                        allowBlank: false,
                        maxHeight: 250,
                        rtTypeId: null,
                        hidden: false,
                        disabled: false,
                        fieldLabel: i18n.getKey('objectJSON'),
                        rtTypeAttributeInputFormConfig: {
                            hideRtType: true,
                            maxHeight: 250,
                        }
                    },
                    {
                        xtype: 'checkbox',
                        itemId: 'isStrictMode',
                        name: 'isStrictMode',
                        hidden: true,
                        disabled: true,
                        tipInfo: i18n.getKey('严格模式的话元素的任意部份都不能超出定制区域'),
                        fieldLabel: i18n.getKey('isStrictMode'),
                        id: 'isStrictMode',
                        isDiyShowTip: true,
                        listeners: {
                            afterrender: function () {
                                var tip = Ext.create('Ext.tip.ToolTip', {
                                    target: 'isStrictMode-tipInfoEl',
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
                        valueField: 'value',
                        hidden: true,
                        disabled: true,
                        displayField: 'display',
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
                                }/*, {
                                    value: 'ECT',
                                    display: 'ECT'
                                }*/
                            ]
                        })
                    },
                    {
                        xtype: 'shapeconfigfieldset',
                        margin: '5 25 5 25',
                        name: 'areaShape',
                        hidden: true,
                        disabled: true,
                        itemId: 'areaShape',
                        legendItemConfig: {
                            disabledBtn: {
                                isUsable: true,
                                hidden: true,
                                disabled: true,
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        displayField: 'value',
                        valueField: 'value',
                        fieldLabel: i18n.getKey('value'),
                        name: 'value',
                        hidden: true,
                        disabled: true,
                        itemId: 'fixValue'
                    },
                    {
                        xtype: 'rangevaluefield',
                        itemId: 'rangeValueField',
                        hidden: true,
                        disabled: true,
                        labelAlign: 'left',
                        fieldLabel: i18n.getKey('item数量'),

                    }
                ]
            }
        ];
        me.callParent();
    }
})
