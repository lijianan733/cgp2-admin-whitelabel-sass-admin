
Ext.Loader.syncRequire('CGP.productcompositemodels.model.ProductCompositeModels');
Ext.onReady(function () {


    var store = Ext.create('CGP.productcompositemodels.store.CompositeModelCategories');
    var page = Ext.widget({
        block: 'productcompositemodels',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.productcompositemodels.model.ProductCompositeModels',
            remoteCfg: false,
            columnCount: 1,
            items: [{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            },
              {
                name: 'code',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('code'),
                itemId: 'code'
            },{
                    name: 'categoryId',
                    xtype: 'combo',
                    store: Ext.create('CGP.compositemodelcategories.store.CompositeModelCategories'),
                    displayField: 'name',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('compositeModelCategories'),
                    itemId: 'categoryId'
                }
            ]
        }
    });
});