/**
 * 收货人信息
 **/
Ext.define('CGP.orderdetails.view.details.Delivery', {
    extend: 'Ext.form.Panel',
    alias: 'widget.detailsdelivery',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Valuable'],
    defaultType: 'displayfield',
    bodyStyle: 'border-top:0;border-color:white;',
    header: false,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 600
    },
    editable: true,
    initComponent: function () {

        var me = this;
        me.items = [
            {
                fieldLabel: i18n.getKey('deliveryName'),
                name: 'deliveryName',
                itemId: 'deliveryName'
            },
            {
                fieldLabel: i18n.getKey('deliveryAddress'),
                name: 'deliveryAddress',
                itemId: 'deliveryAddress'
            },
            {
                fieldLabel: i18n.getKey('postCode'),
                name: 'deliveryPostcode',
                itemId: 'deliveryPostcode'
            },
            {
                fieldLabel: i18n.getKey('telephone'),
                name: 'deliveryTelephone',
                itemId: 'deliveryTelephone'
            },
            {
                fieldLabel: i18n.getKey('mobile'),
                name: 'deliveryMobile',
                itemId: 'deliveryMobile'
            },
            {
                fieldLabel: i18n.getKey('emailAddress'),
                name: 'deliveryEmail',
                itemId: 'deliveryEmail'
            }
        ];
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                //style: 'background-color:silver;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('receiverInfo') + '</font>'
                    },
                    {
                        itemId: 'button',
                        xtype: 'button',
                        text: i18n.getKey('edit'),
                        action: 'edit'
                    }
                ]

            }
        ];
        me.callParent(arguments);

    },
    setEditable: function (order) {
        var me = this;
        var editBtn = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('button')
        editBtn.setVisible(!Ext.Array.contains([107, 108, 109, 112], order.get('status').id));
        editBtn.setDisabled(order.get('hasProducer') == true);
        //只能预览,不能编辑
        if (JSGetQueryString('editable') == 'false') {
            editBtn.setDisabled(true);
            editBtn.setVisible(false);
        }

    }

})