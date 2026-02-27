Ext.onReady(function () {
    new Ext.container.Viewport({
        layout: 'border',
        items: [
        Ext.create('CGP.order.actions.address.view.Address', {
                region: 'center'
            })
        ]
    });
})