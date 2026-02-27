/**
 * Created by nan on 2017/12/25.
 */
Ext.syncRequire(['CGP.partner.view.orderNotifyConfig.view.HeadersContainer', 'CGP.partner.view.orderNotifyConfig.view.QueryParametersContainer', 'CGP.partner.view.orderNotifyConfig.controller.Controller']);
Ext.onReady(function () {
    var recordId = JSGetQueryString('recordId');
    var createOrUpdate = JSGetQueryString('createOrUpdate');
    var partnerId = JSGetQueryString('partnerId');
    var frames = top.frames;//获取最外围的frames集合
    var controller = Ext.create('CGP.partner.view.orderNotifyConfig.controller.Controller');
    var editConfigPgae = {};
    var index = JSGetQueryString('index');
    var HttpRequestConfigStore = {};
    for (var i = 0; i < frames.length; i++) {
        if (frames[i].Ext.getCmp('EditPage') != null) {
            editConfigPgae = frames[i].Ext.getCmp('EditPage');
            editConfigStore = editConfigPgae.getComponent('form').getComponent('restHttpRequestConfigs').gridConfig.store
        }
    }
    var record = editConfigStore.getAt(index);
    if (record == null) {
        record = Ext.create('CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel');
    }
    //请求头中的所有可用项
    var headersItemStore = Ext.create('CGP.partner.view.orderNotifyConfig.store.HeaderItemKeyStore');
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit', autoScroll: true});
    var panel = Ext.create('Ext.panel.Panel', {
        autoScroll: true,
        id: 'panel',
        frame:true,
        itemId: 'panel',
        tbar: {
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if ((form1.isValid() + form2.isValid() + form3.isValid() + form4.isValid() + form5.isValid()) == 5) {
                            var changedValue = controller.getAllFormValue(form1, form2, form3, form4, form5);
                            controller.saveHttpRequestConfig(createOrUpdate,record,changedValue,editConfigStore);
                        }
                    }
                }
            ]
        }
    });
    page.add(panel);
    var form1 = Ext.create('Ext.form.Panel', {
        id: 'form1',
        width: '100%',
        height: 80,
        border: false,
        layout: 'hbox',
        fieldDefaults: {
            allowBlank: false
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
        width: '100%',
        minHeight: 50,
        border: false,

        bodyStyle: 'border-top:0;border-color:white;',
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
                            button.ownerCt.ownerCt.add(Ext.create('CGP.partner.view.orderNotifyConfig.view.HeadersContainer', {
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
        width: '100%',
        minHeight: 50,
        bodyStyle: 'border-top:0;border-color:white;',
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
        width: '100%',
        layout: 'vbox',
        bodyStyle: 'border-top:0;border-color:white;',
        border: false,
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
        width: '100%',
        layout: {
            type: 'table',
            columns: 3
        },
        bodyStyle: 'border-top:0;border-color:white;',
        dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'top',
                border: false,
                //style: 'background-color:silver;',
                color: 'black',
                /*
                 bodyStyle: 'border-color:white;',
                 */
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
    panel.add([form1, form3, form2, form4, form5]);
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
});
