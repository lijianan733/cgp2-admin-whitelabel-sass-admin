Ext.define('CGP.ticket.view.Mail', {
    extend: 'Ext.window.Window',
    alias: 'ticketmail',


    modal: true,
    bodyStyle: 'padding:10px',
    layout: 'fit',

    initComponent: function () {
         var me = this,
            subject = this.subject,
            content = this.content;


        me.title = i18n.getKey('mail');

        me.items = {
            xtype: 'form',
            border: false, items: [
                {
                    xtype: 'textfield',
                    disabled: true,
                    disabledCls: 'custom-disabled',
                    fieldLabel: i18n.getKey('subject'),
                    value: subject
                },
                {
                    xtype: 'textarea',
                    disabled:true,
                    cols: 30,
                    rows:10,
                    disabledCls: 'custom-disabled',
                    fieldLabel: i18n.getKey('content'),
                    value: content
                }
            ]};

        me.callParent(arguments);
    }
});