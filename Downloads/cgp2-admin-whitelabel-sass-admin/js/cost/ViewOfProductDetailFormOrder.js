/**
 * @Description:产品的生产细节角度查看,从订单项那里跳转过来，特殊处理
 * @author nan
 * @date 2022/9/6
 */
Ext.Loader.syncRequire([
    'CGP.cost.view.ProductDetailOutPanel',
    'CGP.cost.store.ViewOfConfigurableProductStore',
    'CGP.cost.store.CostStore'
])
Ext.onReady(function () {
    var costDetailStore = Ext.create('CGP.cost.store.CostDetailStore', {
        pageSize: 1,
        autoLoad: false,
    });
    var idType = JSGetQueryString('idType');
    window.currencyStr = ' (HK$)';
    var orderLineItemId = JSGetQueryString('orderLineItemId');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'productdetailoutpanel',
            urlForSwitchView: '',
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
                    }, {
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
                    /*      {
                              xtype: 'numberfield',
                              name: 'productId',
                              itemId: 'productId',
                              hidden: true,
                              value: JSGetQueryString('productId'),
                              fieldLabel: i18n.getKey('productId') + i18n.getKey('name'),
                          },*/
                ]
            },
            tbarCfg: {
                btnRead: {
                    xtype: 'displayfield',
                    width: 70,
                    value: '<font color=green style="font-weight: bold; font-size: 13px;">' + i18n.getKey('统计总览') + '</font>'
                },
                btnCreate: {
                    text: '切换视图',
                    iconCls: 'icon_switch',
                    width: 120,
                    hidden: false,
                    handler: function (btn) {
                        console.log('ar');
                        var toolbar = btn.ownerCt;
                        var panel = toolbar.ownerCt;
                        var centerPanel = panel.getComponent('centerPanel');
                        var processCostPanel = centerPanel.getComponent('processCost');
                        var materialCostPanel = centerPanel.getComponent('materialCost');
                        var otherPanel = centerPanel.getComponent('other');
                        var idType = JSGetQueryString('idType');
                        var orderLineItemId = JSGetQueryString('orderLineItemId');
                        var mOrderId = JSGetQueryString('mOrder');
                        var htmlUrl = path + 'partials/manufactureorder/view/mbomCostDetail.html' +
                            '?mOrderId=' + mOrderId + '&idType=' + idType + '&orderLineItemId=' + orderLineItemId;
                        var iframe = otherPanel.el.dom.getElementsByTagName('iframe')[0];
                        if (Ext.isEmpty(iframe.attributes.src.value)) {
                            iframe.src = htmlUrl;
                        }
                        otherPanel.setVisible(otherPanel.hidden);
                        processCostPanel.setVisible(processCostPanel.hidden);
                        materialCostPanel.setVisible(materialCostPanel.hidden);
                    }
                },
                btnConfig: {
                    text: '该订单项产品成本明细',
                    hidden: false,
                    width: 170,
                    iconCls: 'icon_check',
                    handler: function () {
                        var productId = JSGetQueryString('productId');
                        var configurableProductId = JSGetQueryString('configurableProductId');
                        JSOpen({
                            id: 'ViewOfProductDetail',
                            url: path + 'partials/cost/viewofproductdetail.html?productId=' + productId +
                                '&configurableProductId=' + configurableProductId +
                                '&startTime=' + JSGetQueryString('startTime') + '&endTime=' + JSGetQueryString('endTime'),
                            title: i18n.getKey('成本核算明细') + '(产品Id:' + productId + ')',
                            refresh: true
                        })

                    }
                }
            },
            detailGridCfg: {
                columnLines: true,
            },
        }],
    });
})
