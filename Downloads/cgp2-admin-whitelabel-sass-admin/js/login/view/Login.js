Ext.Loader.syncRequire([
    'CGP.common.field.AutoCompleteCombo'
])
Ext.define('CGP.login.view.Login', {
    extend: 'Ext.form.Panel',
    alias: 'widget.login_form',
    config: {
        defautls: {
            width: 300
        }
    },
    layout: {
        type: 'table',
        columns: 2
    },

    border: false,
    reLoad: false,

    websiteCode: 'CGPADMIN',
    clientId: 'cgpadminwebsite',

    constructor: function (config) {

        var me = this;
        config = config || {};
        me.initConfig(config);
//        me.source = "PSCN";


        var userStr = Ext.util.Cookies.get("user");
        var user = eval("(" + userStr + ")");
        var email,
            checked,
            rememberFieldValue;
        if (!Ext.isEmpty(userStr)) {
            checked = user.checked;
            rememberFieldValue = checked ? {rememberUser: 'yes'} : {rememberUser: null};
            if (checked == true) {
                me.source = user.source;
                me.selectedId = user.selectedId;
                email = user.email;
            }
        }


        config = Ext.apply({
            title: '登录',
            items: [
                {
                    xtype: 'autocompletecombo',
                    fieldLabel: '邮箱',
                    padding: '20 0 0 0',
                    itemId: 'email',
                    value: config.email || email,
                    colspan: 2,
                    listConfig: {
                        minWidth: 150
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: '密码',
                    inputType: 'password',
                    itemId: 'password',
                    value: config.password,
                    colspan: 2
                },
                {
                    xtype: 'combo',
                    fieldLabel: '服务器',
                    hidden: true,
                    itemId: 'source',
                    store: Ext.create('CGP.login.store.LoginSource', {
                        listeners: {
                            load: function () {
                                var combo = me.getComponent('source');
                                var newValue = combo.value;
                                var record = combo.getStore().getById(newValue);
                                selectId = newValue;
                               /* projectThumbServer = record.get('projectThumbServer');
                                imageServer = record.get('imageServer');*/
                                me.selectedId = newValue;
                            }
                        }
                    }),
                    value: me.selectedId || 1,
                    displayField: 'name',
                    valueField: 'id',
                    editable: false,
                    colspan: 2,
                    listeners: {
                        change: function (combo, newValue, oldValue) {
                            var record = combo.getStore().getById(newValue);
                            me.source = record.get('source');
                            selectId = newValue;
                            /*projectThumbServer = record.get('projectThumbServer');
                            imageServer = record.get('imageServer');*/
                            me.selectedId = newValue;
                        }
                    }
                },
                {
                    xtype: "checkboxgroup",
                    itemId: 'remember',
                    items: [
                        {
                            xtype: 'checkboxfield',
                            width: 150,
                            name: 'rememberUser',
                            boxLabel: '记住账号',
                            inputValue: 'yes'
                        }
                    ],
                    value: rememberFieldValue || {rememberUser: 'yes'}
                }
            ]
        }, config);

        me.callParent([config]);

    },

    onRender: function () {

        var me = this;
        me.callParent(arguments);
        //增加鼠标enter事件  当点击enter时 于点击ok按钮是一样的效果
        me.el.on('keydown', function (event, target) {
            if (event.button == 12) {
                var button = Ext.ComponentQuery.query('button[action=login]', me)[0];
                if (button) {
                    button.handler();
                }
            }
        }, me);
    },

    initComponent: function () {

        var me = this;
        me.callParent(arguments);

        me.addDocked([
            {
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    '->',
                    {
                        xtype: 'button',
                        text: '登录',
                        action: 'login',
                        handler: function () {
                            me.login();
                        }
                    }
                ]
            }
        ]);

    },
    /**
     * 获取用户的id
     */
    getUserId: function () {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/users/loginUser',
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var userId = responseMessage.data.id;
                    var email = responseMessage.data.email;
                    var user = Ext.JSON.decode(Ext.util.Cookies.get('user'));
                    user.userId = userId;
                    Ext.util.Cookies.set('user', Ext.JSON.encode(user), null, location.hostname);

                    if (me.reLoad) {
                        location.reload();
                    } else {
                        Ext.Msg.confirm(i18n.getKey('prompt'), '是否刷新页面?', function (selector) {
                            if (selector == 'yes') {
                                location.reload();
                            } else {
                                me.ownerCt.close();
                            }
                        });

                    }
                } else {
                    console.log(responseMessage)
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                console.log(responseMessage)
            }
        });
    },
    login: function () {

        var me = this;

        var email = me.getComponent('email').getValue().trim();
        var password = me.getComponent('password').getValue();
        var isRememberUser = me.getComponent("remember").getValue().rememberUser;
        var lm = me.ownerCt.setLoading();
        var requestParam = {
            method: "POST",
            async: false,
            url: adminPath + 'token',
            jsonData: {
                username: email,
                password: password,
                websiteCode: me.websiteCode,
                clientId: me.clientId
            },
            success: function (resp) {
                var result = eval('(' + resp.responseText + ')');
                if (result.success) {
                    var token = result.data['access_token'];
                    var sourceField = me.getComponent("source");
                    Ext.util.Cookies.set('currentUser', result.data.firstName, null, '/' + top.pathName);
                    Ext.util.Cookies.set('token', token, null,  '/' + top.pathName);
                    Ext.util.Cookies.set('selectId', selectId, null, location.hostname);
                    Ext.util.Cookies.set('projectThumbServer', projectThumbServer, null, location.hostname);
                    Ext.util.Cookies.set('imageServer', imageServer, null, location.hostname);

                    var website = sourceField.getStore().getById(sourceField.getValue()).get('website');
                    var websiteName = sourceField.getStore().getById(sourceField.getValue()).get('websiteName');

                    var date = new Date(new Date().setMonth(new Date().getMonth() + 2));
                    var cookieInfo = {
                        checked: true,
                        email: email,
                        rawValue: sourceField.getRawValue(),
                        selectedId: me.selectedId,
                        website: website,
                        websiteName: websiteName
                    };
                    if (isRememberUser != 'yes') {
                        cookieInfo['checked'] = false;
                    }
                    Ext.util.Cookies.set("user", JSON.stringify(cookieInfo), date, location.hostname);
                    me.getUserId();
                    lm.hide();
                } else {
                    lm.hide();
                    Ext.Msg.alert("提示", '帐号或密码错误!');
                }
            },
            failure: function (resp) {
                console.log(resp);
                lm.hide();
                if (resp.status == 401 || resp.status == 500) {
                    Ext.MessageBox.alert('WARN',
                        '帐号或密码错误!');
                }
            }
        };

        Ext.Ajax.request(requestParam);
    }

})
