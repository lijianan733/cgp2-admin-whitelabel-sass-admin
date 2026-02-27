Ext.define('CGP.order.view.complete.Batch', {
    extend: 'Ext.window.Window',
    alias: 'widget.completebatch',


    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',

    initComponent: function () {
        var me = this;


        me.title = i18n.getKey('batchComplete');
        me.items = [{
            xtype: 'textarea',
            fieldLabel: i18n.getKey('comment'),
            cols: 40,
            rows: 15,
            allowBlank: false,
            itemId: 'comment'
        }];
        me.bbar = [{
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                controller.batchComplete();
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }];

        me.callParent(arguments);
    }
});