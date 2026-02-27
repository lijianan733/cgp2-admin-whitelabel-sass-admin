
Ext.Loader.syncRequire('CGP.compositemodelcategories.model.CompositeModelCategories');
Ext.onReady(function () {


    var page = Ext.widget({
        block: 'compositemodelcategories',
        xtype: 'uxeditpage',
        gridPage: 'main.html',
        formCfg: {
            model: 'CGP.compositemodelcategories.model.CompositeModelCategories',
            remoteCfg: false,
            columnCount: 1,
            items: [{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            },{
                name: 'description',
                xtype: 'textarea',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }
            ]
        }
    });
});