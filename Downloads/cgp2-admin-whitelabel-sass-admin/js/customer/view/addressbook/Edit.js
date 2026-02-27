Ext.Loader.syncRequire([
    'CGP.common.commoncomp.AddressBookForm'
])
Ext.define("CGP.customer.view.addressbook.Edit", {
    extend: 'Ext.window.Window',
    alias: 'widget.addressbookedit',
    mixins: ["Ext.ux.util.ResourceInit"],
    requires: ["Ext.ux.util.ResourceInit", 'CGP.country.model.CountryModel'],
    currentMode: null, //"editing" or 'creating'
    record: null, //editing
    controller: null, //controller
    layout: 'fit',
    closeAction: 'hide',
    form: null,
    modal: true,
    initComponent: function () {
        var me = this;
        me.items = [
            /*    {
                    xtype: 'uxform',
                    bodyStyle: {
                        padding: '10px'
                    },
                    model: 'CGP.customer.model.AddressBook',
                    fieldDefaults: {
                        labelWidth: 80,
                        width: 290,
                        labelAlign: 'right',
                        msgTarget: 'side',
                        plugins: [
                            {
                                ptype: 'uxvalidation'
                            }
                        ]
                    },
                    buttonAlign: 'left',
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
                                model: 'CGP.country.model.CountryModel',
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
                            valueField: 'isoCode2'
                        },
                        {
                            xtype: 'combo',
                            name: "gender",
                            editable: false,
                            fieldLabel: i18n.getKey('gender'),
                            store: Ext.create('Ext.data.Store', {
                                fields: ['gender', 'desc'],
                                data: [
                                    {
                                        gender: 'M',
                                        desc: i18n.getKey('male')
                                    },
                                    {
                                        gender: 'F',
                                        desc: i18n.getKey('female')
                                    },
                                    {
                                        gender: 'U',
                                        desc: ""
                                    }
                                ]
                            }),
                            itemId: 'gender',
                            displayField: 'desc',
                            valueField: 'gender',
                            queryMode: 'local'
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
                            regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                            regexText: i18n.getKey('Please enter the correct email!'),
                            fieldLabel: i18n.getKey('emailAddress')
                        },
                        {
                            xtype: 'textfield',
                            name: "company",
                            itemId: 'company',
                            fieldLabel: i18n.getKey('company')
                        },
                        {
                            xtype: 'numberfield',
                            name: "sortOrder",
                            itemId: 'sortOrder',
                            allowDecimals: false,
                            allowBlank: false,
                            fieldLabel: i18n.getKey('sortOrder'),
                            minValue: 0,
                            value: 0
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
                    ]
                },*/
            {
                xtype: 'address_book_form',
                itemId: 'form',
                layout: {
                    type: 'table',
                    columns: 2
                }
            }
        ];
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                handler: function () {
                    me.controller.saveModel(me.currentMode, me.userrecord, me.store, me.record);
                }
            }
        };
        me.callParent(arguments);
    },

    refresh: function (currentMode, record) {
        var me = this;
        me.record = record;
        me.currentMode = currentMode;
        var form = me.form = me.getComponent('form');
        if (me.currentMode == "editing") {
            me.setTitle(i18n.getKey('edit') + "_" + i18n.getKey('address'));
            form.setValue(record.raw);
        } else {
            me.setTitle(i18n.getKey('create') + "_" + i18n.getKey('address'));
        }
    }
});