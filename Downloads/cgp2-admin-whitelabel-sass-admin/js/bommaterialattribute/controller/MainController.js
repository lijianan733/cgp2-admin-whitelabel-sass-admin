Ext.define("CGP.bommaterialattribute.controller.MainController",{
	

	
    optionWindow : null,//属性的选项管理window（显示）
    addOptionWindow : null,//添加一个选项的添加window（添加）
	
	constructor : function(config){
		var me = this;

		me.callParent(arguments);
	},
	
	openOptionWindow : function(record){
		var me = this;
		    gridPageValueType=record.data.valueType;
		if (Ext.isEmpty(me.optionWindow)){
            me.optionWindow = Ext.create("CGP.bommaterialattribute.view.window.Option",{
            	attributeId : record.get("id"),
            	controller : me,
            	gridPageValueType:me.gridPageValueType,//值类型
            })
		}else{
			me.optionWindow.refresh(record.get("id"));
		}
        me.optionWindow.setTitle(i18n.getKey('attribute')+": "+record.get("name"));
        me.optionWindow.show();
	},
    
    openAddOptionWindow : function(record,gridPageValueType){
    	var me = this;
    	    pageValueType =gridPageValueType;
    	    var optionsLength2 = me.optionWindow.grid.getStore().getCount();
    	    if(pageValueType=="Boolean"&&optionsLength2>1&&Ext.isEmpty(record)){
    	    	Ext.MessageBox.alert('提示', '选择Boolean类型时，options最多只能添加两个value')
    	    	
    	    }else{
    	if(Ext.isEmpty(record)){
    		record = Ext.create('CGP.bommaterialattribute.model.AttributesOptions',{
		        id: null,
		        name: "",
		        value:"",
		        sortOrder: "",
		    });
		    me.addOptionWindow = Ext.create("CGP.bommaterialattribute.view.window.AddOption",{
    			record : record,
    			controller : me,
    			btnFunction : me.addOption,
    			pageValueType:pageValueType
    		});
    		me.addOptionWindow.show();
    	}else{
    		me.addOptionWindow = Ext.create("CGP.bommaterialattribute.view.window.AddOption",{
    			record : record,
    			controller : me,
    			btnFunction : me.addOption,
    			pageValueType:pageValueType
    		});
    		me.addOptionWindow.show();
    	    me.addOptionWindow.reset(record);
    	  }	
    		
    	}
    },
    
    /**
     * 将一个新建的选项加入到一个属性的 选项集合Store 中
     * 这个Store是自动同步的。
     */
    addOption : function(record,name,value,sortOrder) {
        var me = this;
        var store = me.optionWindow.grid.getStore();
		if(Ext.isEmpty(record.get("id"))){
	        var r = Ext.create("CGP.bommaterialattribute.model.AttributesOptions",{
	            id: null,
	            name: name,
	            value:value,
	            sortOrder: sortOrder || ""
	        });
	       
	        store.insert(1,r);
		}else{
			record.set("name",name);
			record.set("value",value);
			record.set("sortOrder",sortOrder);
			
		}
   },
   bomAttributeApplys: function (attributeId) {
        Ext.Ajax.request({
            url: adminPath + 'api/admin/bom/schema/attributes/' +attributeId+ '/options',
            method: 'GET',
            params:{  
		        id:attributeId
		        }, 
		    async: false,
            headers: {     
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            failure: function(response, opts) {
				            	Ext.MessageBox.alert('失败' + response.message);
				      },
            success: function(response, opts) {  
            	                return Ext.decode(response.responseText);
				      },
        });
    },
});