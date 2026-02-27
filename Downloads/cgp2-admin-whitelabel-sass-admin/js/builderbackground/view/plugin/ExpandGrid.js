Ext.define("CGP.builderbackground.view.plugin.ExpandGrid",{
	extend : 'Ext.grid.Panel',
	

	record : null, //backgroundrecord
	
	
	
	style : {
		marginLeft : '10px'
	}, 
	width : 850,
	initComponent : function(){
		var me = this;

		
		me.store = me.createStore();
		me.features = {
			ftype:'groupingsummary',
			groupHeaderTpl: i18n.getKey('applyToFace') + ': {name}'
		},
		me.columns = [{
                text: i18n.getKey('thumbnail'),
                itemId: 'name',
//                tdCls : 'columns_td',
                align : 'center',
                style : {
                	'vertical-align': "middle"
                },
                tdCls : 'columns_td_vcenter',
//                width :200,
                menuDisabled : true,
                renderer: function (value, metadata, record) {
                	var height = 50;
                    var url = imageServer + record.get('name') + '/100/'+height+'/png';
                    return '<img style="height : '+ height +'px" src="' + url + '" />';
                }
			},{
				dataIndex: 'originalFileName',
				menuDisabled : true,
				tdCls : 'columns_td_vcenter',
				text : i18n.getKey('name')
			},{
				dataIndex : 'type',
				menuDisabled : true,
				text: i18n.getKey('type'),
				tdCls : 'columns_td_vcenter',
				renderer : function(value,metadata,record){
					return i18n.getKey(value);
				} 
			},{
				dataIndex : 'format',
				menuDisabled : true,
				tdCls : 'columns_td_vcenter',
				text : i18n.getKey('format')
			},{
				dataIndex : 'width',
				menuDisabled : true,
				tdCls : 'columns_td_vcenter',
				text : i18n.getKey('width')
			},{
				dataIndex : 'height',
				width : 340,
				tdCls : 'columns_td_vcenter',
				menuDisabled : true,
				text : i18n.getKey('height')
			}];
		me.callParent(arguments);
	},
	createStore : function(){
		var me = this,data,faces,record = me.record;
		data = [];
		faces = record.get("backgroundFaces");
		for(var i = 0; i < faces.length; i++){
			var images = faces[i].backgroundImages;
			for(var j = 0 ; j < images.length; j++){
				var copy = function(obj){
					var r = {};
					for(var key in obj){
						r[key] = obj[key];
					}
					return r;
				};
				var obj = copy(images[j]);
				obj.faceType = faces[i].type;
				obj.faceName = faces[i].name;
				data.push(obj);
			}
		}
		return Ext.create("CGP.builderbackground.store.TemporalFace",{
			data : data
		});
	} 
});