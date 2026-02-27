/**
 * @author xiu
 * @date 2023/10/24
 */
Ext.Loader.syncRequire([
    'CGP.promotion.view.EmailGridWindow'
]);
Ext.define("CGP.promotion.view.PromotionLimitation", {
    extend: 'Ext.container.Container',
    alias: 'widget.promotionLimitation',
    isValid: function () {
        return true;
    },
    getName: function () {
        return this.name;
    },
    diyGetValue: function () {
        var me = this,
            promotionLimitation = me.getComponent('promotionLimitation');
        return promotionLimitation.diyGetValue();
    },
    diySetValue: function (data) {
        var me = this,
            promotionLimitation = me.getComponent('promotionLimitation');
        promotionLimitation.diySetValue(data);
    },
    initComponent: function () {
        const me = this;
        me.items = [
            {
                xtype: 'splitbar',
                width: '100%',
                itemId: 'splitbar2',
                margin: 5,
                colspan: 2,
                title: '<font color="green" style="font-weight: bold">' + i18n.getKey('条件限制') + '</font>'
            },
            //允许为空
            {
                xtype: 'uxfieldcontainer',
                name: 'promotionLimitation',
                itemId: 'promotionLimitation',
                width: '100%',
                margin: '5 25 0 25',
                defaults: {},
                items: [
                    {
                        xtype: 'container',
                        itemId: 'timesLimitation',
                        name: 'timesLimitation',
                        width: '100%',
                        getName: function () {
                            return this.name;
                        },
                        diySetValue: function (data) {
                            var me = this,
                                result = {},
                                items = me.items.items;

                            data.forEach(item => {
                                const {clazz} = item;
                                if (clazz === 'com.qpp.cgp.domain.promotion.limit.TimesLimitation') {
                                    result = item;
                                }
                            })

                            items.forEach(item => {
                                const {name} = item;
                                item.diySetValue ? item.diySetValue(result[name]) : item.setValue(result[name]);
                            })
                        },
                        diyGetValue: function () {
                            const me = this,
                                result = {},
                                items = me.items.items,
                                userTotal = me.getComponent('userTotal'),
                                userTotalValue = userTotal.getValue();

                            items.forEach(item => {
                                result[item.name] = item.getValue()
                            })

                            if (userTotalValue) {
                                return result;
                            }
                        },
                        items: [
                            {
                                xtype: 'hiddenfield',
                                name: '_id',
                                itemId: '_id',
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'clazz',
                                itemId: 'clazz',
                                value: 'com.qpp.cgp.domain.promotion.limit.TimesLimitation',
                                diySetValue: Ext.emptyFn
                            },
                            {
                                xtype: 'numberfield',
                                name: 'userTotal',
                                itemId: 'userTotal',
                                fieldLabel: i18n.getKey('用户该活动最大可参与次数'),
                                allowBlank: true,
                                allowDecimals: false,
                                minValue: 1,
                                labelWidth: 160,
                                emptyText: '不填表示无次数限制'
                            },
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        title: i18n.getKey('用户名单限制'),
                        name: 'userLimitation',
                        itemId: 'userLimitation',
                        collapsible: true,
                        defaults: {
                            margin: '5 10 10 0',
                        },
                        width: 900,
                        getName: function () {
                            return this.name;
                        },
                        diySetValue: function (data) {
                            var me = this,
                                result = {},
                                items = me.items.items;

                            if (!Ext.isEmpty(data)) {
                                data.forEach(item => {
                                    const {clazz} = item;
                                    if (clazz === 'com.qpp.cgp.domain.promotion.limit.UserLimitation') {
                                        result = item;
                                    }
                                })

                                items.forEach(item => {
                                    const {name} = item;
                                    item.diySetValue ? item.diySetValue(result[name]) : item.setValue(result[name]);
                                })
                            }
                        },
                        diyGetValue: function () {
                            const me = this,
                                result = {},
                                items = me.items.items
                            items.forEach(item => {
                                result[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue()
                            })

                            const {registerDurationLimit, emailWhiteList, emailBlackList} = result,
                                {year, mouth, day} = registerDurationLimit,
                                isEmptyRegisterDurationLimit = year || mouth || day,
                                isEmptyEmailWhiteList = emailWhiteList.length,
                                isEmptyEmailBlackList = emailBlackList.length;

                            // 判断是否为空 为空不传值
                            if (isEmptyRegisterDurationLimit || isEmptyEmailWhiteList || isEmptyEmailBlackList) {
                                return result;
                            }
                        },
                        items: [
                            {
                                xtype: 'hiddenfield',
                                name: '_id',
                                itemId: '_id',
                            },
                            {
                                xtype: 'hiddenfield',
                                name: 'clazz',
                                itemId: 'clazz',
                                value: 'com.qpp.cgp.domain.promotion.limit.UserLimitation',
                                diySetValue: Ext.emptyFn
                            },
                            {
                                xtype: 'container',
                                name: 'registerDurationLimit',
                                itemId: 'registerDurationLimit',
                                layout: 'hbox',
                                width: '100%',
                                defaults: {
                                    xtype: 'numberfield',
                                    width: 80,
                                    labelWidth: 80,
                                },
                                diySetValue: function (data) {
                                    var me = this,
                                        items = me.items.items;

                                    if (!Ext.isEmpty(data)) {
                                        items.forEach(item => {
                                            const {name, itemId} = item;
                                            name && (item.diySetValue ? item.diySetValue(data[itemId]) : item.setValue(data[itemId]));
                                        })
                                    }
                                },
                                diyGetValue: function () {
                                    const me = this,
                                        result = {},
                                        items = me.items.items
                                    items.forEach(item => {
                                        item?.name && (result[item.name] = item.getValue())
                                    })
                                    return result;
                                },
                                items: [
                                    {
                                        xtype: 'displayfield',
                                        labelWidth: 100,
                                        fieldLabel: i18n.getKey('注册后使用期限'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        margin: '0 0 0 30',
                                        minValue: 0,
                                        name: 'year',
                                        itemId: 'year'
                                    },
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.getKey('年'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'month',
                                        itemId: 'month',
                                        minValue: 0,
                                        maxValue: 12,
                                    },
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.getKey('月'),
                                    },
                                    {
                                        xtype: 'numberfield',
                                        name: 'day',
                                        itemId: 'day',
                                        minValue: 0,
                                        maxValue: 31,
                                    },
                                    {
                                        xtype: 'displayfield',
                                        value: i18n.getKey('日'),
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'add_emailWhiteList',
                                        iconCls: 'icon_add',
                                        text: '添加白名单',
                                        width: 120,
                                        ui: 'default-toolbar-small',
                                        handler: function (btn) {
                                            const fieldSet = btn.ownerCt.ownerCt,
                                                emailWhiteList = fieldSet.getComponent('emailWhiteList');
                                            emailWhiteList.setVisible(true);
                                            btn.setDisabled(true);
                                        },
                                        listeners: {
                                            afterrender: function (btn) {
                                                const fieldSet = btn.ownerCt.ownerCt,
                                                    emailWhiteList = fieldSet.getComponent('emailWhiteList');

                                                setTimeout(() => {
                                                    const value = emailWhiteList.getValue();
                                                    emailWhiteList.setVisible(!Ext.isEmpty(value));
                                                    btn.setDisabled(!Ext.isEmpty(value));
                                                }, 1000)
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'button',
                                        itemId: 'add_emailBlackList',
                                        iconCls: 'icon_add',
                                        text: '添加黑名单',
                                        margin: '0 0 0 10',
                                        width: 120,
                                        ui: 'default-toolbar-small',
                                        handler: function (btn) {
                                            const fieldSet = btn.ownerCt.ownerCt,
                                                emailBlackList = fieldSet.getComponent('emailBlackList');
                                            emailBlackList.setVisible(true);
                                            btn.setDisabled(true);
                                        },
                                        listeners: {
                                            afterrender: function (btn) {
                                                const fieldSet = btn.ownerCt.ownerCt,
                                                    emailBlackList = fieldSet.getComponent('emailBlackList');

                                                setTimeout(() => {
                                                    const value = emailBlackList.getValue();
                                                    emailBlackList.setVisible(!Ext.isEmpty(value));
                                                    btn.setDisabled(!Ext.isEmpty(value));
                                                }, 1000)
                                            }
                                        }
                                    },
                                ]
                            },
                            {
                                xtype: 'arraydatafield',
                                width: 800,
                                height: 200,
                                resultType: 'Array',//该组件获取结果和设置值的数据类型
                                fieldLabel: i18n.getKey('白名单'),
                                name: 'emailWhiteList',
                                itemId: 'emailWhiteList',
                                panelConfig: {
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'right',
                                            width: 80,
                                            layout: {
                                                type: 'vbox',
                                                align: 'center'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    dock: 'right',
                                                    disabled: me.readOnly,
                                                    iconCls: 'icon_add',
                                                    width: 60,
                                                    margin: '5 0 0 5',
                                                    text: i18n.getKey('add'),
                                                    handler: function (addBtn) {
                                                        var emailWhiteList = addBtn.ownerCt.ownerCt.ownerCt,
                                                            fieldSet = emailWhiteList.ownerCt,
                                                            emailBlackList = fieldSet.getComponent('emailBlackList'),
                                                            emailBlackListValue = emailBlackList.getValue(),
                                                            emailWhiteListValue = emailWhiteList.getValue(),
                                                            win = Ext.create('Ext.window.Window', {
                                                                modal: true,
                                                                width: 900,
                                                                height: 600,
                                                                layout: 'fit',
                                                                constrain: true,
                                                                title: i18n.getKey('查看_用户'),
                                                                items: [
                                                                    {
                                                                        xtype: 'emailGridWindow',
                                                                        itemId: 'emailGridWindow',
                                                                        margin: 0,
                                                                        storeFilter: emailWhiteListValue,
                                                                        otherStoreFilter: emailBlackListValue,
                                                                    }
                                                                ],
                                                                bbar: {
                                                                    xtype: 'bottomtoolbar',
                                                                    saveBtnCfg: {
                                                                        handler: function (btn) {
                                                                            const result = [],
                                                                                win = btn.ownerCt.ownerCt,
                                                                                emailGridWindow = win.getComponent('emailGridWindow'),
                                                                                grid = emailGridWindow.getComponent('grid'),
                                                                                oldValue = emailWhiteList.getValue(),
                                                                                selection = grid.getSelectionModel().getSelection()

                                                                            if (selection.length) {
                                                                                selection.forEach(item => {
                                                                                    result.push(item.data.email);
                                                                                })
                                                                            } else {
                                                                                Ext.Msg.alert('提示', '请选择用户');
                                                                            }

                                                                            emailWhiteList.setValue(Ext.Array.merge(oldValue, result));
                                                                            win.close();
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                        win.show();
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    dock: 'right',
                                                    disabled: me.readOnly,
                                                    iconCls: 'icon_clear',
                                                    width: 60,
                                                    margin: '5 0 0 5',
                                                    text: i18n.getKey('清空'),
                                                    handler: function (addBtn) {
                                                        var emailWhiteList = addBtn.ownerCt.ownerCt.ownerCt;
                                                        Ext.Msg.confirm('提示', '确定清空所有内容？', function (selector) {
                                                            if (selector === "yes") {
                                                                emailWhiteList.reset();
                                                            }
                                                        })
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                },
                            },
                            {
                                xtype: 'arraydatafield',
                                width: 800,
                                height: 200,
                                resultType: 'Array',//该组件获取结果和设置值的数据类型
                                fieldLabel: i18n.getKey('黑名单'),
                                name: 'emailBlackList',
                                itemId: 'emailBlackList',
                                panelConfig: {
                                    dockedItems: [
                                        {
                                            xtype: 'toolbar',
                                            dock: 'right',
                                            width: 80,
                                            layout: {
                                                type: 'vbox',
                                                align: 'center'
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    dock: 'right',
                                                    disabled: me.readOnly,
                                                    iconCls: 'icon_add',
                                                    width: 60,
                                                    margin: '5 0 0 5',
                                                    text: i18n.getKey('add'),
                                                    handler: function (addBtn) {
                                                        var emailBlackList = addBtn.ownerCt.ownerCt.ownerCt,
                                                            fieldSet = emailBlackList.ownerCt,
                                                            emailWhiteList = fieldSet.getComponent('emailWhiteList'),
                                                            emailBlackListValue = emailWhiteList.getValue(),
                                                            emailWhiteListValue = emailBlackList.getValue(),
                                                            win = Ext.create('Ext.window.Window', {
                                                                modal: true,
                                                                width: 900,
                                                                height: 600,
                                                                layout: 'fit',
                                                                constrain: true,
                                                                title: i18n.getKey('查看_用户'),
                                                                items: [
                                                                    {
                                                                        xtype: 'emailGridWindow',
                                                                        itemId: 'emailGridWindow',
                                                                        margin: 0,
                                                                        storeFilter: emailWhiteListValue,
                                                                        otherStoreFilter: emailBlackListValue,
                                                                    }
                                                                ],
                                                                bbar: {
                                                                    xtype: 'bottomtoolbar',
                                                                    saveBtnCfg: {
                                                                        handler: function (btn) {
                                                                            const result = [],
                                                                                win = btn.ownerCt.ownerCt,
                                                                                emailGridWindow = win.getComponent('emailGridWindow'),
                                                                                grid = emailGridWindow.getComponent('grid'),
                                                                                oldValue = emailBlackList.getValue(),
                                                                                selection = grid.getSelectionModel().getSelection()

                                                                            if (selection.length) {
                                                                                selection.forEach(item => {
                                                                                    result.push(item.data.email);
                                                                                })
                                                                            } else {
                                                                                Ext.Msg.alert('提示', '请选择用户');
                                                                            }

                                                                            emailBlackList.setValue(Ext.Array.merge(oldValue, result));
                                                                            win.close();
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                        win.show();
                                                    }
                                                },
                                                {
                                                    xtype: 'button',
                                                    dock: 'right',
                                                    disabled: me.readOnly,
                                                    iconCls: 'icon_clear',
                                                    width: 60,
                                                    margin: '5 0 0 5',
                                                    text: i18n.getKey('清空'),
                                                    handler: function (addBtn) {
                                                        var emailWhiteList = addBtn.ownerCt.ownerCt.ownerCt;
                                                        Ext.Msg.confirm('提示', '确定清空所有内容？', function (selector) {
                                                            if (selector === "yes") {
                                                                emailWhiteList.reset();
                                                            }
                                                        })
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                }
                            },
                        ]
                    }
                ],
                diyGetValue: function () {
                    var me = this,
                        result = [],
                        data = me.getValue(),
                        {timesLimitation, userLimitation} = data;

                    [timesLimitation, userLimitation].forEach(item => {
                        item && result.push(item);
                    })

                    return result;
                },
                diySetValue: function (data) {
                    var me = this,
                        items = me.items.items;
                    if (data) {
                        items.forEach(item => {
                            item.diySetValue(data)
                        })
                    }
                }
            },
        ]
        me.callParent();
    }
})
