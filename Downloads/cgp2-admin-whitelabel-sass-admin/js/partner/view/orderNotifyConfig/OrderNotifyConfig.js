/**
 * Created by nan on 2017/12/19.
 */
Ext.syncRequire(['CGP.partner.view.orderNotifyConfig.store.OrderNotifyConfigStore', 'CGP.partner.view.orderNotifyConfig.model.RestHttpRequestConfigModel']);
Ext.onReady(function () {
    var partnerId = JSGetQueryString('id');
    var store = Ext.create('CGP.partner.view.orderNotifyConfig.store.OrderNotifyConfigStore', {
        partnerId: partnerId,
        params: ''
    });
    store.sort('_id');
    var controller = Ext.create('CGP.partner.view.orderNotifyConfig.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('orderNotify') + i18n.getKey('config'),
        block: 'partner',
        editPage: 'orderNotifyconfigedit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (grid, rowIndex, colIndex) {
                    JSOpen({
                        id: 'orderNotifyconfigedit',
                        url: path + 'partials/partner/orderNotifyconfigedit.html?partnerId=' + partnerId,
                        title: i18n.getKey('create') + '_' + i18n.getKey('orderNotify') + i18n.getKey('config'),
                        refresh: true
                    });
                }
            }
        },
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                width: 200
            },
            editActionHandler: function (grid, rowIndex, colIndex) {
                var m = grid.getStore().getAt(rowIndex);
                JSOpen({
                    id: 'orderNotifyconfigedit',
                    url: path + 'partials/partner/orderNotifyconfigedit.html?recordId=' + m.get(m.idProperty) + "&partnerId=" + partnerId,
                    title: i18n.getKey('edit') + '_' + i18n.getKey('orderNotify') + i18n.getKey('config'),
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('orderStatus'),
                    dataIndex: 'statusName',
                    xtype: 'gridcolumn',
                    itemId: 'statusName'
                },
                {
                    text: i18n.getKey('testOrNot'),
                    dataIndex: 'test',
                    xtype: 'booleancolumn',
                    itemId: 'test',
                    renderer: function (value) {
                        if (value) {
                            return i18n.getKey('是')
                        } else
                            return i18n.getKey('否')
                    }
                },
                {
                    text: i18n.getKey('restHttpRequestConfigs'),
                    width: 200,
                    xtype: "componentcolumn",
                    renderer: function (value, medata, record) {
                        return new Ext.Template('<a style="text-decoration: none;" href="javascript:{handler}">' + i18n.getKey('check') + i18n.getKey('restHttpRequestConfigs') + '</a>').apply({
                            handler: 'showRestHttpRequestConfigs(' + record.get('_id') + ')'
                        });
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    id: '_id',
                    name: 'notifications._id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: '_id'
                },
                {
                    id: 'statusName',
                    name: 'notifications.statusName',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('CGP.orderlineitem.store.OrderItemStatus'),
                    fieldLabel: i18n.getKey('orderStatus'),
                    valueField: 'name',
                    displayField: 'name',
                    itemId: 'statusName'
                },
                {
                    id: 'test',
                    name: 'notifications.isTest',
                    xtype: 'combo',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'name',
                                type: 'string'
                            },
                            {
                                name: 'value',
                                type: 'boolean'
                            }
                        ],
                        data: [
                            {
                                name: '是',
                                value: true
                            },
                            {
                                name: '否',
                                value: false
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    editable: false,
                    isLike: false,
                    fieldLabel: i18n.getKey('testOrNot'),
                    itemId: 'test'
                }
            ]
        }
    });
    window.orderNotifyStore = store;
});
window.showRestHttpRequestConfigs = function (id) {
    var store = window.orderNotifyStore;
    var record = store.findRecord('_id', id);
    var restHttpRequestConfigs = record.get('restHttpRequestConfigs');
    var items = [];
    var headersItems = [];
    var queryParametersItems = [];
    for (var i = 0; i < restHttpRequestConfigs.length; i++) {
        var config = restHttpRequestConfigs[i];
        var nextItem = [];
        for (var j in config) {
            var configItem = {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey(j),
                value: config[j]
            };
            if (j == 'clazz') {
                continue;
            }
            ;
            if (j == 'headers' || j == 'queryParameters') {
                var items2 = [];
                for (var k in config[j]) {
                    var item2 = {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey(k),
                        value: config[j][k]
                    };
                    items2.push(item2)
                }
                configItem = {
                    xtype: 'fieldset',
                    padding: false,
                    margin: '0 0 0 0',
                    title: i18n.getKey(j),
                    fieldLabel: i18n.getKey(j),
                    defaults: {
                        margin: '0 0 0 30'
                    },
                    items: items2
                };
            }
            nextItem.push(configItem);

        }
        var item = {
            xtype: 'fieldset',
            title: i18n.getKey('config') + (i + 1),
            collapsible: true,
            items: nextItem
        };
        items.push(item)
    }
    var form = Ext.create('Ext.form.Panel', {
        padding: 10,
        autoScroll: true,
        border: false,
        items: items
    });
    Ext.create('Ext.window.Window', {
        title: i18n.getKey('configInfo'),
        height: 400,
        width: 600,
        layout: 'fit',
        items: form
    }).show();
}