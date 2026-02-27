/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributePanel", {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    border: false,
    refreshData: function (MMTDetail, materialMappingDTOConfig) {
        var me = this;
        me.setTitle(i18n.getKey('material') + '(' + MMTDetail._id + ')' + i18n.getKey('attribute') + i18n.getKey('mapping') + i18n.getKey('config'));
        var spuAttributeTree = me.getComponent('spuAttributeTree');
        var spuAttributeMappingGrid = me.getComponent('spuAttributeMappingGrid');
        spuAttributeTree.refreshData(MMTDetail, materialMappingDTOConfig);
        spuAttributeMappingGrid.refreshData();
    },
    getValue: function () {
        var me = this;
        return me.getComponent('spuAttributeTree').getValue();
    },
    setValue: function () {

    },
    isValid: function () {
        return true;
    },
    initComponent: function () {
        var me = this;
        var spuAttributeTree = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributeLeftTree', {
            region: 'west',
            itemId: 'spuAttributeTree',
            width: 300

        });
        var spuAttributeMappingGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributeMappingCenterGrid', {
            region: 'center',
            itemId: 'spuAttributeMappingGrid'
        });
        me.items = [spuAttributeTree, spuAttributeMappingGrid];
        me.callParent();
    }
})
