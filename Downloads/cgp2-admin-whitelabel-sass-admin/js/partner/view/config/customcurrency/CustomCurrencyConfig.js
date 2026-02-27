Ext.define('CGP.partner.view.config.customcurrency.CustomCurrencyConfig', {
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
        me.title = i18n.getKey('customsDeclaration') + i18n.getKey('currency')+i18n.getKey('manager');
        me.itemId = 'customsCurrency';
        me.id = 'customsCurrency';
        var myMask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        me.listeners = {
            show: function () {
                myMask.show();
            }
        };
        var customCurrencyStore = Ext.create("CGP.partner.store.CustomCurrencyStore");
        var allCurrency = Ext.create('CGP.partner.store.AllCurrency', {
            params: {
                filter: '[{"name":"website.id","value":' + 11 + ',"type":"number"}]'
            }
        });
        //allCurrency.load();
        var bbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                '->', {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if (me.form.isValid()) {
                            var data = me.form.data;
                            data.defaultCustomsCurrencyId = me.form.getComponent('defaultCustomsCurrencyId').getValue();
                            data.customsCurrencyRange = me.form.getComponent('customCurrencys').getSubmitValue();
                            me.modifyRecord(me.partnerId, data)
                        }
                    }
                }, {
                    itemId: 'cancel',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        me.close();
                        //重置保存的配置
                        //store.load();
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
            data: {},
            defaults: {
                labelAlign: 'right',
                width: 300
            },
            items: [
                {
                    name: 'customsCurrencyRange',
                    xtype: 'gridfield',
                    width: 500,
                    valueType: 'id',
                    gridConfig: {
                        store: customCurrencyStore,
                        height: 250,
                        width: '100%',
                        renderTo: 'fonts-element',
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                itemId: 'actioncolumn',
                                width: 60,
                                sortable: false,
                                resizable: false,
                                menuDisabled: true,
                                items: [
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        itemId: 'actionremove',
                                        tooltip: 'Remove',
                                        handler: function (view, rowIndex, colIndex, item, e, record,) {
                                            var store = view.getStore();
                                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定删除？'), function (select) {
                                                if (select == 'yes') {
                                                    var defaultCustomsCurrencyId = page.getComponent('defaultCustomsCurrencyId');
                                                    store.removeAt(rowIndex);
                                                    if(defaultCustomsCurrencyId.getValue() == record.get('id')){
                                                        defaultCustomsCurrencyId.setValue();
                                                    }
                                                }
                                            })

                                        }
                                    }
                                ]
                            }, {
                                text: i18n.getKey('id'),
                                width: 90,
                                dataIndex: 'id',
                                itemId: 'id'
                            },
                            {
                                text: i18n.getKey('title'),
                                width: 90,
                                dataIndex: 'title',
                                itemId: 'title'
                            },
                            {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                width: 100,
                                itemId: 'code'
                            }
                        ],
                        tbar: [
                            {
                                text: i18n.getKey('add') + i18n.getKey('currency'),
                                iconCls: 'icon_create',
                                handler: function () {
                                    var grid = this.ownerCt.ownerCt;
                                    var store = grid.getStore();
                                    var filterData = store.data.items;
                                    Ext.create('CGP.partner.view.config.customcurrency.AddCurrencyWindow', {
                                        filterData: filterData,
                                        store: store,
                                        grid: grid
                                    }).show();
                                }
                            }
                        ]

                    },
                    fieldLabel: i18n.getKey('报关货币管理'),
                    itemId: 'customCurrencys',
                    id: 'customCurrencys'
                }/*,{
                    xtype: 'combo',
                    displayField: 'title',
                    valueField: 'id',
                    editable: false,
                    name: 'defaultCustomsCurrencyId',
                    queryMode: 'local',
                    //value: defaultFont,
                    //haveReset: true,
                    fieldLabel: i18n.getKey('default') + i18n.getKey('custom')+i18n.getKey('currency'),
                    //allowBlank: Ext.isEmpty(Ext.getCmp('fonts')._grid.getStore().data.items),
                    store: Ext.getCmp('customCurrencys')._grid.getStore()
                }*/
            ],
            listeners: {
                afterrender: function (comp) {
                    comp.insert(0, {
                        xtype: 'combo',
                        displayField: 'title',
                        valueField: 'id',
                        editable: false,
                        name: 'defaultCustomsCurrencyId',
                        queryMode: 'local',
                        itemId: 'defaultCustomsCurrencyId',
                        //value: parseInt(comp.data.defaultCustomsCurrencyId),
                        //haveReset: true,
                        fieldLabel: i18n.getKey('default') + i18n.getKey('customsDeclaration') + i18n.getKey('currency'),
                        //allowBlank: Ext.isEmpty(Ext.getCmp('fonts')._grid.getStore().data.items),
                        store: Ext.getCmp('customCurrencys')._grid.getStore(),
                        listeners: {
                            afterrender: function (com){
                                if(!Ext.isEmpty(comp.data.defaultCustomsCurrencyId)){
                                    com.setValue(parseInt(comp.data.defaultCustomsCurrencyId))
                                }
                            }
                        }
                    })
                }
            }

        });
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/partnercustomconfigs?limit=25&page=1&filter=' + Ext.JSON.encode(
                [
                    {"name": "partnerId", "value": me.partnerId + '', "type": "string"}
                ]
            )),
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                myMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    if (!Ext.isEmpty(response.data.content)) {
                        var formItems = page.items.items;
                        var data = response.data.content[0];
                        page.data = data;
                        Ext.each(formItems, function (item) {
                            if (item.name == 'customsCurrencyRange') {
                                allCurrency.on('load', function (store, records) {
                                    var recordDatas = [];
                                    for (var i = 0; i < records.length; i++) {
                                        if(Ext.Array.contains(data[item.name],records[i].getData().id.toString())){
                                            recordDatas.push(records[i].getData());
                                        }
                                    }
                                    item.setSubmitValue(recordDatas)
                                }, this, {
                                    single: true
                                })
                                /*if (allCurrency.isLoading()) {

                                } else {
                                    var recordDatas = [];
                                    for (var i = 0; i < allCurrency.data.items.length; i++) {
                                        if(Ext.Array.contains(data[item.name],allCurrency.data.items[i].getData().id)){
                                            recordDatas.push(allCurrency.data.items[i].getData());
                                        }

                                    }
                                    item.setSubmitValue(recordDatas);
                                }*/
                            } else {
                                if(!Ext.isEmpty(data[item.name])){
                                    item.setValue(parseInt(data[item.name]));
                                }

                            }

                        });
                        me.show();
                    } else {
                        Ext.Msg.confirm(i18n.getKey('prompt'), "报关货币配置为空，是否新建?", callback);

                        function callback(id) {
                            var data = {
                                "partnerId": me.partnerId,
                                "defaultCustomsCurrencyId": "",
                                "customsCurrencyRange": [],
                                "clazz": "com.qpp.cgp.domain.partner.customs.PartnerCustomsConfig"
                            };
                            if (id == 'yes') {
                                me.createRecord(me.partnerId, data)
                            } else {
                                me.close();
                            }
                        }
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                myMask.hide();
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        me.items = [page];
        me.bbar = bbar;

        me.callParent(arguments);
        me.form = me.down('form');
    },
    createRecord: function (partnerId, data) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/partnercustomconfigs',
            method: 'POST',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    me.form.data._id = response.data._id;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    },
    modifyRecord: function (partnerId, data) {
        var me = this;
        data.partnerId =  me.partnerId;
        data.clazz = "com.qpp.cgp.domain.partner.customs.PartnerCustomsConfig";
        Ext.Ajax.request({
            url: adminPath + 'api/partnercustomconfigs/'+data._id,
            method: 'PUT',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success == true) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功!');
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
});




