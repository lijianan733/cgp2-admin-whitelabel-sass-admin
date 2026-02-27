/**
 * @author xiu
 * @date 2023/8/22
 */
//付款方式
Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.payMethod', {
    extend: 'Ext.form.Panel',
    alias: 'widget.payMethod',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    diySetValue: function (data) {
        const me = this,
            container = me.getComponent('container'),
            items = container.items.items
        items.forEach(item => {
            item.diySetValue ? (item.diySetValue(data[item.name])) : (item.setValue(data[item.name]));
        })
    },
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'splitBarTitle',
                title: '付款方式'
            },
            {
                xtype: 'container',
                width: '100%',
                margin: '5 0 5 20',
                itemId: 'container',
                layout: {
                    type: 'table',
                    columns: 2,
                    tdAttrs: {
                        style: {
                            'padding-right': '100px',
                        }
                    }
                },
                defaults: {
                    margin: '5 0 5 20',
                },
                defaultType: 'displayfield',
                items: [
                    {
                        name: 'paymentMethod',
                        itemId: 'paymentMethod',
                        diySetValue: function (data) {
                            const me = this,
                                form = me.ownerCt.ownerCt;
                            form.setVisible(data || data === 0);
                            me.setValue(data);
                        }
                    }
                ]
            },
        ];
        me.callParent();
    },
})