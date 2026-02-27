/**
 * Create by shirley on 2021/8/26
 * 计费规则自定义组件
 * */
Ext.Loader.syncRequire([
    // 'CGP.shippingquotationtemplatemanage.view.ProductQtyShipping',
    'CGP.shippingquotationtemplatemanage.view.CountriesWindow',
    'CGP.shippingquotationtemplatemanage.view.QtyRuleShippingConfig',
    'CGP.shippingquotationtemplatemanage.view.AreaRuleShippingConfig',
    'CGP.shippingquotationtemplatemanage.view.shippingConfigTemplateWindow',
    'CGP.shippingquotationtemplatemanage.controller.Controller'
])
Ext.define('CGP.shippingquotationtemplatemanage.view.EditCustomShippingWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.editcustomshippingwindow',
    layout: 'fit',
    createOrEdit: 'create',
    //修改传值
    record: null,
    rowIndex: null,
    //传递外层组件
    _Panel: null,
    modal: true,
    readOnly: false,
    selectedShippingRules: null,
    listeners: {
        afterrender: function (win) {
            if (win.record) {
                var form = win.items.items[0];
                form.setValue(win.record.getData());
            }
        }
    },
    initComponent: function () {
        var me = this;
        if (me.record) {
            me.createOrEdit = 'edit';
        }
        var controller = Ext.create('CGP.shippingquotationtemplatemanage.controller.Controller');
        me.title = i18n.getKey(me.createOrEdit) + '' + i18n.getKey('billingRule');
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                border: false,
                padding: 10,
                defaults: {
                    margin: '5 10 5 10',
                    allowBlank: false,
                    width: 500
                },
                isValidForItems: true,
                items: [
                    {
                        xtype: 'textfield',
                        name: '_id',
                        value: '_id',
                        hidden: true,
                        allowBlank: true,
                    },
                    {
                        name: 'areas',
                        fieldLabel: i18n.getKey('country'),
                        itemId: 'areas',
                        xtype: 'arearuleshippingconfig',
                        width: 770,
                    },
                    {
                        name: 'areaQtyShippingConfigs',
                        fieldLabel: i18n.getKey('quantityRule'),
                        xtype: 'qtyruleshippingconfig',
                        id: 'qtyruleshippingconfigId',
                        itemId: 'areaQtyShippingConfigs',
                        width: 770
                    },
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                        // itemId: 'clazz',
                        value: 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfig',
                        hidden: true
                    }
                ]
            }
        ];
        me.bbar = {
            hidden: me.readOnly,
            items: [
                {
                    xtype: 'button',
                    text: i18n.getKey('saveAsTemplate'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt.items.items[0];
                        if (form.isValid()) {
                            var areaQtyShippingConfigs = Ext.getCmp('qtyruleshippingconfigId').diyGetValue();
                            var shippingTemplateObj = form.getValues();
                            shippingTemplateObj['areaQtyShippingConfigs'] = areaQtyShippingConfigs;
                            shippingTemplateObj['clazz'] = 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfigTemplate'
                            shippingTemplateObj['_id'] = null;
                            var url = adminPath + 'api/areaShippingConfigTemplates'
                            var httpMethod = 'POST';
                            Ext.Ajax.request({
                                url: url,
                                method: httpMethod,
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                jsonData: shippingTemplateObj,
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('save'), 'Has been added as a pricing rule template.');
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('prompt'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('reselectTemplate'),
                    iconCls: 'icon_redo',
                    hidden: function () {
                        if (!Ext.isEmpty(me.record)) {
                            return true;
                        }
                    }(),
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = Ext.create('CGP.shippingquotationtemplatemanage.view.shippingConfigTemplateWindow', {
                            _panel: form._panel
                        });
                        form.close();
                        win.show();
                    },
                },
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var me = this;
                        var win = me.ownerCt.ownerCt;
                        var form = btn.ownerCt.ownerCt.items.items[0];
                        if (form.isValid()) {
                            var store = win._panel?.getStore() || win.record?.store;
                            var areaQtyShippingObj = form.getValues();
                            //检查是否添加了重复了的数据
                            for (var i = 0; i < store.proxy.data.length; i++) {
                                if (areaQtyShippingObj.areas.length == store.proxy.data[i].areas.length) {
                                    if (win.record && i == win.record.index) {
                                        continue;
                                    }
                                    if (JSObjectValueEqual(areaQtyShippingObj.areas, store.proxy.data[i].areas)) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该地区的配置已经存在'));
                                        return;
                                    }
                                }
                            }
                            if (!Ext.isEmpty(win.record)) {
                                if (store.proxy.data) {//处理本地数据
                                    store.proxy.data[win.rowIndex] = areaQtyShippingObj;
                                    store.load();
                                }
                            } else {
                                if (!Ext.isEmpty(win._panel)) {//处理本地数据
                                    //创建id
                                    areaQtyShippingObj['_id'] = controller.createId().toString();
                                    store.proxy.data.push(areaQtyShippingObj);
                                    store.load();
                                }
                            }
                            win.close();
                        }
                    },
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        me.close()
                    }
                }
            ]
        };
        me.callParent();
    }
})