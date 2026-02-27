Ext.define('CGP.orderdetails.view.details.DeliveryInformation', {
    extend: 'Ext.window.Window',
    alias: 'wholedeliverywindow',



    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',
    initComponent: function () {

         var me = this,
            orderId = this.orderId,
            submitData = this.submitData;



        me.title = i18n.getKey('deliveryInformation');
        me.items = {
            xtype: 'form',
            border: false,
            defaults: {
                width: 350
            },
            items: [{
                xtype: 'textarea',
                itemId: 'comment',
                fieldLabel: i18n.getKey('remark')
            }, {
                xtype: 'textfield',
                itemId: 'deliveryNo',
                fieldLabel: i18n.getKey('deliveryNo')
            }]
        };

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                if (!me.form.isValid()) {
                    return;
                }
                var comment = me.form.getComponent('comment').getValue();
                var deliveryNo = me.form.getComponent('deliveryNo').getValue();
                me.controller.submitQtyWithDeliveryInfo(submitData.submitQty, submitData.record, submitData.grid, comment, deliveryNo, me);
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
        me.form = me.down('form');

    }

})