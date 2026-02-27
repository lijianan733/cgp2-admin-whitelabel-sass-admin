Ext.define("CGP.promotionrule.view.product.CategoryTree", {
	extend : 'Ext.tree.Panel',

	store :null,
	width : 300,
	height : 150,
	rootVisible : false,
	minHeight : 300,
	useArrows : true,
	autoScroll : true,
	displayField : 'name',
	root : null,
	hideHeaders : true,
	websiteId : null,
	columns : [{
				xtype : 'treecolumn',
				width : "100%",
				sortable : true,
				dataIndex : "name"
	}],
	
	constructor : function(config){
		var me = this,url;
		me.addEvents("initNode");
		me.callParent(arguments);
		
		if(me.websiteId == null){
			url = adminPath + "api/admin/productCategory/tree/0";
		}else{
			url = adminPath + "api/admin/productCategory/tree/-" + me.websiteId;
		}
		Ext.Ajax.request({
			url : url,
			params : {
				isMain : true
			},
			headers : {
				Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
			},
			method : 'GET',
			success : function(response,option){
				var root = Ext.decode(response.responseText).data;
				me.fireEvent("initNode",me,root,Ext.decode(response.responseText).success);
				var treeStore = Ext.create("Ext.data.TreeStore",{
					fields : [{name : 'id',type : 'int'},"name"],
					root : root
				});
				me.setRootNode(treeStore.getRootNode());
				
			}
		});
	}
	});