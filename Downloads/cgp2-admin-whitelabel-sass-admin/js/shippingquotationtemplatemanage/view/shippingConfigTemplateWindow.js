/**
 * Create by shirley on 2021/8/27
 * 计费规则模板组件
 * */
Ext.Loader.syncRequire([
    'CGP.areashippingconfigtemplate.store.AreaShippingConfigTemplateStore',
    'CGP.shippingquotationtemplatemanage.store.CountriesStore',
    'CGP.shippingquotationtemplatemanage.controller.Controller'
]);
Ext.define('CGP.shippingquotationtemplatemanage.view.shippingConfigTemplateWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    record: null,
    _panel: null,
    width: 870,
    height: 700,
    alias: 'widget.shippingConfigTemplate',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('add') + i18n.getKey('个数计运费规则');
        var controller = Ext.create('CGP.shippingquotationtemplatemanage.controller.Controller');
        var store = Ext.create('CGP.areashippingconfigtemplate.store.AreaShippingConfigTemplateStore');
        me.items = [
            {
                xtype: 'searchcontainer',
                border: false,
                defaults: {
                    allowBlank: false
                },
                filterCfg: {
                    minHeight: 50,
                    header: false,
                    items: [
                        {
                            xtype: 'actioncolumn',
                            hidden: true
                        },
                        {
                            name: '_id',
                            xtype: 'textfield',
                            hideTrigger: true,
                            allowDecimals: false,
                            fieldLabel: i18n.getKey('id'),
                            itemId: '_id',
                            isLike: false
                        }
                    ]
                },
                gridCfg: {
                    store: store,
                    frame: false,
                    pagingBar: false,
                    columnDefaults: {
                        autoSizeColumn: true,
                        tdCls: 'vertical-middle'
                    },
                    //移除编辑和删除操作
                    deleteAction: false,
                    editAction: false,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            xtype: 'gridcolumn',
                            itemId: 'id',
                            sortable: true,
                            width: 100,
                            align: 'center',
                            padding: 0,
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('country'),
                            dataIndex: 'areas',
                            xtype: 'gridcolumn',
                            itemId: 'areas',
                            width: 250,
                            sortable: true,
                            align: 'center',
                            flex: 3,
                            renderer: function (value, metaData, record, rowIndex) {
                                var textValueArr = [];
                                value.forEach(function (value) {
                                    var textValue = value['countryCode'];
                                    if (!Ext.isEmpty(value['zoneCode'])) {
                                        var textValue = textValue + '(' + value['zoneCode'] + ')';
                                    }
                                    textValueArr.push(textValue);
                                });
                                metaData.tdAttr = 'data-qtip="' + "<div>" + textValueArr.join(',') + "</div>" + '"';
                                // TODO 判断字符长长度，显示“more”按钮添加弹框提示，待完善
                                return textValueArr.join(',');
                            }
                        },
                        {
                            text: i18n.getKey('areaQtyShippingConfigs'),
                            width: 480,
                            align: 'center',
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
                                },
                                {
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
                                }
                            ]
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: store,
                    })
                },
            }
        ];
        me.bbar = {
            items: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = btn.ownerCt.ownerCt.items.items[0];
                        var selectedShippingRules = form.grid.getSelectionModel().getSelection();
                        if (Ext.isEmpty(selectedShippingRules)) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('Select the pricing rule template to be added'));
                            return;
                        }
                        var extraIds = [];
                        selectedShippingRules.forEach(function (shippingRule) {
                            // 动态生成id
                            var id = controller.createId().toString();
                            var areaQtyShippingConfigs = shippingRule.data['areaQtyShippingConfigs'];
                            var areas = shippingRule.data['areas'];
                            var newItem = {
                                _id: id,
                                areaQtyShippingConfigs: areaQtyShippingConfigs,
                                areas: areas,
                                clazz: 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfig'
                            }
                            var proxyData = [];
                            if (!Ext.isEmpty(win._panel)) {
                                proxyData = win._panel.getStore().proxy.data;
                            } else {
                                proxyData = win.record.proxy.data;
                            }
                            for (var i = 0; i < proxyData.length; i++) {
                                if (newItem.areas.length == proxyData[i].areas.length) {
                                    if (win.record && i == win.record.index) {
                                        continue;
                                    }
                                    if (JSObjectValueEqual(newItem.areas, proxyData[i].areas)) {
                                        extraIds.push(shippingRule.data._id);
                                        return;
                                    }
                                }
                            }
                            if (!Ext.isEmpty(win.record)) {
                                win.record.proxy.data.push(newItem);
                                win.record.load();
                            }
                            if (!Ext.isEmpty(win._panel)) {
                                win._panel.getStore().proxy.data.push(newItem);
                                win._panel.getStore().load();
                            }
                        });
                        if (extraIds.length > 0) {
                            console.log(extraIds)
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('以下id配置对应的区域已经存在：<br>' + extraIds.toString() + '<br>不允许重复添加'));
                        }
                        win.close();

                    },
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]
        };
        me.callParent();
    }
});
