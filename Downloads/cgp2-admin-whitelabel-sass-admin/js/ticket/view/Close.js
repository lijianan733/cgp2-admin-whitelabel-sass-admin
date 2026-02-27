Ext.define('CGP.ticket.view.Close', {
    extend: 'Ext.window.Window',
    alias: 'widget.ticketclose',

    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',

    initComponent: function () {
         var me = this,
            ticketId = this.ticketId;


        me.title = i18n.getKey('closeTicket');

        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                border: false,
                items: [
                    {
                        xtype: 'textarea',
                        itemId: 'comment',
                        fieldLabel: i18n.getKey('comment'),
                        allowBlank: false,
                        cols: 30,
                        rows:10
                    }
                ]
            }
        ];

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('ok'),
            handler: function () {
                if (me.form.isValid()) {
                    var comment = me.form.getComponent('comment').getValue();
                    controller.closeTicket(ticketId, comment);
                }
            }
        }, {
            xtype: 'button',
            text: i18n.getKey('cancel'),
            handler: function () {
                me.close();
            }
        }]

        me.callParent(arguments)

        me.form = me.getComponent('form');

    }
})