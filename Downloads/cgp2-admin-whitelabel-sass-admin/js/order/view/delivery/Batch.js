Ext.define('CGP.order.view.delivery.Batch', {
    extend: 'Ext.window.Window',
    alias: 'widget.deliverybatch',
    requires: [
        'CGP.order.view.delivery.ListField'
    ],


    modal: true,
    autoScroll: true,
    width: 700,
    height: 450,
    bodyStyle: 'padding:10px',

    initComponent: function () {
        var me = this;


        me.title = i18n.getKey('batchDelivery');

        me.items = [
            {
                xtype: "displayfield",
                itemId: "deliveryInfoTitle",
                value: '<font color=green>'+i18n.getKey('deliveryInfo')+'</font>'
            },
            {
                xtype: 'deliveryfield',
                itemId: 'deliveryInfo',
                orderIds: this.orderIds
            },{
                xtype: "displayfield",
                itemId: "commentTitle",
                value: '<font color=green>'+i18n.getKey('comment')+'</font>'
            }, {
                xtype: 'textarea',
                fieldLabel: false,
                itemId: 'comment',
                cols: 40,
                rows: 15,
                allowBlank: false
        }];

        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                controller.batchDelivery();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
        me.deliveryInfoField = me.getComponent('deliveryInfo');
        me.commentField = me.getComponent('comment');
    },

    getSubmitData: function () {
        var me = this;
        if (!me.commentField.isValid()) {
            throw new Errr('comment can not be null;');
        }
        var data = {};
        data.deliveryInfo = me.deliveryInfoField.getValue();
        data.comment = me.commentField.getValue();
        return data;
    }


})