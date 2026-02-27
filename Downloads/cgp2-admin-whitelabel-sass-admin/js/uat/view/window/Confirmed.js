Ext.define("CGP.uat.view.window.Confirmed",{
	extend : 'Ext.window.Window',
	mixins : ["Ext.ux.util.ResourceInit"],
	requires : ["CGP.uat.model.UAT"],
	

	
	record : null, //一条UAT数据
	contorller :null,// MainController
	
	width : 500,
	height : 400,
	resizable: false,
	modal : true,
	layout : 'fit',
	initComponent: function(){
		var me = this;



        me.title = i18n.getKey('approval');
		me.callParent(arguments);
		
		me.form = Ext.create("Ext.form.Panel",{
			autoScroll : true,
			bodyStyle : {
				padding: '10px'
			},
			tbar : [{
				text : i18n.getKey('approve'),
				width : 70,
				iconCls : 'icon_agree',
				handler : function(){
					me.controller.confirmedUAT("CONFIRMED");
				}
			},{
				text : i18n.getKey('REJECTED'),
				width: 70,
				iconCls : 'icon_cancel',
				handler : function(button){
					me.controller.confirmedUAT("REJECTED");
				}
			},{
				text : i18n.getKey('CANCELL'),
				width : 70,
				iconCls : 'icon_garbage',
				handler : function(){
					me.controller.confirmedUAT("CANCELLED");
				}
			}],
			defaults : {
	            labelWidth: 80,
	            width: 400,
	            labelAlign: 'right'
	        },
			items : [{
				xtype : 'displayfield',
				itemId : 'name',
				fieldLabel: i18n.getKey('name')
			},{
				xtype : 'displayfield',
				itemId : 'type',
				fieldLabel : i18n.getKey('type')
			},{
                xtype: 'displayfield',
                itemId: 'website',
                fieldLabel: i18n.getKey('website')
      		},{
				xtype : 'displayfield',
				itemId : 'description',
				fieldLabel : i18n.getKey('description')
			},{
				xtype : 'textarea',
				itemId : 'remark',
				name : 'remark',
				width : 450,
				fieldLabel : i18n.getKey('remark'),
				height : 160
			}]
		});
		me.add(me.form);
		me.setDisplayField();
	},
	setDisplayField : function(){
		var me = this;
		var form = me.form, record = me.record, resource = me.resource;
		form.getComponent("name").setValue('<div class="status-field">' + record.get('name') + '</div>');
		form.getComponent("type").setValue('<div class="status-field">' + i18n.getKey(record.get('type')) + '</div>');
		form.getComponent("website").setValue('<div class="status-field">' + record.get('website').name + '</div>');
		form.getComponent("description").setValue('<div class="status-field">' + record.get('description') + '</div>');
	}
	
});