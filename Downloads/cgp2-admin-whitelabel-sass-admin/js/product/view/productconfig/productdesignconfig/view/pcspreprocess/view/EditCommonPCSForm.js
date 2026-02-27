/**
 * Created by nan on 2021/5/25
 */

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.EditCommonPCSForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    autoScroll: true,
    createOrEdit: 'create',
    canvasStore: null,
    aaa: 'aaa',
    closable: true,
    defaults: {
        allowBlank: false,
        width: 450,
        margin: '5 25 5 25'
    },
    graphData: {
        "pens": [],
        "lineName": "curve",
        "fromArrowType": "",
        "toArrowType": "triangleSolid",
        "scale": 1,
        "locked": 0,
        "mqttOptions": {
            "clientId": "3e39722a"
        },
        "data": ""
    },
    data: null,
    PMVTId: null,
    recordId: null,
    listeners: {
        afterrender: function () {
            var form = this;
           ;
            var PMVTId = form.PMVTId;
            var recordId = form.recordId;
            form.canvasStore = Ext.create("CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.store.pcsPreprocessStore", {
                PMVTId: PMVTId,
                listeners: {
                    load: {
                        fn: function (store) {
                           ;
                            if (recordId) {
                                var record = store.getById(recordId);
                                form.createOrEdit = 'edit';
                                form.record = record;
                                form.setValue(record.getData());
                            } else {
                                form.createOrEdit = 'create';
                                form.record = null;
                            }
                        },
                        scope: this,
                        single: true
                    }
                }
            })
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            page.builderConfigTab = builderConfigTab;
            form.builderConfigTab = builderConfigTab;
            if (isLock) {
                JSLockConfig(page);
            }
        }
    },
    pcsConfigData: null,//PCS源数据
    setValue: function (data) {
        var me = this;
        me.data = data;
        for (var i = 0; i < me.items.items.length; i++) {
            if (!Ext.isEmpty(data.graphData)) {
                me.graphData = data.graphData;
            }
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled == false) {
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else if (item.getValue) {
                    result[item.getName()] = item.getValue();
                }
            }
        }
        result.graphData = me.graphData;
        return Ext.Object.merge(me.data || {}, result);

    },
    initComponent: function () {
        var me = this;
        var recordId = me.recordId;
        var PMVTId = me.PMVTId;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        me.pcsConfigData = controller.getPCSData(me.PMVTId);
        me.items = [
            {
                name: '_id',
                xtype: 'textfield',
                fieldStyle: 'background-color:silver',
                hidden: true,
                value: !Ext.isEmpty(recordId) ? recordId : JSGetCommonKey(false),
                readOnly: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id',
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                xtype: 'valueexfield',
                name: 'condition',
                itemId: 'condition',
                allowBlank: true,
                fieldLabel: i18n.getKey('condition'),
                commonPartFieldConfig: {
                    uxTextareaContextData: true,
                    defaultValueConfig: {
                        type: 'Boolean',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false

                    }
                },
                tipInfo: 'condition'
            },
            {
                name: 'clazz',
                xtype: 'combo',
                fieldLabel: i18n.getKey('selector') + i18n.getKey('type'),
                itemId: 'clazz',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSPreprocessPlaceholderConfig',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSPreprocessPlaceholderConfig',
                            display: i18n.getKey('单选择器')
                        },
                        {
                            value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.ManySelectorPlaceholderConfig',
                            display: i18n.getKey('多选择器')
                        },
                        {
                            value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CycleSelectorPlaceholderConfig',
                            display: i18n.getKey('动态选择器')
                        }
                    ]
                }),
                mapping: {
                    'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSPreprocessPlaceholderConfig': ['singleSelector'],
                    'com.qpp.cgp.domain.pcspreprocess.operatorconfig.ManySelectorPlaceholderConfig': ['multiSelector'],
                    'com.qpp.cgp.domain.pcspreprocess.operatorconfig.CycleSelectorPlaceholderConfig': ['cycleNumber', 'calculateSelector']
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var singleSelector = combo.ownerCt.getComponent('singleSelector');
                        var multiSelector = combo.ownerCt.getComponent('multiSelector');
                        var cycleNumber = combo.ownerCt.getComponent('cycleNumber');
                        var calculateSelector = combo.ownerCt.getComponent('calculateSelector');
                        var componentArr = [singleSelector, multiSelector, cycleNumber, calculateSelector];
                        for (var i = 0; i < componentArr.length; i++) {
                            var item = componentArr[i];
                            if (Ext.Array.contains(combo.mapping[newValue], item.getItemId())) {
                                item.show();
                                item.setDisabled(false);
                            } else {
                                item.hide();
                                item.setDisabled(true);
                            }
                        }
                    }
                }
            },
            {
                name: 'selector',
                xtype: 'jsonpathselector',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'singleSelector',
                rawData: me.pcsConfigData
            },
            {
                name: 'selectors',
                xtype: 'gridfieldwithcrud',
                fieldLabel: i18n.getKey('selector'),
                itemId: 'multiSelector',
                hidden: true,
                disabled: true,
                gridConfig: {
                    width: 350,
                    height: 150,
                    maxHeight: 300,
                    minHeight: 150,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'path', type: 'string'},
                        ],
                        data: []
                    }),
                    columns: [
                        {
                            dataIndex: 'path',
                            flex: 1,
                            text: i18n.getKey('path'),
                            renderer: function (value, mateData, record) {
                                return JSAutoWordWrapStr(value);
                            }
                        }
                    ],
                },
                allowBlank: true,
                formConfig: {
                    isValidForItems: true,//是否校验时用item.forEach来处理
                },
                formItems: [
                    {
                        name: 'path',
                        width: 450,
                        xtype: 'jsonpathselector',
                        fieldLabel: i18n.getKey('jsonPath'),
                        itemId: 'path',
                        rawData: me.pcsConfigData
                    },
                ],
                diySetValue: function (data) {
                    var me = this;
                    var result = [];
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            result.push({
                                path: data[i],
                            })
                        }
                    }
                    me.setSubmitValue(result);
                },
                diyGetValue: function () {
                    var me = this;
                    var data = me.getSubmitValue();
                    var result = [];
                    if (data && data.length > 0) {
                        for (var i = 0; i < data.length; i++) {
                            result.push(data[i].path);
                        }
                    }
                    return result;
                }
            },
            {
                name: 'cycleNumber',
                xtype: 'valueexfield',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('cycleNumber'),
                itemId: 'cycleNumber',
                commonPartFieldConfig: {
                    defaultValueConfig: {
                        type: 'Number',
                        typeSetReadOnly: true,
                    },
                    expressionConfig: {
                        value: 'function expression(args){return 15;}'
                    }
                },
            },
            {
                name: 'calculateSelector',
                xtype: 'valueexfield',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('selector'),
                itemId: 'calculateSelector',
                commonPartFieldConfig: {
                    expressionConfig: {
                        value: "function expression(input){var index = input.context.index; return '$.layers[0].items[' + index + ']'}"
                    },
                    defaultValueConfig: {
                        type: 'String',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: true
                    }
                },
            },
            {
                name: 'index',
                xtype: 'numberfield',
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('index'),
                itemId: 'index'
            },
            //类图只支持如下类型：String, Rect, Array, Map, Object, Number, Int
            {
                name: 'valueType',
                xtype: 'combo',
                fieldLabel: i18n.getKey('valueType'),
                itemId: 'valueType',
                editable: false,
                valueField: 'value',
                displayField: 'name',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'String', value: 'String'},
                        {name: 'Array', value: 'Array'},
                        {name: 'Number', value: 'Number'},
                        {name: 'Map', value: 'Object'}
                    ]
                })
            },
            {
                name: 'operationType',
                xtype: 'combo',
                fieldLabel: i18n.getKey('operation') + i18n.getKey('type'),
                itemId: 'operationType',
                editable: false,
                valueField: 'value',
                displayField: 'name',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: '替换', value: 'Replace'},
                        {name: '插入', value: 'Append'},
                        {name: '删除', value: 'Remove'}
                    ]
                })
            },
            {
                xtype: 'fieldcontainer',
                itemId: 'operatorConfig',
                width: 550,
                name: 'value',
                layout: 'hbox',
                allowBlank: false,
                fieldLabel: i18n.getKey('data') + i18n.getKey('operator'),
                items: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('compile'),
                        width: 65,
                        handler: function (button) {
                            me.test = {};
                            controller.editOperator(JSON.stringify(me.graphData), me, me.test);
                        }
                    }
                ],
                getName: function () {
                    return this.name;
                },
                setValue: function (data) {
                    me.originOperator = data;
                },
                getValue: function () {
                    return me.originOperator;

                }
            }
        ];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var data = form.getValue();
                        var store = form.canvasStore;
                        data.graphData = form.graphData;
                        data.value = form.originOperator;
                        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
                        controller.saveRecord(data, PMVTId, store, form.createOrEdit == 'edit' ? 'modifySuccess' : 'addsuccessful', form);
                    }
                }
            }, {
                xtype: 'button',
                itemId: "checkJson",
                text: i18n.getKey('check') + i18n.getKey('JSON'),
                iconCls: 'icon_check',
                handler: function (btn) {
                    var previewData = {};
                    var form = btn.ownerCt.ownerCt;
                    var store = form.canvasStore;
                    if (Ext.isEmpty(form.data)) {
                        previewData = {};
                    } else {
                        previewData = form.data;
                    }
                    JSShowJsonDataV2(previewData, '编辑', null, {
                        height: 620,
                        showValue: true,
                        editable: true,
                        readOnly: false,
                        bbar: ['->', {
                            itemId: 'btnSave',
                            text: i18n.getKey('save'),
                            iconCls: 'icon_save',
                            handler: function (btn) {
                                var win = btn.ownerCt.ownerCt;
                                var data = win.getValue();
                                if (form.createOrEdit != 'edit') {
                                    data._id = JSGetCommonKey(false);
                                }
                                controller.saveRecord(data, PMVTId, store, form.createOrEdit == 'edit' ? 'modifySuccess' : 'addsuccessful', form, true)

                            }
                        }, {
                            itemId: 'btnCancel',
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (btn) {
                                var win = btn.ownerCt.ownerCt;
                                win.close();
                            }
                        }]
                    });
                }
            }
        ];
        me.callParent();

    },

})
