Ext.define("CGP.customer.view.rolemanager.ShowRole",{
	extend : 'Ext.grid.Panel',
	alias : 'widget.showrole',
	mixins : ["Ext.ux.util.ResourceInit"],
	requires : ["CGP.customer.store.RoleStore"],
	

	
	record : null,//用户信息
	controller : null, //roleController
	
    
    width: '100%',
    store: null,
    
    modal : true,
    constructor : function(config){
    	var me = this;


    	me.store = Ext.create('CGP.customer.store.RoleStore',{
    		userId : config.record.get('id')
    	});
    	config = Ext.merge({
    		store : me.store,
    		tbar : [{
    			text : i18n.getKey('setRole'),
    			handler : function(button){
    				me.controller.openSetRoleWindow(me.record,me.store);
    			}
    		}],
    		columns: [{
        		width: 60,
        		xtype: 'actioncolumn',
        		items: [{
        			icon: path+'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
           			tooltip: i18n.getKey('destroy'),
            		handler: function (grid, rowIndex, colIndex) {
                  		me.controller.deleteRole(grid, rowIndex, colIndex);
            		}
      			}]
    		}, {
                        text: i18n.getKey('name'),
                        width: 150,
                        dataIndex: 'name',
                        sortable: true
    		}, {
                        text: i18n.getKey('description'),
                        width: 130,
                        dataIndex: 'description',
                        sortable: true
    		}]
    	},config);
    	me.callParent(arguments);
    },
    refresh : function(record){
    	var me = this;
    	me.record = record;
    	me.store.resetUrl(record.get('id'));
    	me.store.load();
    }
    
	
});