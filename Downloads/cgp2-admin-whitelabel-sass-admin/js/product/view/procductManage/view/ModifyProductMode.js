Ext.define('CGP.product.view.procductManage.view.ModifyProductMode', {
    extend: "Ext.panel.Panel",
    alias: 'widget.mproductmode',
    modal: true,
    width: 950,
    height: 600,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('modify') + i18n.getKey('productMode');
        var controller = Ext.create('CGP.product.view.procductManage.controller.Controller');
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
                    id:'btnProductMode',
                    itemId: 'productMode',
                    width: 100,
                    frame: false,
                    text: i18n.getKey('modify') + i18n.getKey('productMode'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        controller.modifyProductMode(me.configurableId, button);
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
                    id: 'btnLockProduct',
                    itemId: 'lockProductConfig',
                    width: 100,
                    frame: false,
                    value: 'unlock',
                    text: i18n.getKey('lock') + i18n.getKey('product') + i18n.getKey('config'),
                    iconCls:'icon_unlock',
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        controller.lockProductConfig(me.configurableId, button);
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
                    id: 'btnSyncProductConfig',
                    itemId: 'productConfig',
                    width: 100,
                    frame: false,
                    text: i18n.getKey('同步配置'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        controller.syncProductConfig(me.configurableId, button);
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
        var customsElements = Ext.create("Ext.container.Container", {
            //height : 40,
            width: 700,
            itemId: "customsElements",
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
                    fieldLabel: i18n.getKey('customsElements'),
                    value: "<font color='gray'>" + '同步sku' + i18n.getKey('product') + i18n.getKey('customsElements') + "</font>"
                },
                {
                    xtype: 'button',
                    id: 'btnSyncCustomsEl',
                    itemId: 'syncBtn',
                    width: 100,
                    frame: false,
                    text: i18n.getKey('同步'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        controller.syncElements(me);
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
            ],
            listeners:{
                beforerender:function (comp){
                     if(me.record.get('type') == 'SKU'){
                         return false;
                     }
                }
            }
        });
        var syncProduct = Ext.create("Ext.container.Container", {
            //height : 40,
            width: 700,
            itemId: "syncProduct",
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
                    fieldLabel: i18n.getKey('product') + i18n.getKey('sync'),
                    value: "<font color='gray'>" + '将当前产品配置、排版配置及排版模板发布到指定环境' + "</font>"
                },
                {
                    xtype: 'button',
                    id: 'btnSyncProduct',
                    itemId: 'productConfig',
                    width: 100,
                    frame: false,
                    text: i18n.getKey('同步'),
                    style: {
                        //'text-align':'right',
                        marginLeft: '50px'
                    },
                    handler: function (button) {
                        controller.syncProductData(me.record.data,button.ownerCt);
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
        me.items = [productMode, lockProductConfig, productConfig,customsElements,syncProduct];
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
                            controller.toggleLockStyle(lockButton,response.data);

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
            },
            activate:function (comp){
                var isProductManager=comp.ownerCt.isProductManager;
                controller.toggleDisabled(["btnProductMode","btnLockProduct","btnSyncProductConfig","btnSyncCustomsEl","btnSyncProduct"],isProductManager);
            }
        }
        me.callParent(arguments);
    },

});