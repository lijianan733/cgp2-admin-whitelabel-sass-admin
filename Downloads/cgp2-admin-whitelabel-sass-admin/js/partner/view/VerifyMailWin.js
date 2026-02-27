Ext.define('CGP.partner.view.VerifyMailWin',{
    extend: 'Ext.window.Window',

    bodyStyle: 'padding:10px',
    height: 400,
    width: 500,
    modal: true,
    initComponent: function(){
        var me = this;
        me.title = i18n.getKey('verifyMail');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('send'),
            handler: function(){
                var data = {};
                me.form.items.each(function(item){
                    data[item.name] =  item.getValue();
                });
                var jsonData = Ext.Object.merge(data,me.mailCfgData);
                me.controller.verifyMail(jsonData,me);
            }
        }];
        var form = {
            xtype: 'form',
            border: false,
            defaults: {
                allowBlank: false,
                msgTarget: 'side',
                width:390
            },
            items: [{
                xtype: 'textfield',
                name: 'subject',
                fieldLabel: i18n.getKey('subject'),
                itemId: 'subject'
            },{
                xtype: 'textfield',
                name: 'receiver',
                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                regexText: i18n.getKey('Please enter the correct email!'),
                fieldLabel: i18n.getKey('emailAddress'),
                itemId: 'receiver'
            },{
                xtype: 'textareafield',
                name: 'content',
                fieldLabel: i18n.getKey('content'),
                itemId: 'content'
            }]
        }
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})