/**
 * Created by nan on 2020/3/26.
 * 产品物料映射，
 * 1.该产品对应的bom配置对应的物料中，其bom结构要使其完整，即数量范围和其可选件，待定件生成规格配置
 * 2.其对应的spu属性也需要配置完整，即smt节点需要处理
 * 3.MMTId为该design配置关联的bom配置中最新的一个
 */
Ext.Loader.syncRequire([
    'CGP.product.view.managerskuattribute.model.SkuAttributeGridModel',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionGrid',
    'CGP.material.model.BomItem',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemQtyConfigGridField',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemMaterialPredicatesGridField',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemMappingIndexRulesGridField',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemMappingsGridField',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionFieldContainer'
]);
Ext.onReady(function () {
    var productId = JSGetQueryString('productId') ;
    var productConfigDesignId = JSGetQueryString('productConfigDesignId') ;
    var configType = JSGetQueryString('configType') ;
    var MMTId = JSGetQueryString('MMTId');
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
    var materialDetail = controller.getSMTDetail(MMTId);
    var skuAttributesStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
        storeId: 'skuAttributeStore',
        autoLoad: true,
        aimUrlId: productId
    });

    window.controller = controller;
    var leftBomTree = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.LeftBomTree', {
        MMTDetail: materialDetail,
        configType: configType,
        productConfigDesignId: productConfigDesignId,
        itemId: 'lefBomTree',
    });

    var OutCenterPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.OutCenterPanel', {
        itemId: 'outCenterPanel',
        productConfigDesignId: productConfigDesignId,
        configType: configType,
        MMTDetail: materialDetail,
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border',

    });
    page.add([leftBomTree, OutCenterPanel]);
})
