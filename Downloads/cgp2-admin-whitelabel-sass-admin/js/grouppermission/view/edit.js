/**
 * 角色编辑页面
 */
Ext.Loader.setConfig({
	disableCaching : false
});
Ext.Loader.setPath({
	enabled : true,
	"CGP.grouppermission" : path + "js/grouppermission"
});
Ext.Loader.require("CGP.grouppermission.model.PermissionGroup");
Ext.onReady(function(){



	
	var editController = Ext.create("CGP.grouppermission.controller.Edit");
	
	var editPage = Ext.widget({
		block : 'grouppermission',
		xtype : 'uxeditpage',
		gridPage: 'grouppermission.html',
		formCfg : {
			model : 'CGP.grouppermission.model.PermissionGroup',
			remoteCfg : false,
			items : [{
				name:'name',
				xtype:'textfield',
				fieldLabel: i18n.getKey('name'),
				itemId:'name',
				allowBlank:false
			}, {
				name : 'title',
				xtype : 'textfield',
				allowBlank:false,
				fieldLabel : i18n.getKey('title'),
				itemId : 'title'
			},{
				xtype: 'panel',
				itemId: 'checkPanel',
				height: 500,
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				rootVisible: false,
				style: {
					background:'#FFFFFF',
					border: '0px solid ',
					marginTop: '20px',
					marginLeft: '50px'
				},
				
				tbar: [{
					text: '设置权限', handler : function(btn){
						var record = btn.ownerCt.ownerCt.ownerCt.getModel()[0];
						//点击设置权限时。将editPage，和record记录穿 过去，record有可能是空。
						editController.openPermissionWindow(editPage,record);
					}
				}],
				items: [{
					xtype: 'treepanel',
					useArrows: true,
					autoScoll: false,
					disableSelection: true,
					rootVisible: false,
					columns: [{
						text: i18n.getKey('permission'),
						xtype: 'treecolumn',
						width: '98%',
						dataIndex: 'title',
						sortable: false,
						menuDisabled: false,
						resizable: false
					}],
					selModel: {
						mode : 'MULTI'
					},
					flex: 1,
					itemId:'tree',
					style: {
						border: '0px solid ',
						margin: '0px'
					},
					root: {
						
					}
				},{
					xtype: 'treepanel',
					useArrows: true,
					autoScoll: false,
					disableSelection: true,
					rootVisible: false,
					columns: [{
						text: i18n.getKey('permissiongroup'),
						xtype: 'treecolumn',
						width: '98%',
						dataIndex: 'title',
						sortable: false,
						menuDisabled: false,
						resizable: false
					}],
					selModel: {
						mode : 'MULTI'
					},
					flex: 1,
					itemId:'treeGroup',
					style: {
						border: '0px solid ',
						margin: '0px'
					},
					root: {
						
					}
				}]
			},{
				id: 'tree',
                name: 'permissionIds',
                xtype: 'hidden',
                itemId: 'tree',
                listeners: {
                    change: showPermission
                }
			}]
		}
	});
	
	//权限树的check都为空的tree Stroe
	var permissionStoreA = Ext.create("CGP.grouppermission.store.Permission",{
		url:adminPath + 'api/groupPermissions/all?access_token=' + Ext.util.Cookies.get('token'),
		root:{
			id :0,
			title: "Permission"
		},
		proxy :{
					type: 'ajax',
					url: adminPath + 'api/permissions/byrole?access_token=' + Ext.util.Cookies.get('token'),
					reader: 'nestjson'
				},
		autoLoad :false
	});
	
	// 权限组树的checked都为空的tree Store
	var permissionGroupStoreA = Ext.create("CGP.grouppermission.store.Permission",{
		autoLoad: false,
		proxy :{
					
					type: 'ajax',
					url: adminPath + 'api/permissions/group/byrole?access_token=' + Ext.util.Cookies.get('token'),
					reader: 'nestjson'
				}
	});
	

	
	/**
	 * 当uxform是编辑状态时自动对id=tree控件设置值。
	 * 触发下面的方法，加载store,并显示权限树。
	 */
	function showPermission( field, newValue, oldValue){
		var value = editPage.form.getComponent('tree').getValue();
		var array = value.split(',');
		var rootNode = null;
		permissionStoreA.load({
			callback: function(records,nodes,success){
				nodes.node.eachChild(function(child){
					var is = editChild(child , array);
					if(!is){
						child.set('checked',false);
					} else {
						child.set('checked',null);
					}
				});
				rootNode = nodes.node;
				//去除没选中的
				for(var i = rootNode.childNodes.length; i > 0; i--){
					if(rootNode.childNodes[i-1].get('checked') != null){
						rootNode.childNodes[i-1].remove();
					}
					else {
						var node = rootNode.childNodes[i-1];
						for(var j = node.childNodes.length; j > 0; j--){
							if(node.childNodes[j-1].get('checked') != null){
								node.childNodes[j-1].remove();
							}
						}
					}
				}
				var field = editPage.form.getComponent('checkPanel').getComponent('tree');
				field.setRootNode(rootNode);
				field.expandAll();
			}
		});
		var rootNodeGroup = null;
		permissionGroupStoreA.load({
			callback: function(records,nodes,success){
				nodes.node.eachChild(function(child){
					var isCheck = true;
					for(var i = 0; i < array.length; i++){
						if(child.get('id').toString() == array[i]){
								isCheck = false;
						}
					}
					if( isCheck){
						child.set('checked',true);
					} else {
						child.set('checked',null);
					}
				});
				rootNodeGroup = nodes.node;
				//去除没选中的
				for(var i = rootNodeGroup.childNodes.length; i > 0; i--){
					if(rootNodeGroup.childNodes[i-1].get('checked') != null){
						rootNodeGroup.childNodes[i-1].remove();
					}
					else {
						var node = rootNodeGroup.childNodes[i-1];
						for(var j = node.childNodes.length; j > 0; j--){
							if(node.childNodes[j-1].get('checked') != null){
								node.childNodes[j-1].remove();
							}
						}
					}
				}
				var field = editPage.form.getComponent('checkPanel').getComponent('treeGroup');
				field.setRootNode(rootNodeGroup);
				field.expandAll();
			}
		});
		
	}
	
	/**
	 * 根据array包含grouppermissionid和Permissionid数组设置节点是否为checked
	 */
	function editChild(child, array){
		var isCheck = false;
		child.eachChild(function(child){
			var isRight = false;
			for(var i = 0; i < array.length; i++){
				if(child.get('id').toString() == array[i]){
					isRight = true;
					isCheck = true;
					child.set('checked',null);
				}
			}
			if(!isRight){
				child.set('checked',false);
			}
		});
		return isCheck ;
	}
});