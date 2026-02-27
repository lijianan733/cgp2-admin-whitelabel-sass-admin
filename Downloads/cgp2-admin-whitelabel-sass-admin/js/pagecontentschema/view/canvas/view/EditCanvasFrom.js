/**
 * Created by nan on 2021/5/26
 */
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.canvas.view.ConstraintFieldSet',
    'CGP.pagecontentschema.model.PageContentSchema',
    'CGP.pagecontentschema.view.canvas.config.Config',
    'CGP.pagecontentschema.view.canvas.view.IntentionGrid'
])
Ext.define('CGP.pagecontentschema.view.canvas.view.EditCanvasFrom', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.editcanvasform',
    autoScroll: true,
    createOrEdit: 'create',
    canvasStore: null,
    defaults: {
        allowBlank: false,
        width: 500,
        margin: '5 25 5 25'
    },
    data: null,
    recordId: null,
    pageContentSchemaId: null,
    setValue: function (data) {
        var me = this;
        me.createOrEdit = 'edit';
        me.data = data;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else if (item.setValue) {
                item.setValue(data[item.getName()]);
            }
        }
        //特殊处理tabPanel的设置值
        var tabPanel = me.getComponent('tabPanel');
        var constraintPanel = tabPanel.getComponent('constraintPanel');
        var constraints = constraintPanel.getComponent('constraints');
        var intentionPanel = tabPanel.getComponent('intentionPanel');
        var intentions = intentionPanel.getComponent('intentions');
        if (data['constraints']) {
            constraints.setValue(data['constraints']);
        }
        if (data['intentions']) {
            intentions.setValue(data['intentions']);
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diyGetValue) {
                result[item.getName()] = item.diyGetValue();
            } else if (item.getValue) {
                result[item.getName()] = item.getValue();
            }
        }
        //特殊处理tabPanel的设置值
        var tabPanel = me.getComponent('tabPanel');
        var constraintPanel = tabPanel.getComponent('constraintPanel');
        var constraints = constraintPanel.getComponent('constraints');
        var intentionPanel = tabPanel.getComponent('intentionPanel');
        var intentions = intentionPanel.getComponent('intentions');
        result['constraints'] = constraints.getValue();
        result['intentions'] = intentions.getValue();

        return Ext.Object.merge(me.data || {}, result);

    },
    initComponent: function () {
        var me = this;
        var recordId = me.recordId;
        var pageContentSchemaId = me.pageContentSchemaId;
        var layerLocalModel = Ext.define('layerLocalModel', {
            extend: 'Ext.data.Model',
            idProperty: '_id',
            fields: [{
                name: '_id',
                type: 'string',
            }, {
                name: 'clazz',
                type: 'string'
            }, {
                name: 'icon',
                type: 'string',
                convert: function (value, record) {
                    var type = record.get('clazz');
                    var icon = '';
                    if (type == 'Layer') {
                        icon = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_purple.png';
                    } else if (type == 'Container') {
                        icon = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_yellow.png';
                    } else {
                        icon = path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png';
                    }
                    return icon;
                }
            }]
        });
        var layerTreeStore = Ext.create('Ext.data.TreeStore', {
            storeId: 'layerTreeStore',
            model: layerLocalModel,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },
            //太多可能的子类字段，故直接用rawData来获取数据
            root: {
                expanded: true,
                children: []
            }
        });
        CGP.pagecontentschema.model.PageContentSchema.load(pageContentSchemaId, {
            scope: this,
            success: function (record, operation) {
                var layers = record.raw.layers;
                //转换数据结
                if (layers && layers.length > 0) {
                    JSReplaceKeyName(layers, 'items', 'children');
                    var rootNode = layerTreeStore.getRootNode();
                    rootNode.appendChild(layers);
                }
            }
        });
        me.items = [
            {
                name: 'clazz',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz',
                hidden: true,
                value: 'Canvas'
            },
            {
                name: '_id',
                xtype: 'textfield',
                fieldStyle: 'background-color:silver',
                value: recordId ? null : JSGetCommonKey(false),
                readOnly: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id',
            },
            {
                name: 'description',
                xtype: 'textfield',
                allowBlank: true,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
            },
            {
                name: 'containPath',
                xtype: 'uxfieldcontainer',
                fieldLabel: i18n.getKey('containPath'),
                itemId: 'containPath',
                labelAlign: 'top',
                defaults: {
                    margin: '5 0 5 50',
                    width: '100%',
                    labelWidth: 80,
                    labelAlign: 'left',
                    allowBlank: false
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('type'),
                        name: 'clazz',
                        itemId: 'clazz',
                        editable: false,
                        valueField: 'value',
                        displayField: 'display',
                        value: 'SelectorCanvasContainerPath',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'value', 'display'
                            ],
                            data: [{
                                value: 'SelectorCanvasContainerPath',
                                display: 'SelectorCanvasContainerPath'
                            }, {
                                value: 'AbsoluteCanvasContainerPath',
                                display: 'AbsoluteCanvasContainerPath'
                            }]
                        }),
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var selector = combo.ownerCt.getComponent('selector');
                                var pathField = combo.ownerCt.getComponent('path');
                                if (newValue == 'SelectorCanvasContainerPath') {
                                    selector.show();
                                    selector.setDisabled(false);
                                    pathField.hide();
                                    pathField.setDisabled(true);
                                } else {
                                    pathField.show();
                                    pathField.setDisabled(false);
                                    selector.hide();
                                    selector.setDisabled(true);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('selector'),
                        name: 'selector',
                        itemId: 'selector',
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('path'),
                        name: 'path',
                        hidden: true,
                        disabled: true,
                        itemId: 'path',
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                plain: true,
                width: '100%',
                itemId: 'tabPanel',
                defaults: {
                    minHeight: 600,
                    autoScroll: true,
                    layout: 'fit',
                    xtype: 'panel',
                },
                items: [
                    {
                        title: '约束',
                        itemId: 'constraintPanel',
                        tbar: {
                            items: [
                                {
                                    xtype: 'splitbutton',
                                    itemId: 'button',
                                    iconCls: 'icon_create',
                                    text: i18n.getKey('create'),
                                    menu: [
                                        {
                                            text: i18n.getKey('自定义约束'),
                                            handler: function (btn) {
                                                var button = btn.ownerCt.ownerButton;
                                                var form = button.ownerCt.ownerCt;
                                                var constraints = form.getComponent('constraints');
                                                constraints.add({
                                                    xtype: 'constraintfieldset',
                                                });
                                            }
                                        },
                                        {
                                            text: i18n.getKey('单图和多文本约束'),
                                            handler: function (btn) {
                                                var button = btn.ownerCt.ownerButton;
                                                var form = button.ownerCt.ownerCt;
                                                var constraints = form.getComponent('constraints');
                                                var controller = Ext.create('CGP.pagecontentschema.view.canvas.controller.Controller');
                                                controller.addMultiTextAndSingleImageConstraint(constraints);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('自由元素约束'),
                                            handler: function (btn) {
                                                var button = btn.ownerCt.ownerButton;
                                                var form = button.ownerCt.ownerCt;
                                                var constraints = form.getComponent('constraints');
                                                var controller = Ext.create('CGP.pagecontentschema.view.canvas.controller.Controller');
                                                controller.addFreeElementConstraint(constraints);
                                            }
                                        }
                                    ],
                                    handler: function (btn) {
                                        var form = btn.ownerCt.ownerCt;
                                        var constraints = form.getComponent('constraints');
                                        constraints.add({
                                            xtype: 'constraintfieldset'
                                        })
                                    }
                                }
                            ]
                        },
                        items: [
                            {
                                xtype: 'uxfieldcontainer',
                                name: 'constraints',
                                itemId: 'constraints',
                                msgTarget: 'none',
                                width: '100%',
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                setValue: function (data) {
                                    var me = this;
                                    me.setLoading(true);
                                    me.removeAll();
                                    for (var i = 0; i < data.length; i++) {
                                        me.add({
                                            xtype: 'constraintfieldset',
                                            data: data[i]
                                        })
                                    }
                                    me.setLoading(false);
                                },
                                getValue: function () {
                                    var fieldContainer = this;
                                    var result = [];
                                    for (var i = 0; i < fieldContainer.items.items.length; i++) {
                                        var item = fieldContainer.items.items[i];
                                        result.push(item.getValue())
                                    }
                                    return result;
                                },
                                items: []
                            }
                        ]
                    },
                    {
                        title: i18n.getKey('intention'),
                        itemId: 'intentionPanel',
                        items: [{
                            xtype: 'intentiongrid',
                            itemId: 'intentions',
                        }],
                    }
                ]
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var form = this;
            form.canvasStore = Ext.create("CGP.pagecontentschema.view.canvas.store.Canvas", {
                pageContentSchemaId: form.pageContentSchemaId,
                listeners: {
                    load: {
                        fn: function (store) {
                            if (form.recordId) {
                                var record = store.getById(form.recordId);
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
        })
    },
})