Ext.define("CGP.order.actions.modifyuser.view.UserSearchField",{
	extend : 'Ext.form.FieldContainer',
	requires : ["CGP.common.commoncomp.QueryGrid"],
	alias : 'widget.usersearchfield',
	
	layout: 'fit',
	msgTarget : 'side',
	filterCfg : null,
	gridCfg : null,
	
	initComponent : function(){
		var me = this;
		me.items = [{
			xtype : 'searchcontainer',
			filterCfg : me.filterCfg,
			gridCfg : me.gridCfg
		}];
//		me.items =[{
//			xtype : 'textfield'
//		}];
		me.callParent();
		
	}
	
});