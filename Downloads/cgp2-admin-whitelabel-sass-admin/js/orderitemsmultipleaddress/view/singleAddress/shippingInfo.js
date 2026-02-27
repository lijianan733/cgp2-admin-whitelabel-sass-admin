/**
 * @author xiu
 * @date 2023/8/22
 */
//配送信息
Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.shippingInfo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.shippingInfo',
    bodyStyle: 'border-top:0;border-color:white;',
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
    },
    margin: '5 0 25 0',
    diySetValue: function (data) {
        const me = this,
            container = me.getComponent('container'),
            items = container.items.items
        items.forEach(item => {
            var {name} = item;
            item.setValue(data[name]);
            item.setVisible(!!data[name]);
        })
    },
    initComponent: function () {
        const me = this;
        const none = true;
        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '配送信息'
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
                        name: 'shippingMethod',
                        itemId: 'shippingMethod',
                        value: '配送方式',
                        fieldLabel: '配送方式',
                    },
                    {
                        name: 'shippingMethodCode',
                        itemId: 'shippingMethodCode',
                        value: '快递方式',
                        fieldLabel: '快递方式',
                    },
                    {
                        name: 'expressOrderNumber1',
                        itemId: 'expressOrderNumber1',
                        hidden: none,
                        value: '快递单号1',
                        fieldLabel: '快递单号1',
                    },
                    {
                        name: 'expressOrderNumber2',
                        itemId: 'expressOrderNumber2',
                        hidden: none,
                        value: '快递单号2',
                        fieldLabel: '快递单号2',
                    },
                    {
                        name: 'massage',
                        itemId: 'massage',
                        hidden: none,
                        value: 'Estimated to arrive between: (Fri) 14 July 2023 - (Tue) 18 July 2023\n' +
                            '(8-10 business days : production/processing time 1-2 business days + shipping time 7-8 business days) HK$70.60',
                        fieldLabel: 'massage',
                    },
                ]
            },
        ];
        me.callParent();
    },
})