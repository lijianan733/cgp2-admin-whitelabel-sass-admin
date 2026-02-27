Ext.onReady(function(){


	
	var editPage = Ext.widget({
        block: 'builderbackgroundclass',
        xtype: 'uxeditpage',
        gridPage: 'builderbackgroundclass.html',
        formCfg: {
            model: 'CGP.model.BuilderBackgroundClass',
            remoteCfg: false,
            items: [{
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
   			}, {
                name: 'description',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
   			}]
        },
        listeners: {}
    });
});
