/**
 * @Description:
 * @author nan
 * @date 2023/9/18
 */
Ext.Loader.syncRequire([
    'CGP.qpconfig.postageconfig.model.ShipmentConfigModel'
])

Ext.onReady(function () {
    var currencyStore = Ext.create('CGP.currency.store.Currency');
    var postageConfigStore = Ext.create('CGP.postageconfigforweight.store.PostageConfigStore');
    var page = Ext.widget({
        xtype: 'uxeditpage',
        i18nblock: i18n.getKey('QP重量计运费'),
        tbarCfg: {
            hiddenButtons: ['create', 'copy', 'grid'],
            btnReset: {
                iconCls: 'icon_delete',
                text: '删除',
                handler: function (btn) {
                    var recordId = btn.ownerCt.ownerCt.record.getId();
                    if (recordId) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), '是否删除当前QP重量计算运费配置?', function (selector) {
                            if (selector == 'yes') {
                                var url = adminPath + 'api/shipmentConfigs/' + recordId;
                                JSAjaxRequest(url, 'DELETE', true, null, null, function (require, success, response) {
                                    location.reload();
                                }, true);
                            }
                        })
                    }
                    /*
                                    JSAjaxRequest('')
                    */
                }
            }
        },
        formCfg: {
            layout: {
                layout: 'vbox',
            },
            defaults: {
                margin: '5 25',
                width: 350,
            },
            fieldDefaults: {},
            model: 'CGP.qpconfig.postageconfig.model.ShipmentConfigModel',
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name')
                },
                {
                    xtype: 'textfield',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: i18n.getKey('description')
                },
                {
                    xtype: 'textfield',
                    name: 'code',
                    itemId: 'code',
                    fieldLabel: i18n.getKey('code')
                },
                {
                    xtype: 'combo',
                    name: 'postageCountType',
                    itemId: 'postageCountType',
                    fieldLabel: i18n.getKey('计算运费方式'),
                    value: 'WEIGHT_BASED',
                    editable: false,
                    readOnly: true,
                    hidden: true,
                    allowBlank: false,
                    valueField: 'value',
                    displayField: 'display',
                    fieldStyle: 'background-color:silver',
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                display: i18n.getKey('根据重量计算运费'),
                                value: 'WEIGHT_BASED'
                            },
                            {
                                display: i18n.getKey('根据数量计算运费'),
                                value: 'QTY_BASED'
                            },
                        ]
                    }
                },
                {
                    xtype: 'gridcombo',
                    name: 'postageConfig',
                    itemId: 'postageConfig',
                    fieldLabel: i18n.getKey('计算运费规则'),
                    valueField: '_id',
                    displayField: 'name',
                    store: postageConfigStore,
                    allowBlank: false,
                    matchFieldWidth: false,
                    editable: false,
                    gridCfg: {
                        height: 450,
                        width: 500,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                itemId: 'id',
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                itemId: 'name',
                                flex: 1
                            },
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: postageConfigStore,
                        }
                    },
                    gotoConfigHandler: function () {
                        var modelId = this.getSubmitValue()[0];
                        JSOpen({
                            id: 'postageconfigforweightpage',
                            url: path + 'partials/postageconfigforweight/main.html?_id=' + modelId,
                            title: i18n.getKey('重量计运费规则'),
                            refresh: true,
                        })
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setInitialValue([data._id]);
                        }
                    }
                },
                {
                    xtype: 'gridcombo',
                    name: 'currencyCode',
                    itemId: 'currencyCode',
                    valueField: 'code',
                    displayField: 'code',
                    fieldLabel: i18n.getKey('currencyCode'),
                    store: currencyStore,
                    allowBlank: false,
                    matchFieldWidth: false,
                    editable: false,
                    valueType: 'id',//recordData,idReference,id为可选的值类型
                    gridCfg: {
                        store: currencyStore,
                        height: 280,
                        width: 600,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: 'id',
                                width: 90,
                            }, {
                                text: i18n.getKey('title'),
                                dataIndex: 'title',
                            }, {
                                text: i18n.getKey('code'),
                                dataIndex: 'code',
                                renderer: function (value, metadata) {
                                    metadata.style = "font-weight:bold";
                                    return value;
                                }
                            }, {
                                text: i18n.getKey('exchangeRate') + "(" + i18n.getKey("default") + i18n.getKey('currency') + ")",
                                dataIndex: 'value',
                                width: 120,
                                renderer: function (value, metadata) {
                                    metadata.style = "font-weight:bold";
                                    return value;
                                }
                            }, {
                                text: i18n.getKey('preview'),
                                sortable: false,
                                flex: 1,
                                renderer: function (value, metadata, record) {
                                    var exampleNumber = "100000000",
                                        point = record.get("decimalPoint"),
                                        places = record.get("decimalPlaces");
                                    var start = exampleNumber.length;
                                    var pre = exampleNumber.slice(0, start - places);
                                    var after = exampleNumber.slice(start - places);
                                    if (places > 0) {
                                        exampleNumber = pre + point + after;
                                        start = start - places;
                                    }
                                    for (; start > 3;) {
                                        pre = exampleNumber.slice(0, start - 3);
                                        after = exampleNumber.slice(start - 3);
                                        exampleNumber = pre + record.get("thousandsPoint") + after;
                                        start = start - 3;
                                    }
                                    return '<b>' + record.get("symbolLeft") + " " + exampleNumber + record.get("symbolRight") + " " + "</b>";
                                }
                            }],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: currencyStore,
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.setValue({
                            code: data
                        })
                    }
                },
                {
                    xtype: 'checkbox',
                    name: 'available',
                    itemId: 'available',
                    fieldLabel: i18n.getKey('是否激活')
                }
            ],
            listeners: {
                afterrender: function () {
                    var me = this;
                    var url = adminPath + 'api/shipmentConfigs?page=1&start=0&limit=25&filter=[{"name":"postageCountType","value":"WEIGHT_BASED","type":"string"}]';
                    JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                var toolbar = me.getDockedItems('[itemId=toolbar]')[0];
                                var deleteBtn = toolbar.getComponent('btnReset');
                                var data = responseText.data.content[0];
                                deleteBtn.setDisabled(Ext.isEmpty(data));
                                if (data) {
                                    var model = Ext.ModelManager.getModel(me.model);
                                    var record = new model(data);
                                    me.record = record;
                                    me.form.owner.toEditMode();
                                    me.form.loadModel(record);
                                    me.form.afterAction(me, true);
                                    me.form.owner.toEditMode();
                                }
                            }
                        }
                    })

                }
            }
        },
    });
});
