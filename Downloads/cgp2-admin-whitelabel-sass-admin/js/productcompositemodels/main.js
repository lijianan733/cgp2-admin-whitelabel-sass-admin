Ext.onReady(function () {
    // 用于下面的资源

    // 初始化资源


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('productCompositeModels'),
        block: 'productcompositemodels',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.create('CGP.productcompositemodels.store.ProductCompositeModels'),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    xtype: 'gridcolumn',
                    width: 360,
                    itemId: 'name',
                    sortable: false
                },
                {
                    text: i18n.getKey('compositeModelCategories'),
                    dataIndex: 'categoryName',
                    xtype: 'gridcolumn',
                    width: 160,
                    itemId: 'categoryName',
                    sortable: false
                },
                {
                    text: i18n.getKey('code'),
                    dataIndex: 'code',
                    width: 160,
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    sortable: false
                }
            ]
        },
        // 搜索框
        filterCfg: {
            items: [
                {
                    id: 'idSearchField',
                    name: 'id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },{
                    id: 'code',
                    name: 'code',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('code'),
                    itemId: 'code'
                },{
                    name: 'category.id',
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