/**
 * Created by nan on 2018/6/13.
 */

Ext.define('CGP.partner.view.placeorderconfig.view.DeliveryAddressForm', {
    extend: 'Ext.ux.form.Panel',
    title: i18n.getKey('shippingAddress'),
    partnerId: null,//必须传入的参数
    record: null,//当前的记录
    tbar: Ext.create('Ext.ux.toolbar.Edit', {
        btnCreate: {
            hidden: true,
            handler: function () {
            }
        },
        btnCopy: {
            hidden: true,
            handler: function () {
            }
        },
        btnReset: {
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                var controller = Ext.create('CGP.partner.view.placeorderconfig.controller.Controller');
                controller.loadDeliveryAddress(form);
            }
        },
        btnSave: {
            handler: function (view) {
                var form = view.ownerCt.ownerCt;
                var controller = Ext.create('CGP.partner.view.placeorderconfig.controller.Controller');
                var formValid = form.isValid();
                var form2Valid = form.baseConfigPanel.isValid();

                if (formValid && form2Valid) {
                    controller.saveFormValue(form.baseConfigPanel);
                    controller.saveDeliveryAddressFormValue(form);

                } else {
                    if (!formValid) {
                        form.isValid();
                    }
                    else {
                        form.outTab.setActiveTab(form.baseConfigPanel);
                        form.msgPanel.hide()
                        form.baseConfigPanel.isValid();
                    }

                }
            }
        },
        btnGrid: {
            hidden: true,
            handler: function () {
            }
        },
        btnConfig: {
            disabled: true,
            handler: function () {
            }
        },
        btnHelp: {
            handler: function () {
            }
        }
    }),
    constructor: function (config) {
        var me = this;
        var applyConfig = Ext.Object.merge({
            layout: {
                type: 'table',
                columns: 2
            },
            defaults: {
                margin: '10 10 0 10',
                width: 350
            },
            items: [

                {
                    xtype: 'textfield',
                    name: "firstName",
                    itemId: 'firstName',
                    allowBlank: false,
                    fieldLabel: i18n.getKey('firstName')
                },
                {
                    xtype: 'textfield',
                    name: "lastName",
                    itemId: 'laseName',
                    fieldLabel: i18n.getKey('lastName')
                },
                {
                    xtype: 'combo',
                    typeAhead: true,  // 自动匹配相似输入
                    name: "countryCode2",
                    itemId: 'countryCode2',
                    allowBlank: false,
                    minChars: 1,
                    editable: false,
                    autoSelect: false,
                    triggerAction: 'all',
                    fieldLabel: i18n.getKey('country'),
                    store: new Ext.data.Store({
                        fields: [
                            {
                                name: 'id',
                                type: 'int'
                            },
                            'isoCode2',
                            'name'
                        ],
                        storeId: 'countryStore',
                        remoteSort: true,
                        pageSize: 200,
                        proxy: {
                            type: 'uxrest',
                            url: adminPath + 'api/countries',
                            reader: {
                                type: 'json',
                                root: 'data.content'
                            }
                        },
                        autoLoad: true,
                        listeners: {
                            load: function (store, records, successful, eOpts) {
                                for (var i = 0; i < records.length; i++) {
                                    var record = records[i];
                                    if (record.get("name") == "广东") {
                                        store.remove(store.getById(record.get("id")));
                                    }
                                }
                            }
                        }
                    }),
                    queryMode: 'remote',
                    displayField: 'name',
                    valueField: 'isoCode2',
                    listeners: {
                        'change': function (view, newValue, oldValue) {
                            var countryName = view.ownerCt.getComponent('countryName');
                            countryName.setValue(view.getDisplayValue());
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: "countryName",
                    itemId: 'countryName',
                    hidden: true,
                    fieldLabel: i18n.getKey('lastName')
                },
                {
                    xtype: 'textfield',
                    name: "postcode",
                    itemId: 'postcode',
                    fieldLabel: i18n.getKey('postCode')
                },
                {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: "state",
                    itemId: 'state',
                    fieldLabel: i18n.getKey('state')
                },
                {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: "city",
                    itemId: 'city',
                    fieldLabel: i18n.getKey('city')
                },
                {
                    xtype: 'textfield',
                    allowBlank: false,
                    name: "suburb",
                    itemId: 'suburb',
                    fieldLabel: i18n.getKey('suburb')
                },
                {
                    xtype: 'textfield',
                    allowBlank: false,
                    itemId: 'streetAddress1',
                    name: "streetAddress1",
                    fieldLabel: i18n.getKey('streetAddress') + '1'
                },
                {
                    xtype: 'textfield',
                    name: "streetAddress2",
                    itemId: 'streetAddress2',
                    fieldLabel: i18n.getKey('streetAddress') + '2'
                },
                {
                    xtype: 'textfield',
                    name: "mobile",
                    itemId: 'mobile',
                    fieldLabel: i18n.getKey('mobile')
                },
                {
                    xtype: 'textfield',
                    name: "telephone",
                    itemId: 'telephone',
                    fieldLabel: i18n.getKey('telephone')
                },
                {
                    xtype: 'textfield',
                    name: "emailAddress",
                    itemId: 'emailAddress',
                    fieldLabel: i18n.getKey('emailAddress'),
                    regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                    regexText: i18n.getKey('Please enter the correct email!')
                },
                {
                    xtype: 'textfield',
                    name: "company",
                    itemId: 'company',
                    fieldLabel: i18n.getKey('company')
                },
                {
                    xtype: 'combo',
                    name: "locationType",
                    itemId: 'locationType',
                    editable: false,
                    fieldLabel: i18n.getKey('addressType'),
                    store: new Ext.data.Store({
                        fields: ['value'],
                        data: [
                            {value: 'HOUSE'},
                            {value: 'POBOX'},
                            {value: 'BUSINESS'},
                            {value: 'OTHER'}
                        ]
                    }),
                    displayField: 'value',
                    valueField: 'value',
                    queryMode: 'local'
                }
            ],
            listeners: {
                'afterrender': function (view) {
                    var controller = Ext.create('CGP.partner.view.placeorderconfig.controller.Controller');
                    controller.loadDeliveryAddress(view);
                }
            }
        }, config)
        me.callParent([applyConfig])
    }
})