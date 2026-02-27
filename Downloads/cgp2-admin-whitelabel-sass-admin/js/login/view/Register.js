Ext.define('CGP.login.view.Register', {
    extend: 'Ext.window.Window',
    alias: 'widget.cgpregister',
    mixins: ['Ext.ux.util.ResourceInit'],

    schema: 'CGPADMIN',
    clientId: 'cgpadminwebsite',

    bodyStyle: 'padding-top:10px',

    layout: 'fit',

    width: 320,
    height: 250,
    modal: true,

    initComponent: function () {

        var me = this;




        me.title = '注册到CGP管理网站';

        me.items = {
            xtype: 'form',
            itemId: 'form',
            border: false,
            padding: '0 10 0 10',
            defaults: {
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: '邮箱',
                name: 'email',
                itemId: 'email',
                regex: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
                regexText: i18n.getKey('Please enter the correct email!')
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: '密码',
                name: 'password',
                itemId: 'password'
            }, {
                xtype: 'textfield',
                inputType: 'password',
                fieldLabel: '确认密码',
                itemId: 'confirmPassword'
            }, {
                xtype: 'textfield',
                fieldLabel: '名字',
                name: 'firstName',
                itemId: 'firstName'
            }],
            bbar: [{
                xtype: 'button',
                text: '注册',
                handler: function () {
                    me.register();
                }
            }, {
                xtype: 'button',
                text: '取消',
                handler: function () {
                    me.close();
                }
            }]
        };


        me.callParent(arguments);

    },


    register: function () {

        var me = this;
        var form = me.getComponent('form');


        if (form.isValid()) {

            var email = form.getComponent('email').getValue();
            var password = form.getComponent('password').getValue();
            var confirmPassword = form.getComponent('confirmPassword').getValue();
            var firstName = form.getComponent('firstName').getValue();
            if (password != confirmPassword) {
                form.getComponent('confirmPassword').setActiveError('password is not correct!');
                return;
            }

            var request = {
                url: adminPath + 'common/register',
                method: 'POST',
                jsonData: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    schema: me.schema,
                    clientId: me.clientId,
                    url: path
                },

                success: function (response, options) {
                    var resp = Ext.JSON.decode(response.responseText);
                    if (resp.success) {
                        me.close();
                        Ext.Msg.alert('Promo', resp.data.message);
                    }else{
                        Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                    }
                },
                failure: function (resp, options) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            };

            Ext.Ajax.request(request);

        }


    }


})
