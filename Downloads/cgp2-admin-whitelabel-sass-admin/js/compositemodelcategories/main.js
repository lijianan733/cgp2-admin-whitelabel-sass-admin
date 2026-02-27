Ext.onReady(function () {
    // 用于下面的资源

    // 初始化资源


    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('compositeModelCategories'),
        block: 'compositemodelcategories',
        editPage: 'edit.html',
        gridCfg: {
            store: Ext.create('CGP.compositemodelcategories.store.CompositeModelCategories'),
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
                    width: 160,
                    itemId: 'name',
                    sortable: false
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 180,
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
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    id: 'nameSearchField',
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                }
            ]
        }
    });
});