Ext.define('CGP.ticket.view.Reply', {
    extend: 'Ext.window.Window',
    alias: 'widget.replywindow',

    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',

    initComponent: function () {
         var me = this,
            receiver = this.receiver,
            ticketId = this.ticketId;


        me.title = i18n.getKey('reply');

        me.items = [
            {
                xtype: 'form',
                itemId: 'form',
                border: false,
                items: [
                    {
                        xtype: 'displayfield',
                        itemId: 'receiver',
                        value: receiver,
                        fieldLabel: i18n.getKey('receiver')
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'subject',
                        fieldLabel: i18n.getKey('subject'),
                        allowBlank: false,
                        msgTarget: 'side'
                    },
                    {
                        xtype: 'htmleditor',
                        itemId: 'content',
                        fieldLabel: i18n.getKey('content')
                    }
                ]
            }
        ];

        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('reply'),
            handler: function () {
                var controller = Ext.create('CGP.ticket.controller.Edit');
                window.controller = controller;

                if (me.form.isValid()) {
                    var subject = me.form.getComponent('subject').getValue();
                    var content = me.form.getComponent('content').getValue();
                    if(!Ext.isEmpty(content)) {
                        controller.replyTicket(ticketId, subject, content);
                    }else{
                        Ext.MessageBox.alert('提示','回复内容不能为空！');
                    }
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