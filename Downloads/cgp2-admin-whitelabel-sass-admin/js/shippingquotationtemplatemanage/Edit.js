/***
 *Created by shirley on 2021/8/25
 *
 *  */
Ext.Loader.syncRequire([

    'CGP.shippingquotationtemplatemanage.store.AreaShippingConfigGroupStore',
    'CGP.shippingquotationtemplatemanage.model.AreaShippingConfigGroupModel',
    /*    'CGP.shippingquotationtemplatemanage.view.EditCustomShippingWindow',
        'CGP.shippingquotationtemplatemanage.controller.Controller',
        'CGP.shippingquotationtemplatemanage.view.shippingConfigTemplateWindow'
        'CGP.shippingquotationtemplatemanage.store.CurrencyStore',*/
])
Ext.onReady(function () {
    var controller = Ext.create('CGP.shippingquotationtemplatemanage.controller.Controller');
    var currencyData = Ext.create('CGP.shippingquotationtemplatemanage.store.CurrencyStore');
    var page = Ext.widget({
            block: 'shippingquotationtemplatemanage',
            xtype: 'uxeditpage',
            gridPage: 'main.html',
            tbarCfg: {
                //隐藏无用按钮
                sepEdit: {
                    hidden: true
                },
                sepData: {
                    hidden: true
                },
                btnCreate: {
                    hidden: true
                },
                btnCopy: {
                    hidden: true
                },
                btnGrid: {
                    hidden: true
                },
                btnConfig: {
                    hidden: true
                },
                btnReset: {
                    hidden: true
                }
            },
            formCfg: {
                model: 'CGP.shippingquotationtemplatemanage.model.AreaShippingConfigGroupModel',
                remoteCfg: false,
                columnCount: 1,
                // 遍历容器中所有类型的组件
                useForEach: true,
                defaults: {},
                fieldDefaults: {
                    labelAlign: 'right',
                    width: false,
                    validateOnChange: false,
                    plugins: [
                        {
                            ptype: 'uxvalidation'
                        }
                    ]
                },
                items: [
                    {
                        name: 'name',
                        xtype: 'textfield',
                        itemId: 'name',
                        width: 380,
                        fieldLabel: i18n.getKey('name'),
                        allowBlank: false
                    },
                    {
                        name: 'currencyCode',
                        xtype: 'gridcombo',
                        itemId: 'currencyCode',
                        fieldLabel: i18n.getKey('currencyCode'),
                        editable: false,
                        isLike: true,
                        allowBlank: false,
                        displayField: 'code',
                        width: 380,
                        matchFieldWidth: false,
                        autoScroll: true,
                        diySetValue: function (data) {
                            var me = this;
                            if (!Ext.isEmpty(data)) {
                                me.setRawValue(data);
                            }
                        },
                        diyGetValue: function () {
                            var me = this;
                            if (!Ext.isEmpty(me.getRawValue())) {
                                return me.getRawValue();
                            }
                        },
                        store: currencyData,
                        filterCfg: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                margin: '5 0 5 0',
                                isLike: false,
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: 'id',
                                    isLike: false,
                                    itemId: 'id',
                                    hideTrigger: true
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('title'),
                                    name: 'title',
                                    itemId: 'title',
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('code'),
                                    name: 'code',
                                    itemId: 'code',
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'website.id',
                                    value: 11,
                                    hidden: true
                                }
                            ]
                        },
                        gridCfg: {
                            height: 300,
                            width: 550,
                            viewConfig: {
                                enableTextSelection: true
                            },
                            autoScroll: true,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    width: 50
                                },
                                {
                                    text: i18n.getKey('id'),
                                    width: 80,
                                    dataIndex: 'id',
                                    renderer: function (value, metaData) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('title'),
                                    flex: 1,
                                    dataIndex: 'title',
                                    renderer: function (value, metaData, record, rowIndex) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('code'),
                                    flex: 1,
                                    dataIndex: 'code',
                                    renderer: function (value, metaData, record, rowIndex) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('value'),
                                    flex: 1,
                                    dataIndex: 'value',
                                    renderer: function (value, metaData, record, rowIndex) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('symbol'),
                                    flex: 1,
                                    dataIndex: 'symbol',
                                    renderer: function (value, metaData, record, rowIndex) {
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                        return value;
                                    }
                                }
                            ],
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: currencyData,
                            })
                        }
                    },
                    {
                        name: 'tags',
                        xtype: 'arraydatafield',
                        fieldLabel: i18n.getKey('tag group'),
                        itemId: 'tags',
                        width: 500,
                        height: 350,
                        grow: true,
                        editable: true,
                        tipInfo: '添加该运费报价关联的产品信息',
                        resultType: 'Array',
                        emptyText: '值为一数组,如：[]',
                    },
                    {
                        name: 'areaShippingConfigs',
                        xtype: 'gridfield',
                        id: 'areaShippingConfigsId',
                        width: 870,
                        allowBlank: false,
                        itemId: 'areaShippingConfigs',
                        fieldLabel: i18n.getKey('valuation rule'),
                        gridConfig: {
                            height: 350,
                            autoScroll: true,
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {
                                        name: '_id',
                                        type: 'string',
                                        useNull: true
                                    },
                                    {
                                        name: 'areas',
                                        type: 'array'
                                    }, {
                                        name: 'areaQtyShippingConfigs',
                                        type: 'array'
                                    }, {
                                        name: 'clazz',
                                        type: 'string',
                                        defaultValue: 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfig'
                                    }],
                                data: [],
                                proxy: {
                                    type: 'memory',
                                }
                            }),
                            tbar: [{
                                xtype: 'button',
                                text: i18n.getKey('add'),
                                iconCls: 'icon_create',
                                width: 80,
                                menu: {
                                    items: [
                                        {
                                            text: i18n.getKey('customBillingRule'),
                                            itemId: 'shippingConfig',
                                            handler: function (btn) {
                                                var me = this;
                                                var _panel = Ext.getCmp('areaShippingConfigsId');
                                                var win = Ext.create('CGP.shippingquotationtemplatemanage.view.EditCustomShippingWindow', {
                                                    _panel: _panel
                                                });
                                                win.show();
                                            }
                                        },
                                        {
                                            text: i18n.getKey('个数计运费规则'),
                                            itemId: 'shippingConfigTemplate',
                                            handler: function (btn) {
                                                var areaShippingConfigsId = Ext.getCmp('areaShippingConfigsId');
                                                var record = areaShippingConfigsId.getStore();
                                                var win = Ext.create('CGP.shippingquotationtemplatemanage.view.shippingConfigTemplateWindow', {
                                                    record: record
                                                });
                                                win.show();
                                            }
                                        }
                                    ]
                                },
                            }],
                            columns: [
                                {
                                    xtype: 'actioncolumn',
                                    itemId: 'actioncolumn',
                                    sortable: false,
                                    resizable: true,
                                    menuDisabled: true,
                                    tdCls: 'vertical-middle',
                                    items: [
                                        {
                                            iconCls: 'icon_edit icon_margin',
                                            itemId: 'actionedit',
                                            tooltip: i18n.getKey('edit'),
                                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                                var win = Ext.create('CGP.shippingquotationtemplatemanage.view.EditCustomShippingWindow', {
                                                    record: record,
                                                    rowIndex: rowIndex
                                                });
                                                win.show();
                                            }
                                        },
                                        {
                                            iconCls: 'icon_remove icon_margin',
                                            itemId: 'actiondelete',
                                            tooltip: i18n.getKey('destroy'),
                                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                                var store = view.getStore();
                                                store.removeAt(rowIndex);
                                                if (store.proxy.data) {//处理本地数据
                                                    store.proxy.data.splice(rowIndex, 1);
                                                }
                                            }
                                        }]
                                },
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id',
                                    flex: 1,
                                    hidden: true
                                },
                                {
                                    text: i18n.getKey('country'),
                                    dataIndex: 'areas',
                                    align: 'center',
                                    sortable: true,
                                    flex: 2,
                                    renderer: function (value, metaData, record, rowIndex) {
                                        var textValueArr = [];
                                        value.forEach(function (value) {
                                            var textValue = value['countryCode'];
                                            if (!Ext.isEmpty(value['zoneCode'])) {
                                                textValue = textValue + '(' + value['zoneCode'] + ')';
                                            }
                                            textValueArr.push(textValue);
                                        });
                                        metaData.tdAttr = 'data-qtip="' + "<div>" + textValueArr.join(',') + "</div>" + '"';
                                        return JSAutoWordWrapStr(textValueArr.join(','));
                                    }
                                },
                                {
                                    text: i18n.getKey('areaQtyShippingConfigs'),
                                    width: 300,
                                    menuDisabled: true,
                                    dataIndex: 'areaQtyShippingConfigs',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: [{
                                            name: 'firstQty',
                                            type: 'int'
                                        }, {
                                            name: 'firstPrice',
                                            type: 'double'
                                        }, {
                                            name: 'additionalQty',
                                            type: 'int'
                                        }, {
                                            name: 'additionalPrice',
                                            type: 'double'
                                        }],
                                        proxy: {
                                            type: 'memory',
                                        }
                                    }),
                                    columns: [
                                        {
                                            text: i18n.getKey('firstQty'),
                                            width: 120,
                                            align: 'center',
                                            style: {
                                                padding: 0,
                                            },
                                            innerCls: 'areaQtyShippingConfigs-inner',
                                            sortable: true,
                                            menuDisabled: true,
                                            renderer: function (value, metaData, record, rowIndex) {
                                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                                var ele = controller.rendererEle('firstQty', areaQtyShippingConfigsData);
                                                return ele;
                                            }
                                        },
                                        {
                                            text: i18n.getKey('firstPrice'),
                                            width: 120,
                                            align: 'center',
                                            sortable: true,
                                            menuDisabled: true,
                                            innerCls: 'areaQtyShippingConfigs-inner',
                                            renderer: function (value, metaData, record, rowIndex) {
                                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                                var ele = controller.rendererEle('firstPrice', areaQtyShippingConfigsData);
                                                return ele;
                                            }
                                        },
                                        {
                                            text: i18n.getKey('additionalQty'),
                                            width: 120,
                                            align: 'center',
                                            padding: 0,
                                            sortable: false,
                                            menuDisabled: true,
                                            innerCls: 'areaQtyShippingConfigs-inner',
                                            renderer: function (value, metaData, record, rowIndex) {
                                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                                var ele = controller.rendererEle('additionalQty', areaQtyShippingConfigsData);
                                                return ele;
                                            }
                                        }, {
                                            text: i18n.getKey('additionalPrice'),
                                            width: 120,
                                            align: 'center',
                                            sortable: true,
                                            menuDisabled: true,
                                            innerCls: 'areaQtyShippingConfigs-inner',
                                            renderer: function (value, metaData, record, rowIndex) {
                                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                                var ele = controller.rendererEle('additionalPrice', areaQtyShippingConfigsData);
                                                return ele;
                                            }
                                        }]
                                }
                            ]
                        }
                    }
                ]
            },
        })
    ;
});