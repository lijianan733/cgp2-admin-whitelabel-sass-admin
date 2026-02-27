/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.syncRequire([
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.splitBarTitle',
    'CGP.orderstatusmodify.view.Sanction',
    'CGP.orderstatusmodify.view.DeliverItem'
])
//信息概览
Ext.define('CGP.orderitemsmultipleaddress.view.singleAddress.infoPreview', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infoPreview',
    bodyStyle: 'border-top:0;border-color:white;',
    margin: '5 0 25 0',
    diySetValue: function (data) {
        const me = this,
            container = me.getComponent('container'),
            items = container.items.items

        console.log(data);
        items.forEach(item => {
            var {name} = item;

            item.setValue(data[name]);
            item.setVisible(!!data[name]);
        })
    },
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'splitBarTitle',
                margin: '10 0 5 3',
                title: '信息概览'
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
                        fieldLabel: i18n.getKey('partnerId'),
                        name: 'partnerId',
                        itemId: 'partnerId',
                        hidden: true,
                    },
                    {
                        fieldLabel: i18n.getKey('partnerName'),
                        name: 'partnerName',
                        itemId: 'partnerName',
                    },
                    {
                        fieldLabel: i18n.getKey('partnerEmail'),
                        name: 'partnerEmail',
                        itemId: 'partnerEmail',
                    },
                    {
                        fieldLabel: i18n.getKey('下单用户'),
                        name: 'billingEmail',
                        itemId: 'billingEmail',
                    },
                    {
                        fieldLabel: i18n.getKey('userAccount'),
                        name: 'userName',
                        itemId: 'userName',
                    },
                    {
                        fieldLabel: i18n.getKey('预计交收日期'),
                        name: 'estimatedDeliveryDate',
                        itemId: 'estimatedDeliveryDate',
                        value: '预计交收日期',
                        renderer: function (value) {
                            return value ? (Ext.Date.format(new Date(+value), 'Y-m-d H:i:s')) : ('未获取到时间信息!');
                        }
                    },
                ]
            },
        ];
        me.callParent();
    },
})