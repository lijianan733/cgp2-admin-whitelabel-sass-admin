/**
 * @Description:从订单项角度查看
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.view.OutPanel',
    'CGP.cost.store.ViewOfProductStore',
    'CGP.cost.store.CostStore'
])
Ext.onReady(function () {
    var viewOfOrderItemStore = Ext.create('CGP.cost.store.ViewOfOrderItemStore', {
        saleOrderId: JSGetQueryString('saleOrderId'),
        productId: JSGetQueryString('productId'),
    });
    var commonRender = Ext.create('CGP.cost.controller.Controller').commonRender;
    window.currencyStr = ' (HK$)';
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'outpanel',
            tbarCfg: {
                hidden: true,
            },
            detailGridCfg: {
                columnLines: true,
                store: viewOfOrderItemStore,
                tbarCfg: {},
                columns: {
                    defaults: {
                        tdCls: 'vertical-middle',
                    },
                    items: [

                        {
                            xtype: 'rownumberer',
                            tdCls: 'vertical-middle',
                            width: 50
                        },
                        {
                            dataIndex: 'orderItemId',
                            text: i18n.getKey('orderLineItem') + i18n.getKey('id'),
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
                                var orderLineItemId = record.get('orderItemId');
                                var productDto = record.get('product');
                                var productId = productDto.id;
                                var configurableProductId = productDto.configurableProductId;
                                var startTime = record.get('startTime') || JSGetQueryString('startTime');
                                var endTime = record.get('endTime') || JSGetQueryString('endTime');
                                return {
                                    xtype: 'button',
                                    ui: 'default-toolbar-small',
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    height: 26,
                                    menu: [
                                        {
                                            text: i18n.getKey('订单项成本明细'),
                                            handler: function (btn) {
                                                JSOpen({
                                                    id: 'ViewOfProductDetailFormOrder',
                                                    url: path + 'partials/cost/viewofproductdetailfromorder.html?orderLineItemId=' + orderLineItemId +
                                                        '&idType=orderLineItem' +
                                                        '&productId=' + productId +
                                                        '&configurableProductId=' + configurableProductId +
                                                        '&startTime=' + startTime + '&endTime=' + endTime,
                                                    title: i18n.getKey('成本核算明细') + '(by订单项：' + orderLineItemId + ')',
                                                    refresh: true
                                                })
                                            }
                                        },
                                        {
                                            text: i18n.getKey('产品成本明细'),
                                            handler: function (btn) {
                                                JSOpen({
                                                    id: 'ViewOfProductDetail',
                                                    url: path + 'partials/cost/viewofproductdetail.html?productId=' + productId +
                                                        '&configurableProductId=' + configurableProductId +
                                                        '&startTime=' + startTime + '&endTime=' + endTime,
                                                    title: i18n.getKey('成本核算明细') + '(产品Id:' + productId + ')',
                                                    refresh: true
                                                })
                                            }
                                        }
                                    ]
                                };
                            }
                        },
                        {
                            xtype: 'imagecolumn',
                            tdCls: 'vertical-middle',
                            width: 100,
                            dataIndex: 'thumbnail',
                            text: i18n.getKey('thumbnail'),
                            //订单的缩略图特殊位置
                            buildUrl: function (value, metadata, record) {
                                return projectThumbServer + value;
                            },
                            //订单的缩略图特殊位置
                            buildPreUrl: function (value, metadata, record) {
                                return projectThumbServer + value;
                            },
                            buildTitle: function (value, metadata, record) {
                                return `${i18n.getKey('check')} < ${value} > 预览图`;
                            }
                        },
                        {
                            dataIndex: 'orderNo',
                            width: 150,
                            text: i18n.getKey('orderNo'),
                        },
                        {
                            dataIndex: 'product',
                            width: 200,
                            text: i18n.getKey('product') + i18n.getKey('name'),
                            renderer: function (value) {
                                return value.name + '<' + value.id + '>';
                            }
                        },
                        {
                            dataIndex: 'product',
                            width: 200,
                            text: i18n.getKey('product') + i18n.getKey('model'),
                            renderer: function (value) {
                                return value.model;
                            }
                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            width: 150,
                            dataIndex: 'unitCost',
                            text: i18n.getKey('单个产品成本') + window.currencyStr,
                            summaryType: 'average',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'salePrice',
                            width: 150,
                            text: i18n.getKey('salePrice') + window.currencyStr,
                            summaryType: 'average',

                        },
                        {
                            dataIndex: 'qty',
                            text: i18n.getKey('qty'),
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'totalCost',
                            width: 150,
                            text: i18n.getKey('totalCost') + window.currencyStr,
                            summaryType: 'sum',

                        },
                        {
                            xtype: 'numbercolumn',
                            format: '0.00',
                            dataIndex: 'totalPrice',
                            text: i18n.getKey('销售总价') + window.currencyStr,
                            summaryType: 'sum',
                            flex: 1,
                            width: 150,
                        }
                    ]
                }
            },
            costSummaryCfg: {
                hidden: true,
                store: viewOfOrderItemStore
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
                        value: JSGetQueryString('startTime') ? new Date(parseInt(JSGetQueryString('startTime'))) : null,
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
                        value: JSGetQueryString('endTime') ? new Date(parseInt(JSGetQueryString('endTime'))) : null,
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
                        name: 'saleOrderId',
                        itemId: 'saleOrderId',
                        isLike: false,
                        hidden: true,
                        value: JSGetQueryString('saleOrderId'),
                        fieldLabel: i18n.getKey('saleOrderId'),
                    },
                    {
                        xtype: 'numberfield',
                        name: 'skuProductId',
                        itemId: 'skuProductId',
                        isLike: false,
                        hidden: true,
                        value: JSGetQueryString('productId'),
                        fieldLabel: i18n.getKey('skuProductId'),
                    },
                ]
            }
        }],
    });
})