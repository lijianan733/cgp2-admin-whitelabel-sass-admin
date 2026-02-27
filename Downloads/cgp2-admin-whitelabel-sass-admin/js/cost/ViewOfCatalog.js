/**
 * @Description: 从产品分类视角查看
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.view.OutPanel',
    'CGP.cost.store.ViewOfCatalogStore',
    'CGP.cost.store.CostStore'
])
Ext.onReady(function () {
    var viewOfCatalogStore = Ext.create('CGP.cost.store.ViewOfCatalogStore', {
        autoLoad: false,

    });
    var costDetailStore = Ext.create('CGP.cost.store.CostDetailStore', {
        pageSize: 1,
        autoLoad: false,
    });
    window.currencyStr = ' (HK$)';
    var commonRender = Ext.create('CGP.cost.controller.Controller').commonRender;
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'outpanel',
            tbarCfg: {
                btnCreate: {
                    text: '总成本分析图表',
                    width: 170,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showCostChart(JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },
            },
            detailGridCfg: {
                columnLines: true,
                store: viewOfCatalogStore,
                columns: {
                    defaults: {
                        tdCls: 'vertical-middle',
                        width: 130,
                    },
                    items: [
                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                            width: 50
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
                                var catalogName = record.get('productCategoryName');
                                var productCategoryId = record.get('productCategoryId');
                                return {
                                    xtype: 'button',
                                    ui: 'default-toolbar-small',
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    height: 26,
                                    menu: [
                                        {
                                            text: i18n.getKey('分类成本核算明细'),
                                            handler: function (btn) {
                                                JSOpen({
                                                    id: 'ViewOfProduct',
                                                    url: path + 'partials/cost/viewofproduct.html?catalogId=' + productCategoryId +
                                                        '&catalogName=' + catalogName +
                                                        '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                                                    title: i18n.getKey('分类成本核算明细') + '(分类名：' + catalogName + ')',
                                                    refresh: true
                                                })
                                            }
                                        }
                                    ]
                                };
                            }
                        },
                        {
                            dataIndex: 'productCategoryName',
                            width: 250,
                            text: i18n.getKey('catalog') + i18n.getKey('name'),
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'materialCost',
                            text: i18n.getKey('materialCost') + window.currencyStr,
                            summaryType: 'sum',
                            summaryRenderer: commonRender
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'laborCost',
                            text: i18n.getKey('laborCost') + window.currencyStr,
                            summaryType: 'sum',
                            summaryRenderer: commonRender
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'overhead',
                            text: i18n.getKey('overhead') + window.currencyStr,
                            summaryType: 'sum',
                            summaryRenderer: commonRender
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'dpctOfMcn',
                            text: i18n.getKey('dpctOfMcn') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            dataIndex: 'qty',
                            text: i18n.getKey('totalQty'),
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'averageCost',
                            text: i18n.getKey('averageCost') + window.currencyStr,
                            summaryType: 'average',
                            summaryRenderer: commonRender
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'totalCost',
                            text: i18n.getKey('totalCost') + window.currencyStr,
                            summaryType: 'sum',

                            width: null,//Extjs 代码bug
                            flex: 1,
                        }]
                }
            },
            costSummaryCfg: {
                store: costDetailStore
            },
            filterCfg: {
                border: false,
                title: i18n.getKey('根据类目统计'),
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
                        name: 'catalogName',
                        itemId: 'catalogName',
                        isLike: false,
                        fieldLabel: i18n.getKey('catalog') + i18n.getKey('name'),
                    },
                ]
            }
        }],
    });
})