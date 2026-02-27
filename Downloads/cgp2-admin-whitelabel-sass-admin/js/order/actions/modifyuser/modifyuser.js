Ext.Loader.setPath({
	enabled  : true,
	'CGP.order' : path +'js/order'
});
Ext.Loader.setPath({
	"CGP.customer" : path +'js/customer'
});
Ext.onReady(function(){
	Ext.create("Ext.container.Viewport",{
		layout : 'border',
		items : [Ext.create("CGP.order.actions.modifyuser.view.ModifyUser",{
			region: 'center'
		})]
	});
});
