/**
 * @Description:可配置产品的角度查看
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.view.OutPanel',
    'CGP.cost.store.ViewOfConfigurableProductStore',
    'CGP.cost.store.CostStore'
])
Ext.onReady(function () {
    window.currencyStr = ' (HK$)';
    var productId = JSGetQueryString('productId');
    var viewOfConfigurableProductStore = Ext.create('CGP.cost.store.ViewOfConfigurableProductStore', {
        autoLoad: false,
        productId: productId
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
                btnCreate: {
                    text: '该可配置产品总成本分析图表',
                    width: 200,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showConfigurableProductCostChart(productId, 'total', JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },
                btnDelete: {
                    text: '该可配置产品平均成本分析图表',
                    width: 200,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showConfigurableProductCostChart(productId, 'average', JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },
                btnConfig: {
                    text: '查看产品分类核算明细',
                    hidden: false,
                    width: 170,
                    iconCls: 'icon_check',
                    handler: function (btn) {
                        var centerGrid = btn.ownerCt.ownerCt.getComponent('centerGrid');
                        var record = centerGrid.store.getAt(0);
                        var mainCategory = record.get('productDto').mainCategory;
                        var catalogName = mainCategory.name;
                        var productCategoryId = mainCategory.id;
                        JSOpen({
                            id: 'ViewOfProduct',
                            url: path + 'partials/cost/viewofproduct.html?catalog=' + productCategoryId +
                                '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                            title: i18n.getKey('分类成本核算明细') + '(分类名：' + catalogName + ')',
                            refresh: true
                        })
                    }
                }
            },
            detailGridCfg: {
                columnLines: true,
                store: viewOfConfigurableProductStore,
                columns: {
                    defaults: {
                        tdCls: 'vertical-middle',
                        width: 170,
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
                                            text: i18n.getKey('关联订单项核算明细'),
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

                            width: 200,
                            renderer: function (value, metadata, record) {
                                return value.model;
                            }
                        },
                        {
                            dataIndex: 'productDto',
                            text: i18n.getKey('SKU'),
                            renderer: function (value, metadata, record) {
                                return value.sku;
                            }
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 130,
                            dataIndex: 'materialCost',
                            text: i18n.getKey('materialCost') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 130,
                            dataIndex: 'laborCost',
                            text: i18n.getKey('laborCost') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 130,
                            dataIndex: 'overhead',
                            text: i18n.getKey('overhead') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 130,
                            dataIndex: 'dpctOfMcn',
                            text: i18n.getKey('dpctOfMcn') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {

                            dataIndex: 'totalQty',
                            width: 130,
                            text: i18n.getKey('totalQty'),
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 130,
                            dataIndex: 'averageCost',
                            text: i18n.getKey('productAverageCost') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'totalCost',
                            text: i18n.getKey('totalCost') + window.currencyStr,
                            summaryType: 'sum',

                            flex: 1,
                            minWidth: 130,
                            width: null,//Extjs 代码bug
                        }]
                }
            },
            costSummaryCfg: {
                store: costDetailStore
            },
            filterCfg: {
                border: false,
                title: i18n.getKey('根据SKU产品统计'),
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
                        xtype: 'numberfield',
                        name: 'productId',
                        itemId: 'productId',
                        hideTrigger: true,
                        hidden: true,
                        value: JSGetQueryString('productId'),
                        fieldLabel: i18n.getKey('productId'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'skuProductId',
                        itemId: 'skuProductId',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('SKU') + i18n.getKey('product') + i18n.getKey('id'),
                    },
                ]
            }
        }],
    });
})