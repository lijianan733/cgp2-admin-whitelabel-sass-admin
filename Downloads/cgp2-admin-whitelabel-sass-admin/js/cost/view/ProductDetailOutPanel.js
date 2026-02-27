/**
 * @Description:
 * @author nan
 * @date 2022/9/7
 */
Ext.Loader.syncRequire([
    'CGP.cost.store.MaterialCostStore',
    'CGP.cost.store.ProcessCostStore',
])
Ext.define('CGP.cost.view.ProductDetailOutPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.productdetailoutpanel',
    filterCfg: null,
    costSummaryCfg: null,
    detailGridCfg: null,
    layout: {
        type: 'vbox'
    },
    defaults: {
        width: '100%'
    },
    store: null,
    checkChartHandler: null,///查看图表的处理
    switchViewHandler: null,//切换视图的处理
    productId: '',
    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        var commonRender = Ext.create('CGP.cost.controller.Controller').commonRender;
        var materialCostStore = Ext.create('CGP.cost.store.MaterialCostStore', {
            productId: JSGetQueryString('productId')
        });
        var processCostStore = Ext.create('CGP.cost.store.ProcessCostStore', {
            productId: JSGetQueryString('productId')
        });
        var summaryPanel = Ext.create('CGP.cost.view.SummaryPanel', Ext.Object.merge({
            itemId: 'summary',
            autoLoad: false
        }, me.costSummaryCfg));
        var filterPanel = Ext.create('CGP.cost.view.FilterPanel', Ext.Object.merge({
            itemId: 'filter',
            region: 'west',
            searchActionHandler: function () {
                var filter = this.ownerCt.ownerCt;
                var summary = filter.ownerCt.getComponent('summary');
                if (summary) {
                    summary.refreshData();
                }
                if (filter.isValid()) {
                    var centerPanel = filter.ownerCt.ownerCt.getComponent('centerPanel');
                    var materialCost = centerPanel.getComponent('materialCost');
                    materialCost.store.load();
                    var processCost = centerPanel.getComponent('processCost');
                    processCost.store.load();
                }
            },
        }, me.filterCfg));
        var detailGrid = Ext.create('Ext.panel.Panel', Ext.Object.merge({
            itemId: 'centerPanel',
            autoLoad: false,
            region: 'center',
            flex: 1,
            bodyStyle: {
                borderColor: 'silver'
            },
            defaults: {
                height: '100%',
                flex: 1,
                width: '100%'
            },
            layout: {
                // layout-specific configs go here
                type: 'accordion',
                titleCollapse: true,
                animate: true,
                multi: true,
                activeOnTop: true
            },
            items: [
                {
                    xtype: 'panel',
                    layout: 'fit',
                    itemId: 'materialCost',
                    header: {
                        /*  style: 'background-color:white;',
                          color: 'black',*/
                        title: '<font color=green>' + i18n.getKey('按物料查看物料成本费明细') + '</font>',
                        /*  border: '0 0 1 0'*/
                    },
                    items: [
                        {
                            xtype: 'grid',
                            margin: 5,
                            itemId: 'materialCost',
                            store: materialCostStore,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('material') + i18n.getKey('name'),
                                    dataIndex: 'name',
                                    width: 250,
                                },
                                {
                                    text: i18n.getKey('operation'),
                                    xtype: 'atagcolumn',
                                    sortable: false,
                                    draggable: false,
                                    itemId: 'historyChart',
                                    hideable: false,
                                    width: 150,
                                    resizable: false,
                                    dataIndex: 'description',
                                    getDisplayName: function (value) {
                                        return '<a href="#">' + i18n.getKey('历史平均图表') + '</a>'
                                    },
                                    clickHandler: function (value, metadata, record) {
                                        var materialId = record.get('materialId');
                                        var controller = Ext.create('CGP.cost.controller.Controller');
                                        controller.showMaterialCostChart(materialId);
                                    },
                                    summaryRenderer: function (value, summaryData, dataIndex) {
                                        return '当前页统计'
                                    },
                                },
                                {
                                    text: i18n.getKey('material') + i18n.getKey('description'),
                                    dataIndex: 'description',
                                    width: 250
                                },
                                {
                                    text: i18n.getKey('unit'),
                                    dataIndex: 'unit'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('averageCost') + window.currencyStr,
                                    dataIndex: 'averageCost',
                                    summaryType: 'average',
                                    width: 170,

                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('去年同期') + i18n.getKey('averageCost') + window.currencyStr,
                                    dataIndex: 'lastMaterialAverageCost',
                                    summaryType: 'average',
                                    width: 170,

                                },
                                {
                                    text: i18n.getKey('qty'),
                                    dataIndex: 'qty',
                                    summaryType: 'sum',

                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('totalCost') + window.currencyStr,
                                    dataIndex: 'totalCost',
                                    flex: 1,
                                    minWidth: 100,
                                    width: null,//Extjs 代码bug
                                    summaryType: 'sum',

                                }
                            ],
                            tbar: {
                                xtype: 'uxfilter',
                                header: false,
                                searchActionHandler: function (btn) {
                                    btn.ownerCt.ownerCt.ownerCt.store.load();
                                },
                                items: [
                                    {
                                        xtype: 'datefield',
                                        name: 'startTime',
                                        itemId: 'startTime',
                                        editable: false,
                                        fieldLabel: i18n.getKey('开始时间'),
                                        format: 'Y-m-d H:i:s',
                                        readOnly: true,
                                        fieldStyle: 'background-color:silver',
                                        hidden: true,
                                        value: new Date(parseInt(JSGetQueryString('startTime'))),
                                        diyGetValue: function () {
                                            var me = this;
                                            var data = me.getValue();
                                            if (data) {
                                                return parseInt(new Date(data).getTime());
                                            }
                                        },
                                    },
                                    {
                                        xtype: 'datefield',
                                        name: 'endTime',
                                        itemId: 'endTime',
                                        editable: false,
                                        readOnly: true,
                                        format: 'Y-m-d H:i:s',
                                        fieldLabel: i18n.getKey('结束时间'),
                                        fieldStyle: 'background-color:silver',
                                        hidden: true,
                                        value: new Date(parseInt(JSGetQueryString('endTime'))),
                                        diyGetValue: function () {
                                            var me = this;
                                            var data = me.getValue();
                                            if (data) {
                                                return parseInt(new Date(data).getTime());
                                            }
                                        },
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'name',
                                        itemId: 'name',
                                        fieldLabel: i18n.getKey('material') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'description',
                                        itemId: 'description',
                                        fieldLabel: i18n.getKey('material') + i18n.getKey('description'),
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'catalogName',
                                        itemId: 'catalogName',
                                        isLike: false,
                                        hidden: true,
                                        fieldLabel: i18n.getKey('category') + i18n.getKey('name'),

                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'productId',
                                        itemId: 'productId',
                                        hidden: true,
                                        value: JSGetQueryString('productId'),
                                        fieldLabel: i18n.getKey('productId') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'orderLineItemId',
                                        itemId: 'orderLineItemId',
                                        hidden: true,
                                        value: JSGetQueryString('orderLineItemId'),
                                        fieldLabel: i18n.getKey('orderLineItemId') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'manufactureOrderId',
                                        itemId: 'manufactureOrderId',
                                        hidden: true,
                                        value: JSGetQueryString('manufactureOrderId'),
                                        fieldLabel: i18n.getKey('manufactureOrderId') + i18n.getKey('name'),
                                    },

                                ],
                                bodyStyle: {
                                    borderColor: 'silver'
                                }
                            },
                            bbar: {
                                xtype: 'pagingtoolbar',
                                displayInfo: true,
                                store: materialCostStore,
                            }
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'fit',
                    itemId: 'processCost',
                    header: {
                        /*  style: 'background-color:white;',
                          color: 'black',*/
                        title: '<font color=green>' + i18n.getKey('按工序查看成本费明细(人工费、厂皮费、机器折旧费)') + '</font>',
                        /*  border: '0 0 1 0'*/
                    },
                    items: [
                        {
                            xtype: 'grid',
                            margin: 5,
                            itemId: 'processCost',
                            store: processCostStore,
                            columns: [
                                {
                                    xtype: 'rownumberer',
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    text: i18n.getKey('process') + i18n.getKey('name'),
                                    dataIndex: 'name',
                                    width: 250,
                                    renderer: function (value, metaData, record) {
                                        return value + ' <' + (record.get('isTracking') ? '监控' : '估算') + '>'
                                    }
                                },
                                {
                                    text: i18n.getKey('operation'),
                                    sortable: false,
                                    draggable: false,
                                    hideable: false,
                                    width: 100,
                                    resizable: false,
                                    xtype: 'componentcolumn',
                                    summaryRenderer: function (value, summaryData, dataIndex) {
                                        return '当前页统计'
                                    },
                                    renderer: function (value, metadata, record) {
                                        var processName = record.get('name');
                                        var processId = record.get('processId');
                                        var dpctOfMcn = record.get('dpctOfMcn');
                                        var overhead = record.get('overhead');
                                        var laborCost = record.get('laborCost');
                                        return {
                                            xtype: 'button',
                                            ui: 'default-toolbar-small',
                                            text: i18n.getKey('options'),
                                            width: '100%',
                                            flex: 1,
                                            height: 26,
                                            menu: [
                                                {
                                                    text: i18n.getKey('人工费历史平均图表'),
                                                    hidden: Ext.isEmpty(laborCost),
                                                    handler: function (btn) {
                                                        var controller = Ext.create('CGP.cost.controller.Controller');
                                                        controller.showProcessCostChart('laborCost', processId, processName);
                                                    }
                                                }, {
                                                    text: i18n.getKey('厂皮费历史平均图表'),
                                                    hidden: Ext.isEmpty(overhead),
                                                    handler: function (btn) {
                                                        var controller = Ext.create('CGP.cost.controller.Controller');
                                                        controller.showProcessCostChart('overhead', processId, processName);
                                                    }
                                                }, {
                                                    text: i18n.getKey('机器折旧费历史平均图表'),
                                                    hidden: Ext.isEmpty(dpctOfMcn),
                                                    handler: function (btn) {
                                                        var controller = Ext.create('CGP.cost.controller.Controller');
                                                        controller.showProcessCostChart('dpctOfMcn', processId, processName);
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('laborCost') + window.currencyStr,
                                    dataIndex: 'laborCost',
                                    summaryType: 'sum',
                                    width: 170,

                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('overhead') + window.currencyStr,
                                    dataIndex: 'overhead',
                                    summaryType: 'sum',
                                    width: 170,

                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('dpctOfMcn') + window.currencyStr,
                                    dataIndex: 'dpctOfMcn',
                                    summaryType: 'sum',
                                    width: 170,

                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('workingHours') + ' (小时)',
                                    dataIndex: 'workingHours',
                                    summaryType: 'sum',
                                    width: 170,
                                },
                                {
                                    xtype: 'numbercolumn',
                                    format: '0.00',
                                    text: i18n.getKey('totalCost') + window.currencyStr,
                                    dataIndex: 'totalCost',
                                    flex: 1,
                                    minWidth: 100,
                                    summaryType: 'sum',
                                }
                            ],
                            tbar: {
                                xtype: 'uxfilter',
                                header: false,
                                searchActionHandler: function (btn) {
                                    btn.ownerCt.ownerCt.ownerCt.store.load();
                                },
                                items: [
                                    {
                                        xtype: 'datefield',
                                        name: 'startTime',
                                        itemId: 'startTime',
                                        editable: false,
                                        fieldLabel: i18n.getKey('开始时间'),
                                        format: 'Y-m-d H:i:s',
                                        readOnly: true,
                                        fieldStyle: 'background-color:silver',
                                        hidden: true,
                                        value: new Date(parseInt(JSGetQueryString('startTime'))),
                                        diyGetValue: function () {
                                            var me = this;
                                            var data = me.getValue();
                                            if (data) {
                                                return parseInt(new Date(data).getTime());
                                            }
                                        },
                                    },
                                    {
                                        xtype: 'datefield',
                                        name: 'endTime',
                                        itemId: 'endTime',
                                        editable: false,
                                        readOnly: true,
                                        format: 'Y-m-d H:i:s',
                                        fieldLabel: i18n.getKey('结束时间'),
                                        fieldStyle: 'background-color:silver',
                                        hidden: true,
                                        value: new Date(parseInt(JSGetQueryString('endTime'))),
                                        diyGetValue: function () {
                                            var me = this;
                                            var data = me.getValue();
                                            if (data) {
                                                return parseInt(new Date(data).getTime());
                                            }
                                        },
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'name',
                                        itemId: 'name',
                                        fieldLabel: i18n.getKey('process') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'catalogName',
                                        itemId: 'catalogName',
                                        isLike: false,
                                        hidden: true,
                                        fieldLabel: i18n.getKey('category') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'manufactureOrderId',
                                        itemId: 'manufactureOrderId',
                                        hidden: true,
                                        value: JSGetQueryString('manufactureOrderId'),
                                        fieldLabel: i18n.getKey('manufactureOrderId') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'productId',
                                        itemId: 'productId',
                                        hidden: true,
                                        value: JSGetQueryString('productId'),
                                        fieldLabel: i18n.getKey('productId') + i18n.getKey('name'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'orderLineItemId',
                                        itemId: 'orderLineItemId',
                                        hidden: true,
                                        value: JSGetQueryString('orderLineItemId'),
                                        fieldLabel: i18n.getKey('orderLineItemId') + i18n.getKey('name'),
                                    },
                                ],
                                bodyStyle: {
                                    borderColor: 'silver'
                                }
                            },
                            bbar: {
                                xtype: 'pagingtoolbar', displayInfo: true,
                                store: processCostStore,
                            }
                        },
                    ]
                },
                {
                    xtype: 'panel',
                    hidden: true,
                    title: '以工序流结构查看成本',
                    itemId: 'other',
                    flex: 1,
                    width: '100%',
                    html: '<iframe style="border:none;"  width="100%" height="100%" src="">'
                }
            ]
        }, me.detailGridCfg));
        me.items = [
            Ext.Object.merge({
                xtype: 'uxstandardtoolbar',
                region: 'north',
                hiddenButtons: ['delete', 'import', 'export', 'help', 'config', 'clear'],
            }, me.tbarCfg),
            summaryPanel,
            filterPanel,
            detailGrid
        ];
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            var centerPanel = me.getComponent('centerPanel');
            var filter = me.getComponent('filter');
            var summary = me.getComponent('summary');
            if (filter) {
                var summaryStore = summary.store;
                summaryStore.on('beforeload', function (store) {
                    var p = store.getProxy();
                    p.filter = filter;
                }, {
                    filter: filter
                })
                summaryStore.load();
                var materialCost = centerPanel.getComponent('materialCost').items.items[0];
                var materialCostStore = materialCost.store;
                var filter1 = materialCost.dockedItems.items[1];
                materialCostStore.on('beforeload', function (store) {
                    var p = store.getProxy();
                    p.filter = filter1;
                }, {
                    filter: filter1
                })
                materialCostStore.load();

                var processCost = centerPanel.getComponent('processCost').items.items[0];
                var processCostStore = processCost.store;
                var filter2 = processCost.dockedItems.items[1];
                processCostStore.on('beforeload', function (store) {
                    var p = store.getProxy();
                    p.filter = filter2;
                }, {
                    filter: filter2
                })
                processCostStore.load();

            }
        });
    }
})