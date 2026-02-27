Ext.define('CGP.orderdetails.view.details.Shipping', {
    extend: 'Ext.form.Panel',
    alias: 'widget.detailsshipping',
    mixins: ['Ext.ux.util.ResourceInit'],


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
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '1 0 0 0',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('shippingMethod') + '</font>'
                    },
                    {
                        xtype: 'button',
                        itemId: 'button',
                        text: i18n.getKey('edit'),
                        action: 'edit'
                    }
                ]

            }
        ];
        me.callParent(arguments);

    },

    setValue: function (order) {
        var me = this;
        me.setEditable(order);
        me.removeAll();
        var shippingMethod = order.get('shippingMethod');
        var shippingModuleCode = order.get('shippingModuleCode');
        me.add(Ext.widget({
            xtype: 'displayfield',
            labelWidth: 150,
            labelAlign: 'left',
            fieldLabel: shippingMethod,
            value: shippingModuleCode
        }));
    },
    setEditable: function (order) {
        var me = this;
        var editBtn = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('button')
        editBtn.setVisible(Ext.Array.contains([107, 108, 109, 112], order.get('status').id));
        editBtn.setDisabled(order.get('hasProducer') == true);
        //只能预览,不能编辑
        if (JSGetQueryString('editable') == 'false') {
            editBtn.setDisabled(true);
            editBtn.setVisible(false);
        }
    }
})