/**
 * Created by nan on 2019/1/15.
 *双向属性关系绑定，即a,b 因素可以推导出c,d;
 * c，d可以推导出a,b
 */
Ext.onReady(function () {
    var productId = JSGetQueryString('productId');
    var productAttributeData = [];
    var controller = Ext.create('CGP.product.view.bothwayattributemapping.controller.Controller');
//    productAttributeData=controller.getProductAttribute(productId);
    var profileStore = Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore', {
        storeId: 'profileStore',//创建一个profileStore用于其他位置引用
        params: {
            filter: Ext.JSON.encode([{
                name: 'productId',
                type: 'number',
                value: productId
            }])
        }
    });
    Ext.Ajax.request({
        url: encodeURI(adminPath + 'api/products/configurable/' + productId + '/skuAttributes'),
        method: 'GET',
        async: false,
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        success: function (response) {
            var resp = Ext.JSON.decode(response.responseText);
            if (resp.success) {
                productAttributeData=resp.data;
            }
        }
    });
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: []
    });
    var nullContainer = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: {
            type: 'fit'
        }
    });

    var tabPanel = Ext.create('Ext.tab.Panel', {
        header: false,
        layout:'fit',
        productId: productId
    });
//    var editItemTabPanel = Ext.create('CGP.product.view.bothwayattributemapping.view.EditItemTabPanel', {
//        title: i18n.getKey('create') + i18n.getKey('mappingRelation'),
//        itemId: 'editItemTabPanel',
//        recordData: null,
//        itemsGridStore: null,
//        skuAttributes: productAttributeData,
//        outTab: tabPanel,
//        productId: productId
//    });
    var leftNavigateGrid = Ext.create('CGP.product.view.bothwayattributemapping.view.LeftNavigateGrid', {
        outTab: tabPanel,
        skuAttributes: productAttributeData,
        productId: productId
    });
    nullContainer.add(tabPanel);
    //tabPanel.add([editItemTabPanel])
    page.add([
        leftNavigateGrid, nullContainer
    ]);
});