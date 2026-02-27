/**
 * @Description:产品视角查看
 * @author nan
 * @date 2022/9/6
 */

Ext.Loader.syncRequire([
    'CGP.cost.view.OutPanel',
    'CGP.cost.store.ViewOfProductStore',
    'CGP.cost.store.CostStore'
])
Ext.onReady(function () {
    window.currencyStr = ' (HK$)';
    var catalog = JSGetQueryString('catalogId');
    var viewOfProductStore = Ext.create('CGP.cost.store.ViewOfProductStore', {
        autoLoad: false,
        productCategoryId: catalog
    });
    var costDetailStore = Ext.create('CGP.cost.store.CostDetailStore', {
        pageSize: 1,
        autoLoad: false,
    });
    var commonRender = Ext.create('CGP.cost.controller.Controller').commonRender;
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'outpanel',
            tbarCfg: {
                btnDelete: {
                    text: '该分类平均成分析图表',
                    width: 160,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var catalogId = JSGetQueryString('catalogId');
                        var catalogName = JSGetQueryString('catalogName');
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showCatalogCostChart(catalogId, catalogName, 'average', JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },
                btnCreate: {
                    text: '该分类总成本分析图表',
                    width: 160,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var catalogId = JSGetQueryString('catalogId');
                        var catalogName = JSGetQueryString('catalogName');
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showCatalogCostChart(catalogId, catalogName, 'total', JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },

            },
            detailGridCfg: {
                columnLines: true,
                store: viewOfProductStore,
                tbarCfg: {},
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
                                var productDto = record.get('productDto');
                                var productId = productDto.id;
                                var configurableProductId = productDto.configurableProductId;
                                var type = record.get('productDto').type;
                                return {
                                    xtype: 'button',
                                    ui: 'default-toolbar-small',
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    height: 26,
                                    menu: [
                                        {
                                            text: i18n.getKey('可配置产品成本核算明细'),
                                            hidden: type != 'Configurable',
                                            handler: function (btn) {
                                                JSOpen({
                                                    id: 'ViewOfConfigurableProduct',
                                                    url: path + 'partials/cost/viewofconfigurableproduct.html?productId=' + productId +
                                                        '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                                                    title: i18n.getKey('可配置产品成本核算明细') + '(产品Id:' + productId + ')',
                                                    refresh: true
                                                })
                                            }
                                        },
                                        {
                                            text: i18n.getKey('关联订单项核算明细'),
                                            hidden: type == 'Configurable',
                                            handler: function (btn) {
                                                JSOpen({
                                                    id: 'ViewOfOrderItem',
                                                    url: path + 'partials/cost/viewoforderitem.html?productId=' + productId +
                                                        '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                                                    title: i18n.getKey('订单项核算明细') + '(by产品:' + productId + ')',
                                                    refresh: true
                                                })
                                            }
                                        },
                                        {
                                            text: i18n.getKey('成本核算明细'),
                                            hidden: type == 'Configurable',
                                            handler: function (btn) {
                                                JSOpen({
                                                    id: 'ViewOfProductDetail',
                                                    url: path + 'partials/cost/viewofproductdetail.html?productId=' + productId +
                                                        '&configurableProductId=' + configurableProductId +
                                                        '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                                                    title: i18n.getKey('成本核算明细') + '(产品Id:' + productId + ')',
                                                    refresh: true
                                                })
                                            }
                                        },
                                    ]
                                };
                            }
                        },
                        {
                            dataIndex: 'productDto',
                            text: i18n.getKey('product') + i18n.getKey('name'),
                            summaryType: 'sum',

                            width: 250,
                            renderer: function (value, metadata, record) {
                                return value.name + '(' + value.id + ')';
                            }
                        },
                        {
                            dataIndex: 'productDto',
                            text: i18n.getKey('product') + i18n.getKey('model'),
                            summaryType: 'sum',

                            width: 250,
                            renderer: function (value, metadata, record) {
                                return value.model;
                            }
                        },
                        {
                            dataIndex: 'productDto',
                            text: i18n.getKey('product') + i18n.getKey('type'),
                            width: 100,
                            renderer: function (value, metadata, record) {
                                return value.type;
                            }
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'materialCost',
                            width: 130,
                            text: i18n.getKey('materialCost') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'laborCost',
                            width: 130,
                            summaryType: 'sum',
                            text: i18n.getKey('laborCost') + window.currencyStr,
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'overhead',
                            width: 130,
                            summaryType: 'sum',

                            text: i18n.getKey('overhead') + window.currencyStr,
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'dpctOfMcn',
                            width: 130,
                            summaryType: 'sum',

                            text: i18n.getKey('dpctOfMcn') + window.currencyStr,
                        },
                        {
                            dataIndex: 'totalQty',
                            text: i18n.getKey('totalQty'),
                            summaryType: 'sum',

                            width: 100,
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'averageCost',
                            width: 140,
                            text: i18n.getKey('productAverageCost') + window.currencyStr,
                            summaryType: 'average',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'totalCost',
                            text: i18n.getKey('totalCost') + window.currencyStr,
                            summaryType: 'sum',

                            flex: 1,
                            width: null,//Extjs 代码bug
                        }]
                }
            },
            costSummaryCfg: {
                store: costDetailStore
            },
            filterCfg: {
                border: false,
                title: i18n.getKey('根据产品统计'),
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
                        fieldLabel: i18n.getKey('结束时间'),
                        format: 'Y-m-d H:i:s',
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
                        name: 'productId',
                        itemId: 'productId',
                        isLike: false,
                        fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'catalogId',
                        itemId: 'catalogId',
                        hidden: true,
                        value: JSGetQueryString('catalogId'),
                        fieldLabel: i18n.getKey('catalogId'),
                    },
                ]
            }
        }],
    });
})