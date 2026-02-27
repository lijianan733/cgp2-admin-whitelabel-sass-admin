/**
 * Created by nan on 2020/1/2.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.EditTab', {
    extend: 'Ext.tab.Panel',
    schemaVersion: '4',//配置版本'4,'5'
    editOrNew: null,
    recordId: null,
    productId: null,
    productConfigDesignId: null,
    productBomConfigId: null,
    data: null,
    sbomNode: null,
    getValue: function () {
        var me = this;
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.setValue(data);
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.isValid() == false) {
                isValid = false;
                break;
            }
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.controller.Controller');
        me.simplifySBOMMaterialViewTypeStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: '_id',
                    type: 'string'
                }, {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType'
                }
            ],
            data: me.controller.getSMVTOfSBom(me.simplifyBomConfig._id) || [],
            proxy: {
                type: 'memory'
            }
        });
        var baseInfo = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.BaseInfo', {
            productBomConfigId: me.productBomConfigId,
            productConfigDesignId: me.productConfigDesignId,
            editOrNew: me.editOrNew,
            sbomNode: me.sbomNode,
            simplifyBomConfig: me.simplifyBomConfig
        });
        var pageContentConfig = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.PageContentConfig');
        me.tbar = [{
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            handler: function (btn) {
                var me = btn.ownerCt.ownerCt;
                var tabPanel = btn.ownerCt.ownerCt;
                var data = me.data || {};
                if (tabPanel.isValid()) {
                    for (var i = 0; i < tabPanel.items.items.length; i++) {
                        var item = tabPanel.items.items[i];
                        data = Ext.Object.merge(data, item.getValue());
                    }
                    if (Ext.isEmpty(tabPanel.data)) {
                        me.controller.newSMVT(data, me.sbomNode, me.simplifyBomConfig, me.productConfigDesignId, me)
                    } else {
                        data._id = tabPanel.data._id;
                        me.controller.updataSMVT(data);
                    }

                }
            }
        }];
        me.items = [baseInfo, pageContentConfig];
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
