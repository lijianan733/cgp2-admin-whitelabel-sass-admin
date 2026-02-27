Ext.define('CGP.customer.view.modifypassword.ModifyPassword',{
    extend: 'Ext.window.Window',


    width: 300,
    modal: true,
    layout: 'fit',
    bodyStyle: 'padding:10px',
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('modifyPassword');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            itemId: 'modifyPassword',
            handler: function(){
                if(me.form.isValid()) {
                    var data = {};
                    me.form.items.each(function(item){
                        data[item.name] =  item.getValue();
                    });
                    me.controller.modifyPassword(me.customerId,data,me);
                }
            }
        }];
        var form = {
            xtype: 'form',
            border: false,
            items: [{
                xtype: 'textfield',
                itemId: 'newPassword',
                name: 'newPassword',
                inputType : 'password',
                fieldLabel: i18n.getKey('newPassword'),
                allowBlank: false,
                blankText : '密码不能为空',
                msgTarget: 'side'
            },{
                xtype: 'textfield',
                name : 'confirmPwd',
                inputType : 'password',
                itemId: 'confirmPwd',
                fieldLabel : i18n.getKey('confirmPassword'),
                allowBlank : false,
                listeners:{
                    blur: function(){
                        var newPassword = me.form.getComponent('newPassword').getValue();
                        var confirmPassword = this.getValue();
                        if(newPassword != confirmPassword){
                            this.markInvalid('密码输入不一致！');
                        }
                    }
                },
                blankText : '确认密码不能为空',
                msgTarget: 'side'
            }]
        };
        me.items = [form];
        me.callParent(arguments);
        me.form = me.down('form');
    }
})