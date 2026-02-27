/**
 * Created by nan on 2021/1/6
 */

Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ExtraConfigForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    title: i18n.getKey('extraParams'),
    refreshData: function (MMTDetail, materialMappingDTOConfig) {
        var me = this;
        if (materialMappingDTOConfig && materialMappingDTOConfig.packageQty) {
            me.setValue(materialMappingDTOConfig.packageQty);
        }
    },
    getValue: function () {
        var me = this;
        //渲染才输出其数据
        if (me.hidden == false) {
            var packageQty = me.getComponent('packageQty').getValue();
            if (packageQty) {
                return packageQty;
            } else {
                return null;
            }
        }
    },
    setValue: function (packageQty) {
        var me = this;
        me.getComponent('packageQty').setValue(packageQty);
        console.log('extra');
    },
    // isValid: function () {
    //     return true;
    // },
    defaults: {
        width: 450
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'valueexfield',
                name: 'packageQty',
                allowBlank: true,
                margin: 10,
                itemId: 'packageQty',
                commonPartFieldConfig: {
                    uxTextareaContextData: true,
                    defaultValueConfig: {
                        type: 'Number',
                        typeSetReadOnly: true,
                    }
                },
                listeners: {
                    afterrender: function (field) {
                        var contextData = {};
                        var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
                        for (var i = 0; i < skuAttributeStore.getCount(); i++) {
                            var data = skuAttributeStore.getAt(i).getData();
                            contextData[data.attribute.id] = data.attribute.name + '的值'
                        }
                        field.commonPartFieldConfig.uxTextareaContextData = {
                            context: contextData
                        };
                    }
                },
                fieldLabel: i18n.getKey('每套数量'),
            }
        ];
        me.callParent();
    }
})
