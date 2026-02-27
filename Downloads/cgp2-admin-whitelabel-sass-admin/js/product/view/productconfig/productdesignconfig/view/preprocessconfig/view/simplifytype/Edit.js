Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.PreProcessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.SimplifyType',
    'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SimplifySBOMMaterialViewType'
])

Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.Edit', {
    extend: 'Ext.tab.Panel',
    recordId: null,
    createOrEdit: null,
    builderConfigTab: null,
    designId: 0,
    controller: null,

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        var type = JSGetQueryString('type');
        var id = parseInt(JSGetQueryString('id') ?? 0);
        me.designId = parseInt(JSGetQueryString('designId') ?? 0);
        var createOrEdit = id ? 'edit' : 'create';
        var pmvtStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.ProductMaterialViewCfgStore', {
            storeId: 'pmvtStore',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productConfigDesignId',
                    type: 'number',
                    value: me.designId
                }])
            }
        });
        var smvtStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SimplifySBOMMaterialViewTypeStore', {
            storeId: 'smvtStore',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'productConfigDesignId',
                    type: 'number',
                    value: me.designId
                }])
            }
        });

        pmvtStore.load();
        smvtStore.load();
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var editPanel = btn.ownerCt.ownerCt;
                    if (editPanel.isValid()) {
                        var data = editPanel.getValue();
                        if (id) {
                            data['_id'] = id;
                        }
                        controller.saveSimplifyProcess(data, createOrEdit, editPanel);
                    }
                }
            }
        ];
        me.items = [
            Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.' + type, {
                itemId: type,
                title: i18n.getKey(type),
            })
        ]
        me.callParent();
        var editForm = me.getComponent(type);
        me.on('afterrender', function () {
            if (id) {
                CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.SimplifyType.load(id, {
                    success: function (record, operation) {
                        me.refreshData(record.data);
                    }
                });
            }
        })
    },
    isValid: function () {
        var me = this, isValid = true;
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (!item.isValid()) {
                isValid = false;
                break;
            }
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        var items = me.items.items,
            result = {"designId": me.designId};
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            Ext.Object.merge(result, item.getValue());
        }
        return me.setSelectorMappingRelations(result);
    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.setValue(data);
        }
    },
    setSelectorMappingRelations: function (data) {
        var item = data?.selectorMappingRelations[0]
        if (item) {
            if (Ext.isEmpty(item.left)) {
                item.left = Ext.isArray(data.left) ? data.left[0] : data.left;
            }
            if (Ext.isEmpty(item.right)) {
                item.right = Ext.isArray(data.right) ? data.right[0] : data.right;
            }
        }
        return data;
    }
})