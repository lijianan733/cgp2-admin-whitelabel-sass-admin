/**
 * Created by admin on 2019/4/10.
 */
Ext.onReady(function () {

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var orderLineItemId = getQueryString('orderLineItemId');
    var controller = Ext.create('CGP.orderlineitem.view.jobtaskdistribute.controller.Controller');
    var storeDistribute = Ext.create('CGP.orderlineitem.view.jobtaskdistribute.store.JobTaskDistribute', {
        orderLineItemId: orderLineItemId
    });
    var grid = Ext.create('Ext.ux.grid.Panel', {
        editAction: false,
        deleteAction: false,
        store: storeDistribute,
        width: '100%',
        padding: 10,
        columns: [
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                xtype: 'componentcolumn',
                itemId: '_id',
                sortable: true,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="查看详情"';
                    return {
                        xtype: 'displayfield',
                        value: value
                        // value: '<a href="#" id="click-JobTaskDistribute" style="color: blue">' + value + '</a>',
                        // listeners: {
                        //     render: function (display) {
                        //         var clickElement = document.getElementById('click-JobTaskDistribute');
                        //         clickElement.addEventListener('click', function () {
                        //             JSOpen({
                        //                 id: 'JobTaskDistributeDetails',
                        //                 itemId: "JobTaskDistribute",
                        //                 url: path + 'partials/orderlineitem/details.html?id=' + record.get('_id'),
                        //                 layout: 'fit',
                        //                 title: i18n.getKey('JobTaskDistribute') + "(" + record.get('_id') + ")"
                        //             });
                        //         });
                        //     }
                        // }
                    }
                }
            },
            {
                sortable: false,
                text: i18n.getKey('operation'),
                width: 110,
                autoSizeColumn: false,
                xtype: 'componentcolumn',
                dataIndex: 'histories',
                renderer: function (value, metadata, record, row, col, store) {
                    var status=record.get('status');

                    return {
                        xtype: 'toolbar',
                        layout: 'column',
                        style: 'padding:0',
                        default: {
                            width: 100
                        },
                        items: [
                            {
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            text: i18n.getKey('check') + i18n.getKey('历史记录'),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                controller.checkLog(value);
                                            }
                                        },
                                        {
                                            text: i18n.getKey('retry') ,
                                            hidden: controller.showRetry(status,value),
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                controller.setStatus(record, store);
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    };
                }
            },
            {
                text: i18n.getKey('singleJobConfig') + 'Id',
                dataIndex: 'singleJobConfigId',
                xtype: 'gridcolumn',
                itemId: 'singleJobConfigId',
                width: 120,
                sortable: true
            },
            {
                text: i18n.getKey('jobType'),
                dataIndex: 'jobType',
                xtype: 'gridcolumn',
                itemId: 'jobType',
                width: 120,
                sortable: true,
                renderer: function (value, metadata, record) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('distribute') + i18n.getKey('status'),
                dataIndex: 'status',
                xtype: 'componentcolumn',
                itemId: 'status',
                width: 200,
                sortable: true,
                renderer: function (value, metadata, record, row, col, store) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    var comp = {
                        xtype: 'fieldcontainer',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'displayfield',
                                value: value
                            },
                            {
                                xtype: 'displayfield',
                                hidden: controller.showRetry(record.get('status'),record.get('histories')),
                                value: '<a href="#" id="click-retry" style="color: blue">'+i18n.getKey('retry') +'</a>',
                                listeners: {
                                    render: function (display) {
                                        var clickElement = document.getElementById('click-retry');
                                        clickElement.addEventListener('click', function () {
                                            controller.setStatus(record, store);
                                        });
                                    }
                                }
                            }
                        ]
                    };
                    return comp;
                }
            },
            {
                text: i18n.getKey('jobBatchId'),
                dataIndex: 'jobBatchIds',
                xtype: 'gridcolumn',
                itemId: 'jobBatchIds',
                width: 120,
                sortable: true,
                renderer: function (value, metadata, record) {
                    var val = value.toString();
                    metadata.tdAttr = 'data-qtip="' + val + '"';
                    return val;
                }
            },
            {
                text: i18n.getKey('impression'),
                dataIndex: 'impressions',
                xtype: 'gridcolumn',
                itemId: 'impressions',
                width: 120,
                sortable: true,
                renderer: function (value, metadata, record) {
                    var val = value.length;
                    metadata.tdAttr = 'data-qtip="' + val + '"';
                    return val;
                }
            },
            {
                text: i18n.getKey('document'),
                dataIndex: 'documents',
                xtype: 'gridcolumn',
                itemId: 'documents',
                width: 120,
                sortable: true,
                renderer: function (value, metadata, record) {
                    var val = value.length;
                    metadata.tdAttr = 'data-qtip="' + val + '"';
                    return val;
                }
            }
        ]
    });
    var page = Ext.create('Ext.container.Viewport', {
        width: '100%',
        grid: grid,
        items: [
            grid
        ]
    });
});