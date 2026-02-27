/**
 * Created by nan on 2017/12/25.
 */
Ext.define('CGP.partner.view.supplierorderconfig.view.EditOrCreateRestRequestConfig', {
    extend: 'Ext.panel.Panel',
    autoScroll: true,
    frame: false,
    closable: true,
    initComponent: function () {
        var me = this;
        var createOrUpdate = me.createOrEdit;
        var index = me.recordIndex;
        var controller = Ext.create('CGP.partner.view.supplierorderconfig.controller.Controller');
        var editConfigStore = me.store;
        var record = me.record;
        if (record == null) {
            record = Ext.create('CGP.partner.view.supplierorderconfig.model.RestHttpRequestConfigModel');
        }
        var headersItemStore = Ext.create('CGP.partner.view.orderNotifyConfig.store.HeaderItemKeyStore');
        me.tbar = {
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if ((form0.isValid() + form1.isValid() + form2.isValid() + form3.isValid() + form4.isValid() + form5.isValid()) == 6) {
                            var changedValue = controller.getAllFormValue(form0, form1, form2, form3, form4, form5);
                            controller.saveHttpRequestConfig(me.createOrEdit, record, changedValue, me.store, me.outTab, me);
                        }
                    }
                }
            ]
        };
        var form1 = Ext.create('Ext.form.Panel', {
            id: 'form1',
            margin: '0 0 0 20',
            height: 80,
            border: false,
            layout: 'hbox',
            fieldDefaults: {
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [

                {
                    margin: '20 0 0 50',
                    xtype: 'combo',
                    itemId: 'method',
                    id: 'method',
                    width: 200,
                    name: 'method',
                    labelWidth: 80,
                    labelAlign: 'left',
                    editable: false,
                    value: record.get('method'),
                    fieldLabel: i18n.getKey('method'),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'string'}
                        ],
                        data: [
                            {name: 'get', value: 'GET'},
                            {name: 'post', value: 'POST'},
                            {name: 'put', value: 'PUT'},
                            {name: 'delete', value: 'DELETE'}
                        ]
                    }),
                    valueField: 'value',
                    displayField: 'value',
                    listeners: {
                        change: function (element, later, old) {
                            var result = Ext.Array.contains(['PUT', 'POST'], later);
                            var form = Ext.getCmp('form4');
                            if (!result) {
                                form.getComponent('body').setValue(null);
                                form.hide();
                            } else {
                                form.show();
                            }
                        }
                    }
                },
                {
                    margin: '20 0 0 25',
                    xtype: 'textfield',
                    labelAlign: 'left',
                    labelWidth: 50,
                    width: 600,
                    name: 'url',
                    vtype: 'url',
                    itemId: 'url',
                    id: 'url',
                    fieldLabel: i18n.getKey('url'),
                    value: record.get('url')
                }
            ]
        });
        var form2 = Ext.create('Ext.form.Panel', {
            id: 'form2',
            minHeight: 50,
            border: false,
            margin: '0 0 0 20',
            bodyStyle: 'border-top:0;border-color:white;',
            defaults: {
                msgTarget: 'side'
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    //style: 'background-color:silver;',
                    color: 'black',
                    border: false,
                    bodyStyle: 'border-color:white;',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('headers') + '</font>'
                        },
                        {
                            itemId: 'form2Button',
                            xtype: 'button',
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (button) {
                                button.ownerCt.ownerCt.add(Ext.create('CGP.partner.view.supplierorderconfig.view.HeadersContainer', {
                                    store: headersItemStore,
                                    record: record,
                                    count: Ext.getCmp('form2').items.items.length
                                }));
                            }
                        }
                    ]

                }
            ],
            items: []
        });
        var form3 = Ext.create('Ext.form.Panel', {
            id: 'form3',
            margin: '0 0 0 20',
            minHeight: 50,
            bodyStyle: 'border-top:0;border-color:white;',
            defaults: {
                msgTarget: 'side'
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    //style: 'background-color:silver;',
                    color: 'black',
                    border: false,
                    bodyStyle: 'border-color:white;',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('queryParameters') + '</font>'
                        },
                        {
                            itemId: 'form3Button',
                            xtype: 'button',
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (button) {
                                button.ownerCt.ownerCt.add(Ext.create('CGP.partner.view.orderNotifyConfig.view.QueryParametersContainer', {
                                    record: record,
                                    count: Ext.getCmp('form3').items.items.length
                                }));
                            }
                        }
                    ]
                }
            ],
            items: []
        });
        var form4 = Ext.create('Ext.form.Panel', {
            id: 'form4',
            layout: 'vbox',
            bodyStyle: 'border-top:0;border-color:white;',
            border: false,
            margin: '0 0 0 20',
            defaults: {
                msgTarget: 'side'
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    //style: 'background-color:silver;',
                    color: 'black',
                    border: false,
                    bodyStyle: 'border-color:white;',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('body') + '</font>'
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'radiogroup',
                    labelWidth: 95,
                    margin: '20 50 0 50',
                    width: '50%',
                    name: 'bodyType',
                    id: 'bodyType',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('body') + i18n.getKey('transformat'),
                    vertical: true,
                    items: [
                        { boxLabel: 'Text', name: 'type', inputValue: 'text/plain' },
                        { boxLabel: 'JSON', name: 'type', inputValue: 'application/json'},
                        { boxLabel: 'XML', name: 'type', inputValue: 'application/xml' },
                        { boxLabel: 'HTML', name: 'type', inputValue: 'text/html' }
                    ],
                    listeners: {
                        change: function (element, later, old) {
                            var isfind = false;
                            if (form2.items.items.length > 0) {
                                for (var i = 0; i < form2.items.items.length; i++) {
                                    var map = form2.items.items[i];
                                    if (map.getComponent('key').getValue() == 'Content-Type') {
                                        map.getComponent('value').setValue(later.type);
                                        isfind = true;
                                    }
                                }
                            }
                            if (isfind == false || form2.items.items.length == 0) {
                                var item = Ext.create('CGP.partner.view.orderNotifyConfig.view.HeadersContainer', {
                                    store: headersItemStore,
                                    record: {
                                        name: 'Content-Type',
                                        value: later.type
                                    },
                                    count: Ext.getCmp('form2').items.items.length
                                });
                                form2.add(item);
                            }
                        }
                    }
                },
                {
                    xtype: 'textarea',
                    height: 100,
                    labelWidth: 95,
                    itemId: 'body',
                    margin: '20 50 10 50',
                    width: '60%',
                    id: 'body',
                    name: 'body',
                    allowBlank: true,
                    value: record.get('body'),
                    fieldLabel: i18n.getKey('body')
                }
            ],
            listeners: {
                'render': function (form4) {
                    var isshow = Ext.Array.contains(['PUT', 'POST', ''], Ext.getCmp('form1').getComponent('method').getValue());
                    if (isshow) {
                        form4.show();
                    } else {
                        form4.hide();

                    }
                }
            }
        });
        var form5 = Ext.create('Ext.form.Panel', {
            id: 'form5',
            border: false,
            margin: '0 0 0 20',
            layout: {
                type: 'table',
                columns: 3
            },
            defaults: {
                msgTarget: 'side'
            },
            bodyStyle: 'border-top:0;border-color:white;',
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    border: false,
                    color: 'black',
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: false,
                            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('提示信息') + '</font>'
                        }
                    ]

                }
            ],
            items: [
                {
                    xtype: 'textfield',
                    margin: '20 25 0 50',
                    allowBlank: false,
                    width: 300,
                    fieldLabel: i18n.getKey('successPath'),
                    itemId: 'successPath',
                    value: record.get('successPath'),
                    id: 'successPath',
                    name: 'successPath'
                },
                {
                    xtype: 'textfield',
                    margin: '20 25 0 25',
                    allowBlank: false,
                    width: 300,
                    fieldLabel: i18n.getKey('successKey'),
                    itemId: 'successKey',
                    value: record.get('successKey'),
                    id: 'successKey',
                    name: 'successKey'
                },
                {
                    xtype: 'textfield',
                    margin: '20 25 0 25',
                    allowBlank: false,
                    width: 300,
                    fieldLabel: i18n.getKey('errorMessagePath'),
                    itemId: 'errorMessagePath',
                    value: record.get('errorMessagePath'),
                    name: 'errorMessagePath',
                    id: 'errorMessagePath'
                }
            ]
        });
        var form0 = Ext.create('Ext.form.Panel', {
            itemId: 'form0',
            width: '100%',
            layout: {
                type: 'table',
                columns: 2
            },
            defaults: {
                msgTarget: 'side'
            },
            bodyStyle: 'border-top:0;border-color:white;',
            border: false,
            items: [
                {
                    xtype: 'checkbox',
                    margin: '20 0 0 50',
                    fieldLabel: i18n.getKey('isActive'),
                    checked: record.get('enable'),
                    name: 'enable',
                    itemId: 'enable',
                    inputValue: true
                },
                {
                    xtype: 'checkbox',
                    margin: '20 0 0 50',
                    fieldLabel: i18n.getKey('testOrNot'),
                    checked: record.get('isTest'),
                    name: 'isTest',
                    itemId: 'isTest',
                    inputValue: true
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    margin: '20 0 0 50',
                    itemId: 'name',
                    value: record.get('name'),
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: true
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    margin: '20 0 0 50',
                    itemId: 'description',
                    value: record.get('description'),
                    fieldLabel: i18n.getKey('description'),
                    allowBlank: true
                },
                {
                    name: 'type',
                    xtype: 'combo',
                    margin: '20 0 0 50',
                    itemId: 'type',
                    fieldLabel: i18n.getKey('notify') + i18n.getKey('type'),
                    allowBlank: false,
                    displayField: 'type',
                    valueField: 'value',
                    editable: false,
                    value: record.get('type') ? record.get('type') : 'customer',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'type',
                                type: 'stirng'
                            },
                            {
                                name: 'value',
                                type: 'string'
                            }
                        ],
                        data: [
                            {
                                type: i18n.getKey('customer'),
                                value: 'customer'
                            },
                            {
                                type: i18n.getKey('admin'),
                                value: 'manager'
                            }
                        ]
                    })
                }
            ]
        });
        var decollator = Ext.widget('fieldset', {
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('restHttpRequestConfigs') + '</font>',
            collapsible: false,
            border: '1 0 0 0 ',
            layout: 'fit',
            margin: '10 0 0 0',
            defaultType: 'displayfield'
        });
        var decollator1 = Ext.widget('fieldset', {
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('base') + i18n.getKey('config') + '</font>',
            collapsible: false,
            border: '1 0 0 0 ',
            layout: 'fit',
            margin: '10 0 0 0',
            defaultType: 'displayfield'
        });
        me.items = [decollator1, form0, decollator, form1, form3, form2, form4, form5];
        var count = 0;
        for (var i in record.get('headers')) {
            var item = Ext.create('CGP.partner.view.orderNotifyConfig.view.HeadersContainer', {
                store: headersItemStore,
                record: {
                    name: i,
                    value: record.get('headers')[i]
                },
                count: count
            });
            count++;
            form2.add(item);
        }
        count = 0;
        for (var i in record.get('queryParameters')) {
            var item = Ext.create('CGP.partner.view.orderNotifyConfig.view.QueryParametersContainer', {
                record: {
                    name: i,
                    value: record.get('queryParameters')[i]
                },
                count: count
            });
            count++;
            form3.add(item);
        }
        me.callParent(arguments);
    }
})
