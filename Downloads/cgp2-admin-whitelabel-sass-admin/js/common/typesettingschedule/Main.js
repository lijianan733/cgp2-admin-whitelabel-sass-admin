/**
 * @author xiu
 * @date 2022/10/25
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.MainStepBar',
    'CGP.common.typesettingschedule.controller.Controller',
    'CGP.common.typesettingschedule.store.LastTypesettingScheduleStore'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.common.typesettingschedule.store.LastTypesettingScheduleStore', {
            params: {
                sort: '[{"property": "startTime","direction": "DESC"}]'
            }
        }),
        controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
        status = JSGetQueryString('status'),
        orderItemId = JSGetQueryString('orderItemId');

    Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('typesettingschedule'),
        block: 'compose/typesettingschedule',
        editPage: 'edit.html',
        tbarCfg: {
            hidden: true
        },
        gridCfg: {
            store: store,
            isReadOnly: true,
            editActionHandler: function (grid, rowIndex, colIndex) {
                var m = grid.getStore().getAt(rowIndex);
                var orderItemId = m.data.datas.orderItemId;
                var status = m.data.status;
                status !== 'WAITING' ? JSOpen({
                    id: 'typesettingschedule',
                    url: path + 'partials/compose/typesettingschedule/edit.html?id=' + m.get(m.idProperty) + '&orderItemId=' + orderItemId,
                    title: i18n.getKey('check') + '_' + i18n.getKey('typesettingschedule') + '(' + m.get(m.idProperty) + ')',
                    refresh: true
                }) : Ext.Msg.alert(i18n.getKey('prompt'), '排版未开始请稍后!');
            },
            columns: [
                {
                    text: i18n.getKey('orderNumber'),
                    width: 150,
                    dataIndex: 'datas',
                    renderer: function (value, metadata, record) {
                        if (value) {
                            return value['orderNumber'];
                        }
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('orderLineItem'),
                    width: 100,
                    dataIndex: 'datas',
                    getDisplayName: function (value) {
                        return '<a href="#">' + value['orderItemId'] + '</a>'
                    },
                    clickHandler: function (value, metadata, record) {
                        var {orderItemId, isTest} = value;
                        var url = location.origin + '/qpson-admin/partials/orderlineitem/orderlineitem.html' +
                            '?id=' + orderItemId +
                            '&isTest2=' + isTest;
                        JSOpen({
                            id: 'orderLineItem',
                            url: url,
                            title: i18n.getKey('orderLineItem'),
                            refresh: true
                        })
                    },
                    sortable: false,
                },
                {
                    text: i18n.getKey('status'),
                    width: 150,
                    dataIndex: 'status',
                    renderer: function (value) {
                        if (value) {
                            var color = {
                                FINISHED: 'green',
                                FAILURE: '#DC143C',
                                RUNNING: '#1D7DA7',
                                WAITING: '#999999'
                            };
                            return controller.getTitleBold(color[value], true, i18n.getKey(value));
                        }
                    }
                },
                {
                    text: i18n.getKey('productInfo'),
                    width: 300,
                    dataIndex: 'datas',
                    renderer: function (value) {
                        var result;
                        var productInfo = value['productInfo']
                        if (productInfo) {
                            result = [
                                {
                                    title: i18n.getKey('sku'),
                                    value: i18n.getKey(productInfo['productSku'])
                                },
                                {
                                    title: i18n.getKey('name'),
                                    value: i18n.getKey(productInfo['productName'])
                                }
                            ]
                        }
                        return JSCreateHTMLTable(result);

                    }
                },
                {
                    xtype: 'imagecolumn',
                    tdCls: 'vertical-middle',
                    width: 150,
                    dataIndex: 'datas',
                    text: i18n.getKey('thumbnail'),
                    //订单的缩略图特殊位置
                    buildUrl: function (value, metadata, record) {
                        var thumbnail = value['productInfo']['thumbnail'];
                        return projectThumbServer + thumbnail;
                    },
                    //订单的缩略图特殊位置
                    buildPreUrl: function (value, metadata, record) {
                        var thumbnail = value['productInfo']['thumbnail'];
                        return projectThumbServer + thumbnail;
                    },
                },
                {
                    text: i18n.getKey('version'),
                    width: 150,
                    dataIndex: 'datas',
                    renderer: function (value, metadata, record) {
                        if (value) {
                            return value['version'];
                        }
                    }
                },
                {
                    text: i18n.getKey('执行时间'),
                    minWidth: 400,
                    flex: 1,
                    dataIndex: 'startTime',
                    renderer: function (value, metadata, record) {
                        var startTime = controller.getEndTime(value);
                        var endTime = controller.getEndTime(record.get('endTime'));
                        var time = startTime + ` ~ ` + endTime;
                        return JSCreateHTMLTable([
                            {
                                title: i18n.getKey('执行时间'),
                                value: time
                            },
                            {
                                title: i18n.getKey('用时'),
                                value: record.get('endTime') && JSGetTakeTime(value, record.get('endTime'))
                            }
                        ]);
                    }
                },
            ]
        },
        filterCfg: {
            height: 'auto',
            items: [
                {
                    xtype: 'textfield',
                    name: 'orderNumber',
                    itemId: 'orderNumber',
                    isLike: false,
                    fieldLabel: i18n.getKey('orderNumber')
                },
                {
                    xtype: 'textfield',
                    name: 'orderItemId',
                    itemId: 'orderItemId',
                    isLike: false,
                    fieldLabel: i18n.getKey('orderLineItem'),
                    listeners: {
                        afterrender: function (comp) {
                            orderItemId && comp.setValue(orderItemId);
                        }
                    }
                },
                {
                    xtype: 'combo',
                    name: 'status',
                    itemId: 'status',
                    isLike: false,
                    editable: false,
                    value: 'RUNNING',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                key: 'FINISHED',
                                value: i18n.getKey('FINISHED'),
                            },
                            {
                                key: 'FAILURE',
                                value: i18n.getKey('FAILURE'),
                            },
                            {
                                key: 'RUNNING',
                                value: i18n.getKey('RUNNING'),
                            },
                            {
                                key: 'WAITING',
                                value: i18n.getKey('WAITING'),
                            },
                        ]
                    },
                    valueField: 'key',
                    displayField: 'value',
                    fieldLabel: i18n.getKey('status'),
                    listeners: {
                        afterrender: function (comp) {
                            status && comp.setValue(status);
                        }
                    }
                }
            ]
        }
    });
})
