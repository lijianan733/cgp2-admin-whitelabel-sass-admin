/**
 * Created by nan on 2020/11/5
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.BuilderConfigForm',
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.ResourceConfigForm',
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.BuilderConfigV2Store',
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.Background'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.BuilderConfigTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.builderconfigtab',
    builderConfigData: null,//配置数据
    controller: null,
    listeners: {
        afterrender: function () {
            var me = this;
            var productConfigViewId = JSGetQueryString('productViewConfigId');
            me.productConfigViewId = productConfigViewId;
            var store = Ext.create('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.store.BuilderConfigV2Store', {
                params: {
                    filter: Ext.JSON.encode([{
                        name: 'productConfigViewId',
                        type: 'number',
                        value: productConfigViewId
                    }])
                },
                listeners: {
                    load: function (store, recrods) {
                        if (recrods.length > 0) {
                            me.builderConfigData = recrods[0].getData();
                            me.setValue(me.builderConfigData);
                        } else {
/*
                            //默认创建一个空的配置
                            var data = {
                                "productConfigViewId": productConfigViewId,
                                "clazz": "com.qpp.cgp.domain.product.config.v2.builder.BuilderConfigV2",
                                "builderViewResourceConfig": {
                                    clazz: 'com.qpp.cgp.domain.product.config.v2.builder.BuilderViewResourceConfig'
                                },
                                "defaultUrl": null,
                                "productBuilderConfigs": null
                            };
                            me.controller.saveBuilderConfigV2(data, me);
*/
                        }
                    }
                }
            })
        }
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data);
        }
    },
    getValue: function () {
        var me = this;
        var result = {
            _id: me.builderConfigData ? me.builderConfigData._id : null,
            productConfigViewId: me.productConfigViewId,
            clazz: 'com.qpp.cgp.domain.product.config.v2.builder.BuilderConfigV2'
        };
        for (var i = 0; i < me.items.items.length; i++) {
            var data = me.items.items[i].getValue();
            result = Ext.Object.merge(result, data);
        }
        //把background移到productBuilderConfigs字段中
        if (result.background) {
            result['builderViewResourceConfig'].backgrounds = data.background;
        }
        return result;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.isValid() == false) {
                isValid = false;
                me.setActiveTab(item);
                break;
            }
        }
        return isValid;
    },
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            handler: function (btn) {
                var tab = btn.ownerCt.ownerCt;
                if (tab.isValid()) {
                    tab.controller.saveBuilderConfigV2(tab.getValue(), tab, );
                    console.log(tab.getValue());
                }
            }
        },
    ],
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.controller.Controller');
        var builderViewVersion = JSGetQueryString('builderViewVersion');
        if(Ext.isEmpty(builderViewVersion)){
            builderViewVersion = 'V2';
        }
        me.items = [

            {
                xtype: 'builderconfigform',
                title: i18n.getKey('builderConfig'),
                builderViewVersion: builderViewVersion
            },
            {
                xtype: 'resourceconfigform',
                title: i18n.getKey('产品公用资源')
            },
            {
                xtype: 'background',
                title: i18n.getKey('background'),
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }

})
