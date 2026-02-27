/**
 * Created by nan on 2018/3/14.
 */
Ext.define('CGP.common.valueExV2.view.EditDiscreteValueConstraintForm', {
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
                    var groupGridPanel = this.ownerCt.ownerCt.currentPanel;//跳转前的页面对象
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
        margin: '10 0 10 50',
        msgTarget: 'side',
        width: 700
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'checkboxfield',
                name: 'include',
                allowBlank: false,
                itemId: 'include',
                fieldLabel: i18n.getKey('isInclude')
            },
            {
                xtype: 'combo',
                readOnly: true,
                allowBlank: false,
                name: 'clazz',
                hidden: true,
                value: me.inputTypeClazz,
                fieldLabel: i18n.getKey('type'),
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
                valueField: 'class',
                displayField: 'name'
            },
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
                allowBlank: true
            },
            {
                xtype: 'gridfield',
                name: 'items',
                itemId: 'items',
                fieldLabel: i18n.getKey('items'),
                width: 700,
                height: 500,
                allowBlank: false,
                msgTarget: 'under',
                gridConfig: {
                    height: 500,
                    renderTo: JSGetUUID(),
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'clazz', type: 'string', defaultValue: 'com.qpp.cgp.domain.product.attribute.constraint2.single.DiscreteValueConstraintItem'},
                            {name: 'conditions', type: 'object'},
                            {name: 'value', type: 'object'}
                        ],
                        data: []
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
                                        controller.editOrAddItems(view, rowIndex, me.configurableId);
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
                            text: i18n.getKey('condition'),
                            dataIndex: 'conditions',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            xtype: "componentcolumn",
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('condition') + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                display.getEl().on("click", function () {
                                                    var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                                                    controller.showconditionsDetail(value);
                                                });
                                            }
                                        }}
                                } else {
                                    return null;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            tdCls: 'vertical-middle',
                            flex: 2,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata) {
                                var id = JSGetUUID();
                                var expression = null;
                                var returnstr = '';
                                for (var i in value) {
                                    if (i == 'clazz') {
                                        returnstr += i + ' :  ' + value[i].substring(value[i].lastIndexOf('.') + 1, value[i].length) + '<br>';
                                    } else if (i == 'expression') {
                                        returnstr += '<a href="#" id=' + id + '>' + '查看表达式' + '</a>';
                                        expression = value[i];
                                    } else {
                                        returnstr += i + ' :  ' + value[i] + '<br>';
                                    }
                                }
                                return {
                                    xtype: 'displayfield',
                                    value: returnstr,
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById(id);
                                            if (!Ext.isEmpty(clickElement)) {
                                                clickElement.addEventListener('click', function () {
                                                    var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                                                    controller.showExpression(expression);
                                                }, false);
                                            }
                                        }
                                    }
                                };
                            }
                        }
                    ],
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_create',
                            handler: function () {
                                var controller = Ext.create('CGP.common.valueExV2.controller.Controller');
                                controller.editOrAddItems(this.ownerCt.ownerCt, '', me.configurableId);
                            }
                        }
                    ]

                }}

        ];
        me.callParent(arguments);
    }
});
