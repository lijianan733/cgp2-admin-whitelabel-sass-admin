Ext.define('CGP.product.view.modifyproductmode.ModifyProductMode', {
    extend: 'Ext.window.Window',

    modal: true,
    width: 950,
    height: 600,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('modify') + i18n.getKey('productMode');
        var productConfig = Ext.create("Ext.container.Container", {
            //height : 40,
            width: 700,
            itemId: "Container2",
            layout: 'column',
            style: {
                //"text-align" : 'right'
                marginTop: '10px',
                marginLeft: '20px'
            },

            items: [
                {
                    xtype: "displayfield",
                    width: 500,
                    fieldLabel: i18n.getKey('product') + i18n.getKey('config'),
                    value: "<font color='gray'>" + '将产品的最新版本配置修改为上线状态，并同步到SKU产品同版本配置中' + "</font>"
                },
                {
                    xtype: 'button',
                    itemId: 'productConfig',
                    width: 100,
                    frame: false,
                    text: i18n.getKey('同步配置'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        me.syncProductConfig(me.configurableId, button);
                    }
                },
                {
                    xtype: 'displayfield',
                    itemId: 'prompt',
                    style: {
                        marginLeft: '10px'
                    },
                    value: '<font color="#008000">' + i18n.getKey('success') + '</font>',
                    hidden: true
                }
            ]
        });
        var lockProductConfig = Ext.create("Ext.container.Container", {
            //height : 40,
            width: 700,
            itemId: "Container3",
            layout: 'column',
            style: {
                //"text-align" : 'right'
                marginTop: '10px',
                marginLeft: '20px'
            },

            items: [
                {
                    xtype: "displayfield",
                    width: 500,
                    fieldLabel: i18n.getKey('product') + i18n.getKey('lock'),
                    value: "<font color='gray'>" + '锁定或解除锁定产品配置！' + "</font>"
                },
                {
                    xtype: 'button',
                    itemId: 'lockProductConfig',
                    width: 100,
                    frame: false,
                    value: 'unlock',
                    text: i18n.getKey('lock') + i18n.getKey('product') + i18n.getKey('config'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        me.lockProductConfig(me.configurableId, button);
                    }
                },
                {
                    xtype: 'displayfield',
                    itemId: 'prompt',
                    style: {
                        marginLeft: '10px'
                    },
                    value: '<font color="#008000">' + i18n.getKey('success') + '</font>',
                    hidden: true
                }
            ]
        });
        var productMode = Ext.create("Ext.container.Container", {
            //height : 40,
            width: 700,
            itemId: "Container1",
            layout: 'column',
            style: {
                //"text-align" : 'right'
                marginTop: '10px',
                marginLeft: '20px'
            },

            items: [
                {
                    xtype: "displayfield",
                    width: 500,
                    fieldLabel: i18n.getKey('productMode'),
                    value: "<font color='gray'>" + '修改产品模式，并同步sku产品' + "</font>"
                },
                {
                    xtype: 'button',
                    itemId: 'productMode',
                    width: 100,
                    frame: false,
                    text: i18n.getKey('modify') + i18n.getKey('productMode'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        me.modifyProductMode(me.configurableId, button);
                    }
                },
                {
                    xtype: 'displayfield',
                    itemId: 'prompt',
                    style: {
                        marginLeft: '10px'
                    },
                    value: '<font color="#008000">' + i18n.getKey('success') + '</font>',
                    hidden: true
                }
            ]
        });
        me.items = [productMode, lockProductConfig, productConfig];
        me.listeners = {
            afterrender: function (comp) {
                var lockButton = lockProductConfig.getComponent('lockProductConfig');
                Ext.Ajax.request({
                    url: adminPath + 'api/productlockconfigs/checkIsLock/' + me.configurableId,
                    method: 'GET',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        if (response.success) {
                            if (response.data == true) {
                                lockButton.setText(i18n.getKey('unlock') + i18n.getKey('product') + i18n.getKey('config'));
                                lockButton.value = 'unlock';
                            } else {
                                lockButton.setText(i18n.getKey('lock') + i18n.getKey('product') + i18n.getKey('config'));
                                lockButton.value = 'lock';
                            }
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
                lockButton.setText(i18n.getKey())
            }
        }
        me.callParent(arguments);
    },
    modifyProductMode: function (configurableId, button) {
        var form = {
            xtype: 'form',
            border: false,
            padding: '20',
            items: [
                {
                    xtype: 'combo',
                    itemId: 'mode',
                    width: 250,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '测试', value: 'TEST'},
                            {name: '正式', value: 'RELEASE'}
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    value: 'RELEASE',
                    name: 'productMode',
                    fieldLabel: i18n.getKey('productMode'),
                    allowBlank: false,
                    msgTarget: 'side'
                }
            ]
        };
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('choice') + i18n.getKey('productMode'),
            modal: true,
            width: 350,
            layout: 'fit',
            height: 150,
            bbar: ['->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'confirm',
                handler: function () {
                    var win = this.ownerCt.ownerCt;
                    var form = win.down('panel');
                    var modeValue = form.getComponent('mode').getValue();
                    if (form.isValid()) {
                        Ext.Ajax.request({
                            url: adminPath + 'api/products/' + configurableId + '/mode?mode=' + modeValue,
                            method: 'PUT',
                            headers: {
                                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                            },
                            success: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                if (response.success) {
                                    var prompt = button.ownerCt.getComponent("prompt");
                                    win.close();
                                    prompt.show();
                                } else {
                                    win.close();
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                var prompt = button.ownerCt.getComponent("prompt");
                                prompt.setValue("<div>" + i18n.getKey('failure') + ":" + response.data.message + "</div>");
                                win.close();
                                prompt.show();
                            }
                        });
                    }

                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                itemId: 'cancel',
                handler: function () {
                    var win = this.ownerCt.ownerCt.ownerCt;
                    win.close();
                }
            }],

            items: [form]
        }).show();

    },
    syncProductConfig: function (configurableId, button) {
        Ext.Msg.confirm(i18n.getKey('prompt'), '是否将产品的最新版本配置修改为上线状态，并同步到SKU产品同版本配置中？', function (select) {
            if (select == 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/productConfigs/status/latest/products/' + configurableId,
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        if (response.success) {
                            var prompt = button.ownerCt.getComponent("prompt");
                            prompt.show();
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var prompt = button.ownerCt.getComponent("prompt");
                        prompt.setValue("<div>" + i18n.getKey('failure') + ":" + response.data.message + "</div>");
                        prompt.show();
                    }
                });
            }
        })

    },
    lockProductConfig: function (configurableId, button) {
        var status = {
            lock: '锁定',
            unlock: '解除锁定'
        };
        var lockButton = this.getComponent('Container3').getComponent('lockProductConfig');
        Ext.Msg.confirm(i18n.getKey('prompt'), '是否将产品配置' + status[button.value] + '？', function (select) {
            if (select == 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/productlockconfigs/' + button.value + '/' + configurableId,
                    method: 'PUT',
                    headers: {
                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                    },
                    success: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var isLock = response.data.isLock;
                        if (response.success) {
                            Ext.util.Cookies.set(configurableId + '_isLock', isLock, null, '/' + top.pathName);
                            if (button.value == 'lock') {
                                lockButton.setText(i18n.getKey('unlock') + i18n.getKey('product') + i18n.getKey('config'));
                                lockButton.value = 'unlock';
                            } else {
                                lockButton.setText(i18n.getKey('lock') + i18n.getKey('product') + i18n.getKey('config'));
                                lockButton.value = 'lock';
                            }
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        var prompt = button.ownerCt.getComponent("prompt");
                        prompt.setValue("<div>" + i18n.getKey('failure') + ":" + response.data.message + "</div>");
                        prompt.show();
                    }
                });
            }
        })

    }
});
