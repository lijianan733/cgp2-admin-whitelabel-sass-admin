/**
 * Created by nan on 2020/1/2.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.EditSmvt', {
    extend: 'Ext.tab.Panel',
    schemaVersion: '4',//配置版本'4,'5'
    editOrNew: null,
    recordId: null,
    productId: null,
    productConfigDesignId: null,
    productBomConfigId: null,
    data: null,
    sbomNode: null,
    simplifySBOMMaterialViewTypeStore: null,
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
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('smvt');
        var infoPanel = me.topTab.getComponent('infoPanel');
        var materialPath = infoPanel.getMaterialPath();
        me.simplifySBOMMaterialViewTypeStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.store.SimplifySBOMMaterialViewType');
        var baseInfo = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.BaseInfo', {
            productBomConfigId: me.productBomConfigId,
            materialPath: materialPath,
            productConfigDesignId: me.productConfigDesignId,
            sbomNode: me.sbomNode,
            editOrNew: me.editOrNew
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
                        me.controller.addSMVT(data, me.store, me.sbomNode, me.simplifyBomConfigId, me);
                    } else {
                        data._id = tabPanel.data._id;
                        me.controller.updataSMVT(data, me.store);
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
