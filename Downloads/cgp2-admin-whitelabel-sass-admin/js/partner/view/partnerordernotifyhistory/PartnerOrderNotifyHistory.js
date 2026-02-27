/**
 * Created by nan on 2017/12/18.
 */
Ext.syncRequire(['CGP.partner.view.partnerordernotifyhistory.store.PartnerOrderNotifyHistoryStore']);
Ext.onReady(function () {
    var store = Ext.create('CGP.partner.view.partnerordernotifyhistory.store.PartnerOrderNotifyHistoryStore', {});
    var controller = Ext.create('CGP.partner.view.partnerordernotifyhistory.controller.Controller');
    window.store = store;
    var page = Ext.create('Ext.ux.ui.GridPage', {
        accessControl: true,
        gridCfg: {
            selType: 'rowmodel',
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true,
                    renderer: function (value, medata, record) {
                        medata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('showOrderNotifyHistoryDetail') + '"';
                        return new Ext.Template('<a style="text-decoration: none;" href="javascript:{handler}">' + value + '</a>').apply({
                            handler: 'showOrderDetail(' + value + ')'
                        });
                    }
                },
                {
                    text: i18n.getKey('partner') + i18n.getKey('name'),
                    dataIndex: 'partnerName',
                    xtype: 'gridcolumn',
                    itemId: 'partnerName',
                    sortable: true
                },
                {
                    text: i18n.getKey('isSuccess'),
                    dataIndex: 'success',
                    xtype: 'booleancolumn',
                    itemId: 'success',
                    sortable: true
                },
                {
                    text: i18n.getKey('message'),
                    dataIndex: 'message',
                    xtype: 'gridcolumn',
                    width: 250,
                    itemId: 'message',
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey("notifyDate"),
                    dataIndex: 'notifyDate',
                    xtype: 'gridcolumn',
                    itemId: 'notifyDate',
                    align: 'center',
                    renderer: function (value, metadata, record) {
                        metadata.style = "color: gray";
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>';
                    }
                },
                {
                    width: 120,
                    autoSizeColumn: false,
                    text: i18n.getKey('config'),
                    dataIndex: 'config',
                    itemId: 'config',
                    xtype: 'gridcolumn',
                    renderer: function (value, medata, record) {
                        var orderNumber = record.get('orderNumber');
                        return new Ext.Template('<a style="text-decoration: none;" href="javascript:{handler}">' + i18n.getKey('checkConfigInfo') + '</a>').apply({
                            handler: 'showConfig(' + record.get('_id') + ')'
                        });
                    }
                },
                {
                    text: i18n.getKey('context'),
                    dataIndex: 'context',
                    xtype: 'componentcolumn',
                    width: 200,
                    itemId: 'context',
                    renderer: function () {

                    }
                },
                {
                    text: i18n.getKey('context'),
                    width: 200,
                    dataIndex: 'context',
                    xtype: "componentcolumn",
                    itemId: 'context',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'displayfield',
                            value: '<a style="text-decoration: none;color:#00e" href="#">' + i18n.getKey('查看上下文') + '</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0];//获取到该html元素下的a元素
                                    var ela = Ext.fly(a);//获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.showContextDetail(record);
                                    });
                                }
                            }
                        };
                    }
                }
            ]
        },
        filterCfg: {
            items: [
                {
                    id: '_id',
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id'
                },
                {
                    name: 'partnerId',
                    xtype: 'combo',
                    pageSize: 25,
                    editable: false,
                    haveReset: true,
                    matchFieldWidth: false,
                    store: Ext.create('CGP.order.store.PartnerStore'),
                    displayField: 'name',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('partner') + i18n.getKey('name'),
                    itemId: 'partnerId'
                },
                {
                    id: 'success',
                    name: 'success',
                    xtype: 'combo',
                    haveReset: true,
                    fieldLabel: i18n.getKey('isSuccess'),
                    itemId: 'success',
                    editable: false,
                    valueField: 'value',
                    displayField: 'name',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {name: 'name', type: 'string'},
                            {name: 'value', type: 'boolean'}
                        ],
                        data: [
                            {name: '是', value: true},
                            {name: '否', value: false}
                        ]
                    })
                }
            ]
        }

    });
});
window.showConfig = function (id) {
    var store = window.store;
    var record = store.findRecord('_id', id);
    var config = record.get('config');
    var items = [];
    for (var i in record.data.config) {
        if (i == 'clazz')
            continue;
        var item = {
            width: 560,
            xtype: 'textfield',
            readOnly: true,
            value: record.data.config[i],
            fieldLabel: i18n.getKey(i)
        };
        if (i == 'headers' || i === 'queryParameters') {
            var subItems = [];
            for (var j in record.data.config[i]) {
                var item2 = {
                    width: 540,
                    xtype: 'textfield',
                    padding: '10 0 10 20',
                    readOnly: true,
                    labelWidth: 83,
                    value: record.data.config[i][j],
                    fieldLabel: i18n.getKey(j)

                };
                subItems.push(item2);
            }

            item = {
                xtype: 'fieldset',
                title: i18n.getKey(i),
                collapsible: false,
                border: false,
                padding: false,
                hidden: subItems.length == 0,
                margin: '0 0 0 -3',
                defaultType: 'textfield',
                defaults: {
                    border: false
                },
                items: subItems
            }
        }
        items.push(item)
    }
    var form = Ext.create('Ext.form.Panel', {
        padding: 10,
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
};
/**
 *
 * @param id
 */
window.showContext = function (id) {
    var store = window.store;
    var record = store.findRecord('_id', id);
    var context = record.get('context')
    var editor = {};
    for (var i in context) {
        editor[i] = {
            xtype: "displayfield",
            readOnly: true
        };
    }
    Ext.create('Ext.window.Window', {
        title: i18n.getKey('checkExtraParams'),
        height: 400,
        width: 400,
        layout: 'fit',
        items: {  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'propertygrid',
            header: false,
            width: 300,
            defaults: {
                readOnly: true
            },
            customEditors: editor,
            source: context
        }
    }).show();
}
/**
 *  查看订单提醒详情
 * @param id
 * @param orderNumber
 */
window.showOrderDetail = function (id) {
    JSOpen({
        id: 'showOrderNotifyHistoryDetailForm',
        url: path + 'partials/partnerordernotifyhistory/showordernotifyhistorydetailform.html?id=' + id,
        title: i18n.getKey('showOrderNotifyHistoryDetail') + '(' + i18n.getKey('orderHistories') + i18n.getKey('id') + ':' + id + ')',
        refresh: true
    })
}