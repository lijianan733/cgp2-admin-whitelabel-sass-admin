Ext.onReady(function () {
    var navigationId = JSGetQueryString('navigationId');
    var productViewConfigId = JSGetQueryString('productViewConfigId');
    var haveRootNode = JSGetQueryString('haveRootNode');
    var productId = JSGetQueryString('productId');
    var contentData = JSBuildProductContentData(productId);
    //添加一个名为index的属性,该属性代表该导航项的位置
    contentData.push({
        key: 'index',
        type: 'notSkuAttribute',
        valueType: 'Number',
        selectType: 'NON',
        attrOptions: [],
        required: true,
        displayName: 'index',
        path: 'args.context',//该属性在上下文中的路径
        attributeInfo: {}
    });
    Ext.create('CGP.common.condition.store.ContentAttributeStore', {
        storeId: 'contentAttributeStore',
        data: contentData
    });
    var treePanel = Ext.create("CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.NavigationTree", {
        navigationId: navigationId,
        productViewConfigId: productViewConfigId,
        haveRootNode: haveRootNode
    });
    var infoTab = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.InfoForm', {
        productViewConfigId: productViewConfigId,
        navigationId: navigationId,
        title: i18n.getKey('detail')
    });
    var skuAttributesStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
        storeId: 'skuAttributeStore',
        autoLoad: true,
        aimUrlId: productId
    });
    var skuAttributesStore2 = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
        storeId: 'skuAttributeStore2',
        autoLoad: true,
        aimUrlId: productId
    });
    Ext.create('Ext.container.Viewport', {
        title: i18n.getKey("navigation") + i18n.getKey('config'),
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [treePanel, infoTab]
    })
});