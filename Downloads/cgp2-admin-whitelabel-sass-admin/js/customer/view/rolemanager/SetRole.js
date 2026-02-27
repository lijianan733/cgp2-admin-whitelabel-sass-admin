Ext.define("CGP.customer.view.rolemanager.SetRole",{
	extend : 'Ext.window.Window',
	alias : 'widget.setrole',
	mixins : ["Ext.ux.util.ResourceInit"],
	requires : ["CGP.customer.store.RoleStore"],
	
	record : null, //一条用户记录
	controller : null, //roleManager控制层
	array : [], // role的object 数组    
	store : null, //储存一个用户当前有的角色
	

	
    modal : true,
    closeAction: 'hide',
    draggable: true,
    resizable: false,
    shadow: true,
    
    constructor : function(config){
    	var me  = this;


    	config = Ext.merge({
    		title :  i18n.getKey('setRole'),
    		bbar: ["->",{
			  	xtype: 'button',
			  	itemId: 'btnSave',
                iconCls: 'icon_save',
			  	text: i18n.getKey('save'),
			  	width :80,
			  	handler : function(button){
			  		me.controller.saveRole();
			  	}
			},{
				xtype : 'button',
				text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
				width :80,
				handler : function(){
					me.close();
				}
			}]
    	},config);
    	me.callParent(arguments);
    },
    
    initComponent : function(){
    	var me = this;
    	me.callParent(arguments);
    	
    	me.store.each(function(record){ //用store中的数据初始化me.array
    		Ext.Array.push(me.array,record.data);
    	});
    	
    	var allRoleStore = Ext.create('CGP.customer.store.AllRoleStore');
    	
    	me.grid = Ext.create("Ext.grid.Panel",{
					height : 400,
					autoScroll : true,
					width : 470,
				    store: allRoleStore,
                    selModel: new Ext.selection.CheckboxModel({
                        checkOnly: true
                    }),
				    columns: [{
                        text: i18n.getKey('name'),
                        width: 210,
                        dataIndex: 'name'
         			}, {
                        text: i18n.getKey('description'),
                        width :210,
                        dataIndex: 'description'
         			}],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: allRoleStore,
                        displayInfo: true,
                        //displayMsg: 'Displaying {0} - {1} of {2}',
                        emptyMsg: i18n.getKey('noData'),
                        listeners : {
                        	change : function(toolbar, pageData,  eOpts){
                        		me.pageBarChange();
                        	}
                        }
                    }),
                    listeners : {
                    	deselect : function(RowModel, record, index){
                    		me.desselect(RowModel, record, index);
                    	},
						select : function(RowModel, record, index){
							me.selectClass(RowModel, record, index);
						},
			    		afterrender : function(){
			    			me.pageBarChange(null,null,null);
			    		}
					}
    	});
    	
    	me.add(me.grid);
    },
    
    refresh : function(record,store){
    	var me = this;
    	var selectModel = me.grid.getSelectionModel();
    	selectModel.deselectAll(false);
    	me.record = record;
    	me.store = store;
    	me.store.each(function(record){ //用store中的数据初始化me.array
    		Ext.Array.push(me.array,record.data);
    	});
    	me.grid.store.loadPage(1,{
    		callback : function(){
    			me.pageBarChange();
    		}
    	});
    },
    
    // pageToolBar 页改变之后执行    
    pageBarChange : function(){
    	var me = this;
    	var array = me.array;
    	var selectModel = me.grid.getSelectionModel();
		for (var i = 0; i < array.length; i++) {
			var selectClassModel = me.grid.store.getById(array[i].id);
			if (selectClassModel != null) {
				selectModel.select(selectClassModel, true);
			}
		}
    },
    desselect : function(RowModel, record, index) {
    	var me = this;
		for (var i = 0; i < me.array.length; i++) {
			if (record.data.id == me.array[i].id) {
				Ext.Array.remove(me.array, me.array[i]);
			}
		}
	},
    
	selectClass : function(RowModel, record, index) {
		var me = this;
		var isExist = 0;
		for (var i = 0; i < me.array.length; i++) {
			if (record.data.id == me.array[i].id) {
				isExist = 1;
			}
		}
		if (isExist == 0) {
			Ext.Array.push(me.array, record.data);
		}
	}
    
});