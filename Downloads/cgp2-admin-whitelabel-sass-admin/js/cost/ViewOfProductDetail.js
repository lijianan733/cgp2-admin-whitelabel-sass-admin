/**
 * @Description:产品的生产细节角度查看
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.view.ProductDetailOutPanel',
    'CGP.cost.store.ViewOfConfigurableProductStore',
    'CGP.cost.store.CostStore'
])
Ext.onReady(function () {
    var productId = JSGetQueryString('productId');
    window.currencyStr = ' (HK$)';
    var orderLineItemId = JSGetQueryString('orderLineItemId');
    var costDetailStore = Ext.create('CGP.cost.store.CostDetailStore', {
        pageSize: 1,
        autoLoad: false,
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'productdetailoutpanel',
            productId: productId,
            costSummaryCfg: {
                store: costDetailStore
            },
            filterCfg: {
                border: false,
                hidden: true,
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
                ]
            },
            tbarCfg: {
                btnRead: {
                    xtype: 'displayfield',
                    width: 70,
                    value: '<font color=green style="font-weight: bold; font-size: 13px;">' + i18n.getKey('统计总览') + '</font>'
                },
                btnCreate: {
                    text: '产品总成本分析图表',
                    width: 170,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showSKUProductCostChart(productId, 'total', JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },
                btnDelete: {
                    text: '产品平均成分析图表',
                    width: 170,
                    hidden: false,
                    iconCls: 'chart_curve_go',
                    handler: function () {
                        var controller = Ext.create('CGP.cost.controller.Controller');
                        controller.showSKUProductCostChart(productId, 'average', JSGetQueryString('startTime'), JSGetQueryString('endTime'));
                    }
                },
                btnExport: {
                    text: '查看相关订单项',
                    width: 120,
                    hidden: false,
                    iconCls: 'icon_check',
                    handler: function () {
                        var productId = JSGetQueryString('productId');
                        JSOpen({
                            id: 'ViewOfOrderItem',
                            url: path + 'partials/cost/viewoforderitem.html?productId=' + productId +
                                '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                            title: i18n.getKey('订单项核算明细') + '(by产品:' + productId + ')',
                            refresh: true
                        })
                    }
                },
                btnConfig: {
                    text: '查看关联可配置产品成本统计',
                    width: 200,
                    hidden: false,
                    iconCls: 'icon_check',
                    handler: function () {
                        var configurableProductId = JSGetQueryString('configurableProductId');
                        JSOpen({
                            id: 'ViewOfConfigurableProduct',
                            url: path + 'partials/cost/viewofconfigurableproduct.html?productId=' + configurableProductId +
                                '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                            title: i18n.getKey('可配置产品成本核算明细') + '(产品Id:' + configurableProductId + ')',
                            refresh: true
                        })
                    },
                },
            },
            detailGridCfg: {
                columnLines: true,
                tbarCfg: {},
                productId: productId,
            },
        }],
    });
})