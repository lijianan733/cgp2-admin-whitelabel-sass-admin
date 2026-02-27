/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.ShipmentInfoItem',
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
])
//发货信息
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.shippingInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.shippingInfo',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
    },
    margin: '5 0 50 0',
    initComponent: function () {
        const me = this,
            {shipmentInfo, record, data} = me,
            controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller');

        me.hidden = !shipmentInfo;

        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '发货信息'
            },
            {
                xtype: 'container',
                width: '100%',
                margin: '5 0 5 20',
                layout: 'vbox',
                defaultType: 'displayfield',
                itemId: 'container',
                defaults: {
                    width: '50%',
                    margin: '5 0 5 20',
                },
                items: [
                    {
                        xtype: 'shipmentInfoItem',
                        record: record,
                        data: data,
                        width: 1100,
                        name: 'shipmentInfo',
                        margin: '10 25 5 25',
                        itemId: 'shipmentInfo',
                        readOnly: true,
                        diySetValue: Ext.emptyFn,
                        getName: function () {
                            return this.name;
                        },
                        getErrors: function () {
                            return i18n.getKey('shipmentInfo') + '必须完备';
                        }
                    },
                ]
            },
        ];
        me.callParent();
    },
})