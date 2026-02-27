Ext.onReady(function () {

    new Ext.container.Viewport({
        layout: 'border',
        items: [Ext.create('CGP.order.actions.invoice.view.Invoice', {
            region: 'center'
        })]
    });

});