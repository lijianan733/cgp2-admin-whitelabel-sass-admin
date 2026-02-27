/**
 * Created by nan on 2021/5/22
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.ConditionFieldV3',
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.EditGridPCSPreProcessForm', {
        extend: 'Ext.ux.form.ErrorStrickForm',
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
        listeners: {
            afterrender: function () {
                var form = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                form.builderConfigTab = builderConfigTab;
                if (isLock) {
                    JSLockConfig(form);
                }
                if (form.recordId) {
                    form.createOrEdit = 'edit';
                    var url = adminPath + 'api/pagecontentschemapreprocessconfig/' + form.PMVTId + '/placeholders';
                    var proxy = CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel.getProxy();
                    CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel.proxy.url = url;
                    CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.model.GridPCSPreProcessModel.load(form.recordId, {
                        scope: this,
                        failure: function (record, operation) {
                        },
                        success: function (record, operation) {
                            var data = record.raw;
                            form.diySetValue(data);
                        },
                        callback: function (record, operation) {
                        }
                    })
                }
            }
        },
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
            result.clazz = 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig';
            result._id = me.recordId;
            return result;
        },
        diySetValue: function (data) {
            var me = this;
            me.setValue(data);
        },
        initComponent: function () {
            var me = this;
            var recordId = me.recordId;
            var PMVTId = me.PMVTId;
            var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
            var preprocessItemsStore = Ext.create('Ext.data.Store', {
                autoSync: true,
                storeId: 'preprocessItemsStore',
                fields: [
                    {
                        name: 'conditionDTO',
                        type: 'object'
                    }, {
                        name: 'condition',
                        type: 'object'
                    }, 'description', 'selector',
                    {
                        name: 'itemTemplate',
                        type: 'object'
                    },
                    {
                        name: 'canvas',
                        type: 'object'
                    }, {
                        name: 'itemProcesses',
                        type: 'array'
                    }
                ],
                data: [],
                proxy: {
                    type: 'memory'
                }
            });
            me.pcsConfigData = controller.getPCSData(me.PMVTId);
            me.items = [
                {
                    xtype: 'textfield',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    xtype: 'conditionfieldv3',
                    name: 'conditionDTO',
                    itemId: 'conditionDTO',
                    fieldLabel: i18n.getKey('condition'),
                    contentData: me.contentData,
                    allowBlank: true,
                    conditionDTO: {
                        "clazz": "com.qpp.cgp.domain.executecondition.InputCondition",
                        "conditionType": "custom",
                        "operation": {
                            "operations": [],
                            "clazz": "com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation",
                            "expression": "function expression(args){return true;}"
                        }
                    }
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
                            value: "function expression(args){return args.context['9120809']}//取片数属性值"
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
                        },
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            allowBlank: true,
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
                    width: 800,
                    title: i18n.getKey('layout'),
                    defaults: {
                        margin: '5 0 5 50',
                        allowBlank: false
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'maxQty',
                            itemId: 'maxQty',
                            minValue: 0,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('每行最大数量')
                        },
                        {
                            xtype: 'combo',
                            name: 'arrangeRule',
                            itemId: 'arrangeRule',
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
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
                            title: i18n.getKey('margin'),
                            layout: {
                                type: 'hbox'
                            },
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
                        {
                            xtype: 'uxfieldset',
                            name: 'padding',
                            minValue: 0,
                            flex: 1,
                            itemId: 'padding',
                            title: i18n.getKey('padding'),
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
                    ]
                },
                {
                    xtype: 'gridfieldextendcontainer',
                    name: 'preprocessItems',
                    itemId: 'preprocessItems',
                    labelAlign: 'top',
                    fieldLabel: i18n.getKey('preprocessItems'),
                    width: 800,
                    height: 200,
                    colspan: 2,
                    gridConfig: {
                        viewConfig: {
                            enableTextSelection: true
                        },
/*
                        renderTo: 'conditions',
*/
                        height: 200,
                        width: 800,
                        allowBlank: true,
                        store: preprocessItemsStore,
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                tdCls: 'vertical-middle',
                                itemId: 'actioncolumn',
                                width: 75,
                                sortable: false,
                                resizable: false,
                                menuDisabled: true,
                                defaults: {
                                    flex: 1,
                                },
                                items: [
                                    {
                                        iconCls: 'icon_edit icon_margin',
                                        itemId: 'actionedit',
                                        tooltip: 'Edit',
                                        handler: function (view, rowIndex, colIndex, action, event, record) {
                                            controller.editGridPCSTemplateItem(me.ownerCt, record, PMVTId, me.pcsConfigData);
                                        }
                                    },
                                    {
                                        iconCls: 'icon_copy icon_margin',
                                        itemId: 'actionCopy',
                                        tooltip: 'copy',
                                        handler: function (view, rowIndex, colIndex, action, event, record) {
                                            var store = view.ownerCt.store;
                                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否复制该条记录?'), function (selector) {
                                                if (selector == 'yes') {
                                                    var data = Ext.clone(record.raw);
                                                    store.add(data);
                                                }
                                            })
                                        }
                                    },
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        itemId: 'actionremove',
                                        tooltip: 'Remove',
                                        handler: function (view, rowIndex, colIndex) {
                                            var store = view.getStore();
                                            store.removeAt(rowIndex);
                                        }
                                    }
                                ]
                            },
                            {
                                text: i18n.getKey('description'),
                                dataIndex: 'description',
                                tdCls: 'vertical-middle',
                                flex: 1,
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('selector'),
                                dataIndex: 'selector',
                                flex: 1,
                                tdCls: 'vertical-middle'
                            },
                            {
                                text: i18n.getKey('condition'),
                                dataIndex: 'condition',
                                tdCls: 'vertical-middle',
                                xtype: 'valueexcomponentcolumn',
                                flex: 1,
                                canChangeValue: false,//是否可以通过编辑改变record的
                            },
                        ],
                        tbar: [
                            {
                                text: i18n.getKey('add'),
                                iconCls: 'icon_create',
                                handler: function () {
                                    controller.editGridPCSTemplateItem(me.ownerCt, null, PMVTId, me.pcsConfigData);
                                }
                            }
                        ]
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
                            var data = form.diyGetValue();
                            console.log(form.diyGetValue());
                            controller.saveRecord(data, me.PMVTId, null, me.recordId ? i18n.getKey('modifySuccess') : i18n.getKey('addsuccessful'), form);
                        }
                    }
                }/*,
                {
                    xtype: 'button',
                    itemId: "checkJson",
                    text: i18n.getKey('check') + i18n.getKey('JSON'),
                    iconCls: 'icon_check',
                    handler: function (btn) {
                        var previewData = {};
                        var form = btn.ownerCt.ownerCt;
                        var store = form.canvasStore;
                        if (Ext.isEmpty(form.record)) {
                            previewData = {};
                        } else {
                            previewData = form.record.data;
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
*/
            ];
            me.callParent();
        },

    }
)