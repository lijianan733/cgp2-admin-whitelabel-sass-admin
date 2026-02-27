/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.define('CGP.customer.controller.Controller', {
    createEditEmailFormWindow: function (data, key, callBack) {
        var controller = this,
            isEdit = !!data,
            id = isEdit ? data[key] : '';

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('修改_邮箱'),
            width: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        isFilterComp: false,
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            allowBlank: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('clazz'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'provider',
                            itemId: 'provider',
                            allowBlank: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('类型'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'emailAddress',
                            itemId: 'emailAddress',
                            allowBlank: false,
                            fieldLabel: i18n.getKey('邮箱'),
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                },
                cancelBtnCfg: {
                    hidden: true
                }
            },
        }).show();
    },

    createEditPassWardFormWindow: function (data, key, callBack) {
        var controller = this,
            isEdit = !!data,
            id = isEdit ? data[key] : '';

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('修改_密码'),
            width: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        allowBlank: false,
                        isFilterComp: false,
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'provider',
                            itemId: 'provider',
                            allowBlank: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('类型'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            allowBlank: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('clazz'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'newPassword',
                            itemId: 'newPassword',
                            fieldLabel: i18n.getKey('新密码'),
                            inputType: 'password',
                            minLength: 6,
                            maxLength: 18,
                            regex: /^[\dA-Za-z(!@#$%&)]{6,15}$/,
                            regexText: 'Password length must be between 6 to 15',
                            allowBlank: false,
                        },
                        {
                            xtype: 'container',
                            width: '100%',
                            layout: 'hbox',
                            name: 'password',
                            itemId: 'password',
                            diyGetValue: function () {
                                var me = this,
                                    password = me.getComponent('password');

                                return password.getValue();
                            },
                            diySetValue: function (data) {
                                var me = this,
                                    password = me.getComponent('password');

                                password.setValue(data);
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'password',
                                    itemId: 'password',
                                    inputType: 'password',
                                    minLength: 6,
                                    maxLength: 18,
                                    allowBlank: false,
                                    regex: /^[\dA-Za-z(!@#$%&)]{6,15}$/,
                                    regexText: 'Password length must be between 6 to 15',
                                    fieldLabel: i18n.getKey('确认密码'),
                                    listeners: {
                                        blur: function () {
                                            var me = this,
                                                form = me.ownerCt.ownerCt,
                                                value = me.getValue(),
                                                newPassword = form.getComponent('newPassword'),
                                                newPasswordValue = newPassword.getValue();

                                            if (newPasswordValue !== value) {
                                                this.markInvalid('密码输入不一致！');
                                            }
                                        },
                                        afterrender: function (field) {
                                            // 创建切换按钮
                                            var button = Ext.create('Ext.button.Button', {
                                                text: '🔒',
                                                width: 30,
                                                height: 25,
                                                isFilterComp: true,
                                                style: 'position: absolute; right: 5px; top: 2px;',
                                                componentCls: "btnOnlyIcon",
                                                handler: function (btn) {
                                                    var inputEl = field.inputEl,
                                                        currentType = inputEl.dom.type,
                                                        newType = currentType === 'password' ? 'text' : 'password',
                                                        text = JSCreateFont('#000', true, i18n.getKey('👁'), 18);

                                                    // 直接修改DOM属性
                                                    inputEl.dom.type = newType;

                                                    // 更新按钮文本
                                                    btn.setText(newType === 'password' ? '🔒' : text);
                                                }
                                            });

                                            // 将按钮添加到字段容器中
                                            field.up().add(button);
                                        }
                                    },
                                },
                            ]
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                },
                cancelBtnCfg: {
                    hidden: true
                }
            },
        }).show();
    },

    createWeChatNameFormWindow: function (data, key, callBack) {
        var controller = this,
            isEdit = !!data,
            id = isEdit ? data[key] : '';

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('修改_昵称'),
            width: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        labelWidth: 130,
                        margin: '10 25 5 25',
                        isFilterComp: false,
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            allowBlank: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('clazz'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'provider',
                            itemId: 'provider',
                            allowBlank: false,
                            hidden: true,
                            fieldLabel: i18n.getKey('类型'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'nickName',
                            itemId: 'nickName',
                            allowBlank: false,
                            fieldLabel: i18n.getKey('昵称'),
                        },
                        {
                            xtype: 'booleancombo',
                            name: 'updateInfoOnLogin',
                            itemId: 'updateInfoOnLogin',
                            fieldLabel: i18n.getKey('是否同步微信昵称'),
                            allowBlank: false,
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                },
                cancelBtnCfg: {
                    hidden: true
                }
            },
        }).show();
    },

    createAddLoginMethodFormWindow: function (data, key, callBack) {
        var controller = this,
            isEdit = !!data,
            id = isEdit ? data[key] : '';

        return Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            title: i18n.getKey('添加_登录方式'),
            width: 400,
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 5 25',
                        isFilterComp: false,
                    },
                    layout: 'vbox',
                    diyGetValue: function () {
                        var me = this,
                            result = {},
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                            }
                        })

                        return result;
                    },
                    diySetValue: function (data) {
                        var me = this,
                            items = me.items.items;

                        items.forEach(item => {
                            var {name, isFilterComp} = item;

                            if (!isFilterComp) {
                                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                            }
                        })
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            fieldLabel: i18n.getKey('预览模式'),
                            colspan: 2,
                            vertical: true,
                            itemId: 'previewMode',
                            items: [
                                {
                                    boxLabel: '邮箱',
                                    width: 100,
                                    name: 'loginMethod',
                                    inputValue: 'email',
                                    checked: true,
                                },
                            ],
                        },
                        {
                            xtype: 'textfield',
                            name: 'email',
                            itemId: 'email',
                            allowBlank: false,
                            fieldLabel: i18n.getKey('邮箱'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'newPassword',
                            itemId: 'newPassword',
                            fieldLabel: i18n.getKey('密码'),
                            inputType: 'password',
                            minLength: 6,
                            maxLength: 18,
                            regex: /^[\dA-Za-z(!@#$%&)]{6,15}$/,
                            regexText: 'Password length must be between 6 to 15',
                            allowBlank: false,
                        },
                        {
                            xtype: 'container',
                            width: '100%',
                            layout: 'hbox',
                            name: 'password',
                            itemId: 'password',
                            diyGetValue: function () {
                                var me = this,
                                    password = me.getComponent('password');

                                return password.getValue();
                            },
                            diySetValue: function (data) {
                                var me = this,
                                    password = me.getComponent('password');

                                password.setValue(data);
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'password',
                                    itemId: 'password',
                                    inputType: 'password',
                                    minLength: 6,
                                    maxLength: 18,
                                    allowBlank: false,
                                    regex: /^[\dA-Za-z(!@#$%&)]{6,15}$/,
                                    regexText: 'Password length must be between 6 to 15',
                                    fieldLabel: i18n.getKey('确认密码'),
                                    listeners: {
                                        blur: function () {
                                            var me = this,
                                                form = me.ownerCt.ownerCt,
                                                value = me.getValue(),
                                                newPassword = form.getComponent('newPassword'),
                                                newPasswordValue = newPassword.getValue();

                                            if (newPasswordValue !== value) {
                                                this.markInvalid('密码输入不一致！');
                                            }
                                        },
                                        afterrender: function (field) {
                                            // 创建切换按钮
                                            var button = Ext.create('Ext.button.Button', {
                                                text: '🔒',
                                                width: 30,
                                                height: 25,
                                                isFilterComp: true,
                                                style: 'position: absolute; right: 5px; top: 2px;',
                                                componentCls: "btnOnlyIcon",
                                                handler: function (btn) {
                                                    var inputEl = field.inputEl,
                                                        currentType = inputEl.dom.type,
                                                        newType = currentType === 'password' ? 'text' : 'password',
                                                        text = JSCreateFont('#000', true, i18n.getKey('👁'), 18);

                                                    // 直接修改DOM属性
                                                    inputEl.dom.type = newType;

                                                    // 更新按钮文本
                                                    btn.setText(newType === 'password' ? '🔒' : text);
                                                }
                                            });

                                            // 将按钮添加到字段容器中
                                            field.up().add(button);
                                        }
                                    },
                                },
                            ]
                        },
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            data && comp.diySetValue(data);
                        }
                    }
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = form.diyGetValue();

                        if (form.isValid()) {
                            console.log(formData);
                            callBack && callBack(win, formData);
                        }
                    }
                },
            },
        }).show();
    },

    setQueryErrorInfo: function (errorCode) {
        var isIncludeCode = [108000450, 108000451, 108000454, 108000455, 108000456].includes(+errorCode),
            newErrorCode = isIncludeCode ? errorCode : 'default',
            codeGather = {
                108000450: '账号已经存在',
                108000451: '账号格式不符合',
                108000454: '用户不存在对应的账号类型',
                108000455: '邮箱不合法',
                108000456: '邮箱已注册',
                default: errorCode,
            },
            errorInfo = codeGather[newErrorCode];

        JSShowNotification({
            type: 'info',
            title: errorInfo,
        })
    }
})