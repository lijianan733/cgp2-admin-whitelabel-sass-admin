/**
 * @Description:关联的qpson销售订单信息，新建退款申请时候动态查询，查看只能查document里面的作为展示
 * @author nan
 * @date 2025/05/23
 */
Ext.Loader.syncRequire([
    'CGP.custormer_order_refund.model.CustomerOrderItemRefundModel'
])
Ext.define('CGP.custormer_order_refund.view.RelateQpsonOrderInfoGridField', {
    extend: 'Ext.ux.form.field.GridFieldExtendContainer',
    alias: 'widget.relate_qpson_order_info_gridfield',
    isFormField: false,
    currencySymbol: '',
    rawData: null,
    getErrors: function () {
        var me = this;
        return me.errorInfo;
    },
    setFieldStyle: function () {
    },
    diySetValue: function (data) {
        var me = this;
        me.refreshData(data);
    },
    diyGetValue: function () {
        return this.rawData;
    },
    refreshData: function (data) {
        var me = this;
        me.rawData = data;
        JSSetLoading(true);
        setTimeout(function () {
            me.currencySymbol = data?.currencySymbol;
            me.store.proxy.data = data?.partnerOrderRefundInfoList || [];
            me.store.load();
            JSSetLoading(false);
        });
    },
    initComponent: function () {
        var me = this;
        var store = me.store = Ext.create('Ext.data.Store', {
            fields: [
                'orderNumber',//订单号
                'orderId',//订单Id
                'refundedTotalAmount',//退款总金额
                'refundedProductAmount',//退款产品总金额
                'refundedShippingAmount',//退款运费金额
                'refundedTaxAmount',//退款税费金额
                'refundedImportServiceAmount',//减少的importService
                'reduceRevenue',//减少的盈余
            ],
            proxy: {
                type: 'memory'
            }
        });
        me.gridConfig = {
            autoScroll: true,
            store: store,
            columns: [
                {
                    xtype: 'rownumberer'
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('订单号'),
                    dataIndex: 'orderNumber',
                    width: 150,
                    clickHandler: function (value) {
                        JSOpen({
                            id: 'customer_order_managementpage',
                            url: path + 'partials/order/order.html?orderNumber=' + value,
                            title: i18n.getKey('Customer订单管理'),
                            refresh: true
                        })
                    }
                },
                {
                    dataIndex: 'refundedTotalAmount',
                    text: i18n.getKey('退款总金额'),
                    renderer: function (value) {
                        return me.currencySymbol + value;
                    }
                },
                {
                    dataIndex: 'refundedProductAmount',
                    text: i18n.getKey('退产品金额'),
                    renderer: function (value) {
                        return me.currencySymbol + value;
                    }
                },
                {
                    text: i18n.getKey('退运费金额'),
                    dataIndex: 'refundedShippingAmount',
                    renderer: function (value) {
                        return me.currencySymbol + value;
                    }
                },
                {
                    text: i18n.getKey('退ImportService金额'),
                    width: 150,
                    dataIndex: 'refundedImportServiceAmount',
                    renderer: function (value) {
                        return me.currencySymbol + value;
                    }
                },
                {
                    text: i18n.getKey('退销售税金额'),
                    dataIndex: 'refundedTaxAmount',
                    renderer: function (value) {
                        return me.currencySymbol + value;
                    }
                },
                {
                    text: i18n.getKey('减少盈余'),
                    dataIndex: 'reduceRevenue',
                    flex: 1,
                    renderer: function (value) {
                        return me.currencySymbol + value;
                    }
                },
            ],
        };
        me.callParent();
    }
})