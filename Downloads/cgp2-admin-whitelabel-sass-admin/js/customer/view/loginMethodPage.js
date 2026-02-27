/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});

Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.SplitBarTitle',
    'Ext.ux.window.ImageViewer'
]);
Ext.define('CGP.customer.view.loginMethodPage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.login_method',
    layout: 'fit',
    initComponent: function () {
        var me = this,
            id = JSGetQueryString('id'),
            type = JSGetQueryString('type'),
            isWhiteLabelPage = type === 'whiteLabel',
            usersUrl = adminPath + `api/users/${id}`,
            authInfoUrl = adminPath + `api/users/${id}/authInfo`,
            controller = Ext.create('CGP.customer.controller.Controller');

        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '15 25 70 25',
                },
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId: 'container1',
                        layout: 'vbox',
                        defaults: {
                            width: '100%',
                        },
                        items: [
                            {
                                xtype: 'splitBarTitle',
                                title: '用户账号信息',
                                border: '0 0 1 0',
                            },
                            {
                                xtype: 'container',
                                width: '100%',
                                itemId: 'container',
                                layout: {
                                    type: 'table',
                                    columns: 4,
                                },
                                defaultType: 'displayfield',
                                defaults: {
                                    margin: '15 90 5 20',
                                    width: 240,
                                    labelWidth: 60
                                },
                                diySetValue: function (data) {
                                    if (data) {
                                        const me = this,
                                            items = me.items.items;

                                        items.forEach(item => {
                                            var {name} = item;
                                            item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                                        })
                                    }
                                },
                                items: [
                                    {
                                        fieldLabel: i18n.getKey('userAccount'),
                                        labelWidth: 110,
                                        name: 'accountNumberCY',
                                        itemId: 'accountNumberCY',
                                        hidden: !isWhiteLabelPage,
                                    },
                                    {
                                        fieldLabel: i18n.getKey('QP账号'),
                                        name: 'accountNumberQP',
                                        itemId: 'accountNumberQP',
                                        hidden: isWhiteLabelPage,
                                    },
                                    {
                                        fieldLabel: i18n.getKey('注册日期'),
                                        name: 'registrationDate',
                                        itemId: 'registrationDate',
                                        diySetValue: function (data) {
                                            if (data){
                                                var me = this,
                                                    result = data ? Ext.Date.format(new Date(+data), 'Y-m-d G:i:s') : '';

                                                me.setValue(result);
                                            }
                                        }
                                    },
                                    {
                                        fieldLabel: i18n.getKey('用户名'),
                                        name: 'userName',
                                        itemId: 'userName',
                                        width: 320,
                                    },
                                ],
                                listeners: {
                                    afterrender: function (comp) {
                                        var queryData = JSGetQuery(usersUrl),
                                            {email,userName, firstName, lastName, registerDate} = queryData,
                                            data = {
                                                accountNumberQP: userName,
                                                accountNumberCY: userName,
                                                registrationDate: registerDate,
                                                userName: `${lastName || ''} ${firstName || ''}`,
                                            };

                                        comp.diySetValue(data);
                                    }
                                }
                            },
                        ]
                    },
                    {
                        xtype: 'container',
                        width: '100%',
                        itemId: 'container2',
                        layout: 'vbox',
                        defaults: {
                            width: '100%',
                        },
                        items: [
                            {
                                xtype: 'splitBarTitle',
                                title: '登录方式',
                                border: '0 0 1 0',
                                addButton: [
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('添加登录方式'),
                                        // hidden: isWhiteLabelPage,
                                        hidden: true,
                                        handler: function () {
                                            controller.createAddLoginMethodFormWindow();
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'container',
                                width: '100%',
                                itemId: 'container',
                                layout: {
                                    type: 'table',
                                    columns: 3,
                                },
                                defaults: {
                                    xtype: 'uxfieldset',
                                    layout: 'vbox',
                                    width: 400,
                                    minHeight: 200,
                                    margin: '20 30',
                                    collapsible: true,
                                    defaults: {
                                        labelWidth: 80,
                                        width: '100%',
                                        margin: '15 25 5 25',
                                    },
                                },
                                diySetValue: function (data) {
                                    if (data) {
                                        var me = this,
                                            itemsArr = data?.map(item => {
                                                var {provider} = item,
                                                    typeGather = {
                                                        password: function () {
                                                            var {emailAddress, provider} = item;
                                                            return {
                                                                title: i18n.getKey('邮箱'),
                                                                itemId: provider,
                                                                items: [
                                                                    {
                                                                        xtype: 'displayfield',
                                                                        name: 'googleEmail',
                                                                        itemId: 'googleEmail',
                                                                        fieldLabel: i18n.getKey('邮箱'),
                                                                        labelWidth: 60,
                                                                        value: emailAddress
                                                                    },
                                                                    {
                                                                        xtype: 'container',
                                                                        layout: 'hbox',
                                                                        margin: '75 25 5 25',
                                                                        defaults: {
                                                                            width: 80,
                                                                            margin: '15 25 5 0',
                                                                        },
                                                                        items: [
                                                                            {
                                                                                xtype: 'button',
                                                                                text: i18n.getKey('修改邮箱'),
                                                                                handler: function (btn) {
                                                                                    var data = {
                                                                                        clazz: 'com.qpp.cgp.dto.account.UserUpdateAuthInfoDTO',
                                                                                        provider: provider,
                                                                                        emailAddress: emailAddress
                                                                                    }

                                                                                    controller.createEditEmailFormWindow(data, null, function (win, formData) {
                                                                                        JSAsyncEditQuery(authInfoUrl, formData, true, function (require, success, response) {
                                                                                            if (success) {
                                                                                                var responseText = Ext.JSON.decode(response.responseText),
                                                                                                    queryData = responseText?.data;

                                                                                                if (responseText.success) {
                                                                                                    console.log(queryData);
                                                                                                    setTimeout(() => {
                                                                                                        location.reload();
                                                                                                    }, 2000)
                                                                                                }
                                                                                            }
                                                                                        })
                                                                                    })
                                                                                }
                                                                            },
                                                                            {
                                                                                xtype: 'button',
                                                                                text: i18n.getKey('修改密码'),
                                                                                handler: function (btn) {
                                                                                    var data = {
                                                                                        clazz: 'com.qpp.cgp.dto.account.UserUpdateAuthInfoDTO',
                                                                                        provider: provider,
                                                                                    }

                                                                                    controller.createEditPassWardFormWindow(data, null, function (win, formData) {
                                                                                        var {
                                                                                            newPassword,
                                                                                            password
                                                                                        } = formData;

                                                                                        if (password === newPassword) {
                                                                                            JSAsyncEditQuery(authInfoUrl, formData, true, function (require, success, response) {
                                                                                                if (success) {
                                                                                                    var responseText = Ext.JSON.decode(response.responseText),
                                                                                                        queryData = responseText?.data;

                                                                                                    if (responseText.success) {
                                                                                                        win.close();
                                                                                                        console.log(queryData);
                                                                                                        setTimeout(() => {
                                                                                                            location.reload();
                                                                                                        }, 2000)
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        } else {
                                                                                            JSShowNotification({
                                                                                                type: 'info',
                                                                                                title: '密码不一致,请重新输入!',
                                                                                            });
                                                                                        }
                                                                                    })
                                                                                }
                                                                            },
                                                                            {
                                                                                xtype: 'button',
                                                                                text: i18n.getKey('删除账号'),
                                                                                // hidden: isWhiteLabelPage,
                                                                                hidden: true,
                                                                                handler: function (btn) {
                                                                                    Ext.Msg.confirm('提示', '是否删除该账号', function (selector) {
                                                                                        if (selector === 'yes') {

                                                                                        }
                                                                                    });
                                                                                }
                                                                            }
                                                                        ]
                                                                    },
                                                                ]
                                                            }
                                                        },
                                                        phone: function () {
                                                            var {regionCode, phone, provider} = item;

                                                            return {
                                                                title: i18n.getKey('手机号'),
                                                                itemId: provider,
                                                                items: [
                                                                    {
                                                                        xtype: 'displayfield',
                                                                        name: 'regionCode',
                                                                        itemId: 'regionCode',
                                                                        labelWidth: 60,
                                                                        fieldLabel: i18n.getKey('区号'),
                                                                        value: regionCode
                                                                    },
                                                                    {
                                                                        xtype: 'displayfield',
                                                                        name: 'phone',
                                                                        itemId: 'phone',
                                                                        labelWidth: 60,
                                                                        fieldLabel: i18n.getKey('手机号'),
                                                                        value: phone
                                                                    },
                                                                ]
                                                            }
                                                        },
                                                        google: function () {
                                                            var {googleEmail, provider} = item;

                                                            return {
                                                                title: i18n.getKey('Google'),
                                                                itemId: provider,
                                                                items: [
                                                                    {
                                                                        xtype: 'displayfield',
                                                                        name: 'googleEmail',
                                                                        itemId: 'googleEmail',
                                                                        fieldLabel: i18n.getKey('Google邮箱'),
                                                                        value: googleEmail
                                                                    },
                                                                ]
                                                            }
                                                        },
                                                        wechat: function () {
                                                            var {
                                                                    nickName,
                                                                    headImgUrl,
                                                                    provider,
                                                                    updateInfoOnLogin
                                                                } = item,
                                                                src = imageServer + headImgUrl;

                                                            return {
                                                                title: i18n.getKey('微信'),
                                                                itemId: provider,
                                                                items: [
                                                                    {
                                                                        xtype: 'container',
                                                                        layout: 'hbox',
                                                                        items: [
                                                                            {
                                                                                xtype: 'displayfield',
                                                                                fieldLabel: i18n.getKey('头像'),
                                                                                width: 50
                                                                            },
                                                                            {
                                                                                xtype: 'imagecomponent',
                                                                                autoEl: 'div',
                                                                                src: src + '/50/50',
                                                                                width: 50,
                                                                                height: 50,
                                                                                style: {
                                                                                    cursor: 'pointer',
                                                                                    border: '1px solid #000',
                                                                                    boxSizing: 'border-box',
                                                                                    overflow: 'hidden',
                                                                                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                                                                                },
                                                                                listeners: {
                                                                                    afterrender: function (view) {
                                                                                        var img = new Image();
                                                                                        img.src = view.src;

                                                                                        img.onload = function () {
                                                                                            Ext.create('Ext.ux.window.ImageViewer', {
                                                                                                imageSrc: src,
                                                                                                actionItem: view.el.dom.id,
                                                                                                winConfig: {
                                                                                                    title: `查看_头像预览图`
                                                                                                }
                                                                                            });
                                                                                        }

                                                                                        // 如果加载失败 替换失败图片
                                                                                        img.onerror = function () {
                                                                                            // 替换为默认图片
                                                                                            view.setSrc(path + 'js/order/view/orderlineitem/image/FAILURE.jpg?' + new Date().getTime())
                                                                                            img.src = view.src;
                                                                                            img.onload = function () {
                                                                                                view.setWidth(img.width);
                                                                                                view.setHeight(img.height);
                                                                                            };
                                                                                            img.onerror = function () {
                                                                                                console.error("默认图片加载失败:", img.src);
                                                                                            };
                                                                                        };
                                                                                    }
                                                                                }
                                                                            },
                                                                        ]
                                                                    },
                                                                    {
                                                                        xtype: 'displayfield',
                                                                        name: 'nickName',
                                                                        itemId: 'nickName',
                                                                        labelWidth: 50,
                                                                        fieldLabel: i18n.getKey('昵称'),
                                                                        value: nickName
                                                                    },
                                                                    {
                                                                        xtype: 'button',
                                                                        text: i18n.getKey('修改昵称'),
                                                                        margin: '20 25 5 25',
                                                                        width: 80,
                                                                        handler: function (btn) {
                                                                            var data = {
                                                                                clazz: 'com.qpp.cgp.dto.account.UserUpdateAuthInfoDTO',
                                                                                provider: provider,
                                                                                nickName: nickName,
                                                                                updateInfoOnLogin: updateInfoOnLogin
                                                                            }
                                                                            controller.createWeChatNameFormWindow(data, null, function (win, formData) {
                                                                                JSAsyncEditQuery(authInfoUrl, formData, true, function (require, success, response) {
                                                                                    if (success) {
                                                                                        var responseText = Ext.JSON.decode(response.responseText),
                                                                                            queryData = responseText?.data;

                                                                                        if (responseText.success) {
                                                                                            win.close();
                                                                                            console.log(queryData);
                                                                                            setTimeout(() => {
                                                                                                location.reload();
                                                                                            }, 2000)
                                                                                        }
                                                                                    }
                                                                                })
                                                                            })
                                                                        }
                                                                    },
                                                                ]
                                                            }
                                                        },
                                                    }

                                                return typeGather[provider]();
                                            })

                                        me.add(itemsArr);
                                    }
                                },
                                items: [],
                                listeners: {
                                    afterrender: function (comp) {
                                        if (id) {
                                            /*var data = [
                                                {
                                                    provider: 'password',
                                                    emailAddress: 'jingzhangj@qpp.com',
                                                },
                                                {
                                                    provider: 'wechat',
                                                    nickName: 'ArgentDawn',
                                                    headImgUrl: 'd9b564bbd316f9654b89084a11580d1e.jpg',
                                                    updateInfoOnLogin: true
                                                },
                                                {
                                                    provider: 'phone',
                                                    regionCode: '+86',
                                                    phone: '13368218147',
                                                },
                                                {
                                                    provider: 'google',
                                                    googleEmail: 'zjing7896@gmail.com'
                                                },
                                            ];*/
                                            var data = JSGetQuery(authInfoUrl);
                                            comp.diySetValue(data);
                                        }
                                    }
                                }
                            },
                        ]
                    },
                ]
            }
        ];

        me.callParent();
    },
    getValue: function () {
        var me = this,
            form = me.getComponent('form');
        return form.getValue();
    },
    setValue: function (data) {
        var me = this,
            form = me.getComponent('form');
        form.setValue(data);
    }
})