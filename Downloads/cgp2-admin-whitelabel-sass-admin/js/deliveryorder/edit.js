Ext.onReady(function () {
    var controller = Ext.create('CGP.deliveryorder.controller.Controller');
    
    window.controller = controller;
    
    var page = new Ext.container.Viewport({
        layout: 'border',
        items: [
            Ext.create('CGP.deliveryorder.view.Status', {
                orderId: controller.id
            })
        ]
    });

    controller.loadOrderDetail(page);

});