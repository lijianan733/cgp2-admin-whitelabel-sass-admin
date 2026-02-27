/**
 * website 的编辑界面
 */
Ext.onReady(function(){


	
	var store = Ext.data.StoreManager.lookup('websiteStore');
	var page = Ext.widget({
		block : 'website',
		xtype : 'uxeditpage',
		gridPage: 'website.html',
		formCfg : {
			model : 'CGP.model.Website',
			remoteCfg : false,
			items : [{
				name:'name',
				xtype:'textfield',
				fieldLabel: i18n.getKey('name'),
				itemId:'name',
				allowBlank:false
			}, {
				name : 'code',
				xtype : 'textfield',
				allowBlank:false,
				fieldLabel : i18n.getKey('code'),
				itemId : 'code'
			}, {
				name : 'url',
				xtype : 'textfield',
				fieldLabel : i18n.getKey('url'),
				allowBlank:false,
				itemId : 'url'
			} ]
		},
		listeners : {}
	});
});