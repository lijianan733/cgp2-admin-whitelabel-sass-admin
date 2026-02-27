/**
 * Created by nan on 2020/1/2.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.view.EditPmvt', {
    extend: 'Ext.tab.Panel',
    schemaVersion: '4',//配置版本'4,'5'
    editOrNew: null,
    recordId: null,
    productId: null,
    productConfigDesignId: null,
    productBomConfigId: null,
    data: null,
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
        var baseInfo = null;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('pmvt');
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.salematerialbommvtmanage.controller.Controller');
        baseInfo = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.BaseInfoForBomV5', {
            record: me.record,
            editOrNew: me.editOrNew,
            productId: me.productId,
            hideChangeMaterialPath: true,
            materialPath: me.materialPath,
            bomVersion: me.schemaVersion,
            productConfigDesignId: me.productConfigDesignId,
            productBomConfigId: me.productBomConfigId
        });
        var pageContentConfig = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.PageContentConfig');
        me.tbar = [{
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            handler: function (btn) {
                var tabPanel = btn.ownerCt.ownerCt;
                var data = tabPanel.data || {};
                if (tabPanel.isValid()) {
                    for (var i = 0; i < tabPanel.items.items.length; i++) {
                        var item = tabPanel.items.items[i];
                        data = Ext.Object.merge(data, item.getValue());
                    }
                    if (Ext.isEmpty(tabPanel.data)) {
                        me.controller.addProductMaterialViewType(data, me, me.store)
                    } else {
                        data._id = tabPanel.data._id;
                        me.controller.updateProductMaterialViewType(data, me, me.store);
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
