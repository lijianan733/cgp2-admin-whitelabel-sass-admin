Ext.define("CGP.currency.field.Symbol",{
	extend : "Ext.form.field.Display",
	alias : "widget.symbol",
	
	idNum :null, //生成的随机数
	container: null,
    /**
     * @cfg {Object} resource
     * 多语言配置
     */

	constructor :function(config){
		var me = this;

		me.idNum = parseInt(Math.random()*100000,10);
		me.value = '<div id="'+me.idNum+'-displaySymbol"></div>';
		me.callParent(arguments);
	},
	onRender : function(){
		var me = this;
		me.callParent(arguments);
		me.container = Ext.create("Ext.container.Container",{
			layout: {
		        type: 'hbox'
		    },
    		renderTo: Ext.get(me.idNum+"-displaySymbol"),
    		items: [{
		        xtype: 'textfield',
		        labelAlign : 'right',
		        width : 380,
		        itemId : "symbol",
		        fieldLabel: i18n.getKey('symbol')
		    },{
		        xtype: 'combo',
		        width : 380,
		        labelAlign : 'right',
		        itemId : 'symbolPosition',
		        fieldLabel: i18n.getKey('symbolPosition'),
		        store : Ext.create("Ext.data.Store",{
		        	fields : ["name","position"],
		        	data : [{name : 'symbolLeft',position : i18n.getKey('left')},
		        		{name : "symbolRight",position : i18n.getKey('right')}]
		        }),
		        displayField : "position",
		        valueField : 'name',
		        value : 'symbolLeft',
		        listeners : {
		        	change : function(com, newValue,oldValue){
		        		me.name = me.ownerCt.model +"."+ newValue;
		        	}
		        }
		    }]
		});
	},
    /**
     *
     * @param {String} leftValue
     * @param {String} rightValue
     */
	setSubmitValue : function(leftValue,rightValue){
		var me = this;
		if(leftValue != null && leftValue != ""){
			me.container.getComponent("symbol").setValue(leftValue);
			me.container.getComponent("symbolPosition").setValue("symbolLeft");
		}else if(rightValue != null && rightValue != ""){
			me.container.getComponent("symbol").setValue(rightValue);
			me.container.getComponent("symbolPosition").setValue("symbolRight");
		}
	},

    /**
     *
     * @returns {String} symbol
     * 货币标志
     */
	getSubmitValue : function(){
		var me = this;
		return me.container.getComponent("symbol").getValue();
	}
});