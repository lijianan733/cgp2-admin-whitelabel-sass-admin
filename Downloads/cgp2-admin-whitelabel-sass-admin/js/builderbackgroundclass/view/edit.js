Ext.Loader.setPath({
	enabled : true,
	"CGP.builderbackgroundclass": path + 'js/builderbackgroundclass'
});
Ext.Loader.syncRequire("CGP.builderbackgroundclass.model.BuilderBackgroundClass");

Ext.onReady(function(){


	
	var editPage = Ext.widget({
        block: 'builderbackgroundclass',
        xtype: 'uxeditpage',
        gridPage: 'builderbackgroundclass.html',
        formCfg: {
            model: 'CGP.builderbackgroundclass.model.BuilderBackgroundClass',
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
   			}, {
                name: 'sortOrder',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('sortOrder'),
                allowBlank : false,
                itemId: 'sortOrder',
                value :2,
                allowExponential :false,
                allowDecimals : false
   			}]
        }
    });
});