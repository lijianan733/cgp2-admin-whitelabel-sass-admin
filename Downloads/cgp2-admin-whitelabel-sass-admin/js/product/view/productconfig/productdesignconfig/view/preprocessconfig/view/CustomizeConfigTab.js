/**
 * Created by nan on 2021/1/14
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.BaseInfoForm',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.ConditionMappingConfigGird',
    'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.store.SourceConfigStore',
    'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SourceConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.PreProcessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.EditConditionMappingConfigWin'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.CustomizeConfigTab', {
    extend: 'Ext.tab.Panel',
    recordId: null,
    createOrEdit: null,
    builderConfigTab: null,
    designId: null,
    controller: null,
    listeners: {
        afterrender: function () {
            var me = this;
            var recordId = me.recordId;
            var tab = this;
            if (!Ext.isEmpty(recordId)) {
                CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.PreProcessConfigModel.load(recordId, {
                    scope: this,
                    success: function (record, operation) {
                        var data = record.getData();
                        var baseInfoForm = tab.getComponent('baseInfoForm');
                        var conditionMappingConfigGird = tab.getComponent('conditionMappingConfigGird');
                        baseInfoForm.setValue(data);
                        conditionMappingConfigGird.setValue(data.conditionMappingConfigs);
                    },
                    failure: function () {
                    },
                    callback: function () {
                    }
                })
            }
        }
    },
    setValue: function () {
    },

    initComponent: function () {
        var me = this;
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var tab = btn.ownerCt.ownerCt;
                    var baseInfoForm = tab.getComponent('baseInfoForm');
                    var conditionMappingConfigGird = tab.getComponent('conditionMappingConfigGird');
                    var data = {};
                    if (baseInfoForm.isValid() && conditionMappingConfigGird.isValid()) {
                        data = Ext.Object.merge(data, baseInfoForm.getValue());
                        data = Ext.Object.merge(data, conditionMappingConfigGird.getValue());
                        tab.controller.savePreProcessConfig(data, tab.createOrEdit, tab);
                    }
                }
            }
        ];
        me.items = [
            {
                xtype: 'baseinfoform',
                itemId: 'baseInfoForm',
                designId: me.designId,
            },
            {
                xtype: 'conditionmappingconfiggird',
                itemId: 'conditionMappingConfigGird',
                designId: me.designId
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