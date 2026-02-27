Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'CGP.replenishment',

    appFolder: 'app',
    controllers: [
        'Replenishment'
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                xtype: 'replenishment',
                region: 'center'
            }]

        })
    }
});