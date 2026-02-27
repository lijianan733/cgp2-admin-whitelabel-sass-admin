/**
 * Created by nan on 2018/3/14.
 */
Ext.syncRequire(['CGP.common.valueExV2.view.ValidExpressionContainer']);
Ext.define('CGP.common.valueExV2.view.EditContinuousValueConstraintForm', {
    extend: 'Ext.form.Panel',
    bbar: [
        '->',
        {
            xtype: 'button',
            iconCls: 'icon_save',
            text: i18n.getKey('save'),
            handler: function () {
                var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                var data = controller.getFormValue(this);
                if (!Ext.isEmpty(data)) {
                    console.log(data);
                    var thisForm = this.ownerCt.ownerCt;
                    var groupGridPanel = thisForm.currentPanel;
                    var ThisPanel = this.ownerCt.ownerCt.editPanel;//当前编辑panel
                    controller.getDataToGridStore(data, groupGridPanel, thisForm.createOrEdit, thisForm.tab, thisForm.record);
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'), function () {
                        thisForm.tab.setActiveTab(groupGridPanel);
                        ThisPanel.close();
                    })
                }
            }
        }
    ],
    width: '100%',
    height: '100%',
    autoScroll: true,
    defaults: {
        allowBlank: false,
        margin: '10 0 10 50',
        msgTarget: 'side'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                readOnly: true,
                name: 'clazz',
                value: me.inputTypeClazz,
                fieldLabel: i18n.getKey('type'),
                width: 700,
                store: Ext.create('Ext.data.Store', {
                    autoSync: true,
                    fields: [
                        {name: 'name', type: 'string'},
                        {name: 'class', type: 'string'}
                    ],
                    data: [
                        {class: 'com.qpp.cgp.value.constraint.ContinuousValueConstraint', name: 'ContinuousValueConstraint'},
                        {class: 'com.qpp.cgp.value.constraint.DiscreteValueConstraintItem', name: 'DiscreteValueConstraint'}
                    ]
                }),
                hidden: true,
                valueField: 'class',
                displayField: 'name'
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
                width: 700,
                allowBlank: true
            },
            {
                xtype: 'gridfield',
                name: 'conditions',
                itemId: 'conditions',
                msgTarget: 'none',
                allowBlank: true,
                fieldLabel: i18n.getKey('condition'),
                width: 800,
                height: 200,
                gridConfig: {
                    viewConfig: {
                        enableTextSelection: true
                    },
                    height: 200,
                    width: 800,
                    renderTo: JSGetUUID(),
                    allowBlank: true,
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'clazz', type: 'string'},
                            {name: 'expression', type: 'string'},
                            {name: 'expressionEngine', type: 'string',defaultValue:'JavaScript'},
                            {name: 'inputs', type: 'object'},
                            {name: 'resultType', type: 'string'},
                            {name: 'promptTemplate', type: 'string'},
                            {name: 'min', type: 'object', defaultValue: undefined},
                            {name: 'max', type: 'object', defaultValue: undefined},
                            {name: 'regexTemplate', type: 'object', defaultValue: undefined}
                        ],
                        data: [
                        ]
                    }),
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            tdCls: 'vertical-middle',
                            itemId: 'actioncolumn',
                            width: 60,
                            sortable: false,
                            resizable: false,
                            menuDisabled: true,
                            items: [
                                {
                                    iconCls: 'icon_edit icon_margin',
                                    itemId: 'actionedit',
                                    tooltip: 'Edit',
                                    handler: function (view, rowIndex, colIndex) {
                                        var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                                        controller.nodifyData(view, rowIndex, me.configurableId);
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
                            text: i18n.getKey('type'),
                            dataIndex: 'clazz',
                            tdCls: 'vertical-middle',
                            width: 200,
                            renderer: function (value) {
                                return value.substring(value.lastIndexOf('.') + 1, value.length)
                            }
                        },
                        {
                            text: i18n.getKey('expression'),
                            dataIndex: 'expression',
                            tdCls: 'vertical-middle',
                            width: 200,
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                return  value;
                            }
                        },
                        {
                            text: i18n.getKey('expressionEngine'),
                            dataIndex: 'expressionEngine',
                            tdCls: 'vertical-middle'
                        },
                        {
                            text: i18n.getKey('resultType'),
                            dataIndex: 'resultType',
                            tdCls: 'vertical-middle'

                        },
                        {
                            text: i18n.getKey('promptTemplate'),
                            dataIndex: 'promptTemplate',
                            tdCls: 'vertical-middle',
                            renderer: function (value, metadata) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';//显示的文本
                                return  value;
                            }
                        }
                    ],
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_create',
                            handler: function () {
                                var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                                controller.nodifyData(this.ownerCt.ownerCt, null, me.configurableId);
                            }
                        }
                    ]
                }},
            {
                xtype: 'validexpressioncontainer',
                itemId: 'validExpression',
                name: 'validExpression',
                gridConfigRenderTo: JSGetUUID(),
                fieldLabel: i18n.getKey('validExpression'),
                configurableId: me.configurableId
            }

        ];
        me.callParent(arguments);
    }


});
