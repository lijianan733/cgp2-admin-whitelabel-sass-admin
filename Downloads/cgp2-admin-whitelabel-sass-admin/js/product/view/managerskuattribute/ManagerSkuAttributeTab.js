Ext.onReady(function () {
    var controller = Ext.create('CGP.product.view.managerskuattribute.controller.Controller');
    var id = JSGetQueryString('id');
    var activeTab = JSGetQueryString('activeTab');
    var isSpecialSku = JSGetQueryString('isSpecialSku') == 'true';//是否为人为创建的sku产品
    var isProductSku = JSGetQueryString('isSku') == 'true';  //是否为sku类型
    var tab = Ext.create('Ext.tab.Panel', {
        region: 'center',
        items: [],
        listeners: {
            tabchange: function (comp, newtab, oldtab) {
                if (newtab.itemId == 'skuProductGrid') {
                    newtab.getStore().load();
                }
            }
        }
    });
    controller.id = id;
    controller.tab = tab;
    var skuAttributeGrid = Ext.create('CGP.product.view.managerskuattribute.view.SkuAttributeGrid', {
        gridId: 'skuAttributeGrid',
        aimUrlId: id,
        isSku: true,
        productId: id,
        isSpecialSku: isSpecialSku,
        controller: controller,
        tab: tab,
        isProductSku: isProductSku
    });
    var skuProductsGrid = Ext.create('CGP.product.edit.component.skuproducts.SkuProductPanel', {
        isSpecialSku: isSpecialSku,
    });
    /*  var productColumns = controller.addProductColumns({
          skuAttributeGrid: skuAttributeGrid,
          productId: id,
          tab: tab,
          activeTab: parseInt(activeTab)
      })*/
    tab.add(skuAttributeGrid);
    tab.add(skuProductsGrid);
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [tab]
    });
    tab.setActiveTab(tab.items.items[0]);


});
