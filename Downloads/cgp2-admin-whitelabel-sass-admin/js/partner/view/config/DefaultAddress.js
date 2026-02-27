Ext.define('CGP.partner.view.config.DefaultAddress', {
    extend: 'Ext.window.Window',

    modal: true,
    height: 400,
    width: 700,
    autoScroll: true,
    autoShow: true,
    recordData: null,

    initComponent: function () {
        var me = this;
        var fieldText = null;
        me.title = i18n.getKey('defaultAddressConfig');
        me.itemId = 'defaultAddressConfig';
        me.id = 'defaultAddressConfig';
        var myMask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        me.listeners = {
            show: function () {
                myMask.show();
            }
        };
        var store = Ext.create('CGP.partner.store.PartnerConfigStore', {
            partnerId: me.partnerId,
            groupId: me.groupId,
            websiteId: me.websiteId,
            listeners: {
                load: function () {
                    myMask.hide();
                }
            }
        });

        var bbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                '->', {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if(me.form.isValid()){
                            var data = JSON.stringify(me.form.getValues());

                            me.controller.modifyConfiguration(data,me.recordData)
                        }
                    }
                }, {
                    itemId: 'btnReset',
                    text: i18n.getKey('reset'),
                    iconCls: 'icon_reset',
                    handler: function () {
                        //重置保存的配置
                        store.load();
                    }
                }
            ]
        });
        var page = Ext.create("Ext.form.Panel", {
            header: false,
            //height: 400,
            width: '100%',
            padding: 10,
            border: false,
            layout: {
                type: 'table',
                columns: 2
            },
            defaults: {
                labelAlign: 'right',
                width: 300
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

        });
        store.on('load', function (store, records) {
            var record = null;
            Ext.each(records, function (item) {
                if (item.get('key') == 'PARTNER_' + me.partnerId + '_CONFIG_KEY_DEFAULT_ADDRESS') {
                    record = item;
                    me.recordData = record.data;
                }
            });
            if (!Ext.isEmpty(record)) {
                var formItems = page.items.items;
                var data = JSON.parse(record.get('value'));
                Ext.each(formItems, function (item) {
                    item.setValue(data[item.name])
                });
                me.show();
            } else {
                Ext.Msg.confirm(i18n.getKey('prompt'), "默认地址配置为空，是否新建?", callback);
                function callback(id) {
                    var data = {
                        "title": "partner default address",
                        "description": "partner default address",
                        "key": 'PARTNER_' + me.partnerId + '_CONFIG_KEY_DEFAULT_ADDRESS',
                        "value": "",
                        "groupId": 25,
                        "websiteId": 11,
                        "sortOrder": 0};
                    if (id == 'yes') {
                        me.controller.createConfiguration(data, me)
                    } else {
                        me.close();
                    }
                }
            }
        });
        store.load();
        me.items = [page];
        me.bbar = bbar;

        me.callParent(arguments);
        me.form = me.down('form');
    }
});




