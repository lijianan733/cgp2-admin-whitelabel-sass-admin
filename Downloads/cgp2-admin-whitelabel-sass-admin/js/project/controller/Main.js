Ext.define("CGP.project.controller.Main",{
	

	
	constructor : function(config){
		var me = this;

		me.callParent(arguments);
	},
	
	preview : function(productInstanceId){
		var me = this;
		if(!productInstanceId)
			return;
        Ext.Ajax.request({
            url : adminPath+'api/builder/productInstances/'+productInstanceId+'/manufacturePreviewUrl?context=PC',
            method : 'GET',
            headers : {
                Authorization: 'Bearer '+ Ext.util.Cookies.get('token')
            },
            success : function(response,options){
                var resp = Ext.JSON.decode(response.responseText);
                if(resp.success){
                    var html = ('<iframe style="border:none;" src="' + resp.data + '" width="100%" height="100%"></iframe');
                    var win = Ext.create("Ext.window.Window",{
                        title : i18n.getKey('preview'),
                        modal: true,
                        width: 700,
                        height: 500,
                        html: html
                    });
                    win.show();
                }else{
                    Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure')+resp.data.message)
                }
            },
            failure : function(response,options){
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('saveFailure') + object.data.message);
            }
        });

	}
	
});