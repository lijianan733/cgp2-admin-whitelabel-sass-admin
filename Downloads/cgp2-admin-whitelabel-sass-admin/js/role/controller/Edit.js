Ext.define("CGP.role.controller.Edit",{
	
	mixins : ['Ext.ux.util.ResourceInit'],
	requires : ["CGP.role.view.permission.Window"],
	

	constructor :function(){
		var me = this;

		me.callParent(arguments);
	},
	
	permissionWindow : null,//编辑permission的window
	editPage : null,//编辑页
	/**
	 * 
	 * @param {} editPage编辑页面
	 * @param {} record编辑状态时，对应的model数据
	 */
	openPermissionWindow : function(editPage,record){
		var me =this;
		me.editPage = editPage;
		var title = i18n.getKey('setPermission');
		if(!Ext.isEmpty(record)){
			title = title +":"+record.get('description');
		}
		me.permissionWindow = Ext.create("CGP.role.view.permission.Window",{
			title : i18n.getKey('setPermission')+":"+record.get('description'),
			record : record,
			controller : me,
			saveButtonFun : me.savePermission 
		});
		me.permissionWindow.show();
	},
	
	
	/**
	 * 点击window的save按钮时，把window的值设置到editPage页面的控件中
	 */
	savePermission : function(){
		var me = this;
		var permissions = [], window = me.permissionWindow;
		permissions = window.permissionTree.getArrayValue();
		permissions = permissions.concat(window.groupTree.getArrayValue());
		
		var permissionField = me.editPage.form.getComponent("tree");
		permissionField.setValue(permissions.toString());
		window.close( );
	}
});