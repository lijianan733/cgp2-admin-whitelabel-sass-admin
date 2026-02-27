Ext.Loader.setConfig({
    disableCaching: false
});
Ext.application({
    requires: ['Ext.container.Viewport', 'CGP.productcategory.config.Config'],
    name: 'CGP.productcategory',

    appFolder: 'app',
    controllers: [
        'ProductCategory',
        'Information'
    ],

    launch: function () {

        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            defaults: {
                split: true,
                hideCollapseTool: true
            },
            items: [
                {
                    xtype: 'productcategorytree',
                    isMain: false,
                    website: CGP.productcategory.config.Config.website,
                    region: 'west',
                    width: 350,
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true,
                        plugins: {
                            ptype: 'treeviewdragdrop',
                            enableDrag: true,
                            enableDrop: true
                        }
                    }
                },
                {
                    xtype: 'productcategoryinfo',
                    region: 'center',
                    isMain: false
                }
            ]
        })

    }
});
