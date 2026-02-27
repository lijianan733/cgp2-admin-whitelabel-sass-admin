Ext.define("CGP.builderbackground.store.ImageType",{
	extend : 'Ext.data.Store',

	fields : ["value","name"],
	constructor : function(config){
		var me = this;

		me.data = [{
					value : "preview", name : i18n.getKey('preview')
				},{
					value : "print", name : i18n.getKey('print')
				}];
		me.callParent(arguments);
	}
	
});