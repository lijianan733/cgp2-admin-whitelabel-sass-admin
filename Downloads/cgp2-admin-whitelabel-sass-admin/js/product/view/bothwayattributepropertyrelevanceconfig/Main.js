/**
 * Created by nan on 2019/1/15.
 *双向属性关系绑定，即a,b 因素可以推导出c,d;
 * c，d可以推导出a,b
 */
Ext.onReady(function () {
    var productId = JSGetQueryString('productId');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: []
    });
    var nullContainer = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: {
            type: 'fit'
        }
    })
    var tabPanel = Ext.create('Ext.tab.Panel', {
        header: false,
        hidden: true,
        productId: productId
    });
    var leftNavigateGrid = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.LeftNavigateGrid', {
        rightTabPanel: tabPanel,
        productId: productId
    });
    var leftAttributeTreePanel = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.ItemsGrid', {
        title: i18n.getKey('mappingRelation') + i18n.getKey('manager'),
        outTab: tabPanel
    });
    nullContainer.add(tabPanel);
    tabPanel.add([leftAttributeTreePanel])
    page.add([leftNavigateGrid, nullContainer]);
});