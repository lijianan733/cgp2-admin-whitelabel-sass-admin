Ext.application({
    reqhires: ['Ext.container.Viewport'],
    name: 'CGP.orderreprint',

    appFolder: 'app',
    controllers: [
        'OrderReprint'
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                xtype: 'reprintapply',
                region: 'center'
            }]

        })
    }
});