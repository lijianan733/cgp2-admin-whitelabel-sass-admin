Ext.define("CGP.product.edit.component.skuproducts.BatchCreateWin",{
    extend: "Ext.window.Window",

    layout: {
        type: 'vbox'
    },
    defaults: {
        flex: 1
    },
    padding: '10px',
    border: false,
    width: 800,
    height: 600,
    modal: true,
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('batchCreate');
        var optionTypes = Ext.create("CGP.product.edit.component.skuproducts.OptionTypes",{
            skuAttributeIds: me.skuAttributeIds,
            sku: me.sku,
            window: me,
            attributes: me.attributes,
            skuProductStore: me.skuProductStore,
            configurableProductId: me.configurableProductId
        });
        var optionForm = Ext.create("CGP.product.edit.component.skuproducts.Options",{
            optionTypes: optionTypes,
            data: me.data,
            skuProductStore: me.skuProductStore,
            existTypes: me.existTypes,
            skuAttributeIds: me.skuAttributeIds,
            attributes: me.attributes
        })


        me.items = [optionForm, optionTypes];
        me.callParent(arguments);

    }
})