/**
 * Created by nan on 2018/3/14.
 */
Ext.define('CGP.common.valueEx.view.EditDiscreteValueConstraintForm', {
    extend: 'Ext.form.Panel',
    tbar: [
        {
            xtype: 'button',
            iconCls: 'icon_save',
            text: i18n.getKey('save')+i18n.getKey('constraint'),
            handler: function () {
                var controller = Ext.create('CGP.common.valueEx.controller.Controller');
                var data = controller.getFormValue(this);
                if (!Ext.isEmpty(data)) {
                    console.log(data);
                    var thisForm=this.ownerCt.ownerCt;
                    var tab = this.ownerCt.ownerCt.ownerCt.ownerCt;
                    var groupGridPanel=tab.getComponent(tab.itemId+'constraints');
                    var ThisPanel = thisForm.ownerCt.ownerCt.getComponent('EditAtrributeConstraintPanel');
                    controller.getDataToGridStore(data,groupGridPanel,thisForm.createOrEdit,thisForm.ownerCt.ownerCt,thisForm.record);
                    Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('save')+i18n.getKey('success'),function(){
                        thisForm.ownerCt.ownerCt.setActiveTab(groupGridPanel);
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
            //去除id
            /*       {
                       xtype: 'textfield',
                       fieldLabel: i18n.getKey('id'),
                       readOnly: true,
                       allowBlank: true,
                       fieldStyle: 'background-color:silver',
                       itemId: '_id',
                       name: '_id',
                       hidden: true,
                       disable: me.createOrEdit == 'create' ? true : false,
                       value: me.createOrEdit == 'create' ? null : me.recordId
                   },*/
            {
                xtype: 'numberfield',
                hideTrigger: true,
                fieldLabel: i18n.getKey('skuAttribute') + i18n.getKey('id'),
                readOnly: true,
                hidden: true,
                allowBlank: false,
                fieldStyle: 'background-color:silver',
                itemId: 'skuAttributeId',
                name: 'skuAttributeId',
                value: me.skuAttributeId
            },
            {
                xtype: 'combo',
                readOnly: true,
                allowBlank: false,
                name: 'clazz',
                hidden:true,
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
                        {class: 'com.qpp.cgp.value.constraint.DiscreteValueConstraint', name: 'DiscreteValueConstraint'}
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
                allowBlank:true
            },
            {
                xtype: 'gridfield',
                name: 'items',
                itemId: 'items',
                fieldLabel: i18n.getKey('items'),
                width: 700,
                height: 500,
                allowBlank: false,
                msgTarget:'under',
                gridConfig: {
                    height:500,
                    renderTo: 'discreteConsraint',
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        fields: [
                            {name: 'clazz', type: 'string', defaultValue: 'com.qpp.cgp.value.constraint.DiscreteValueConstraintItem'},
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
                                        var controller = Ext.create('CGP.common.valueEx.controller.Controller');
                                        controller.editOrAddItems(view, rowIndex,me.configurableId);
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
                            width: 200,
                            xtype: "componentcolumn",
                            renderer: function (value, metadata, record) {
                                if (!Ext.isEmpty(value)) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('condition') + '</a>',
                                        listeners: {
                                            render: function (display) {
                                                display.getEl().on("click", function () {
                                                    var controller = Ext.create('CGP.common.valueEx.controller.Controller');
                                                    controller.showconditionsDetail(value);
                                                });
                                            }
                                        }}
                                }else{
                                    return null;
                                }
                            }
                        },
                        {
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            tdCls: 'vertical-middle',
                            width: 200,
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
                                                    var controller = Ext.create('CGP.common.valueEx.controller.Controller');
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
                                var controller = Ext.create('CGP.common.valueEx.controller.Controller');
                                controller.editOrAddItems(this.ownerCt.ownerCt,'',me.configurableId);
                            }
                        }
                    ]

                }}

        ];
        me.callParent(arguments);
    }
});
;