/**
 *
 */
//Ext.syncRequire(['CGP.cmssetting.model.CmsSettingModel'])
Ext.onReady(function() {
	// JS的去url的参数的方法，用来页面间传参
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	};
	var websiteId = getQueryString('websiteId');

	var CmsSettingStore = Ext.create('CGP.cmssetting.store.CmsSettingStore', {
		websiteId: websiteId
	});
    var CmsPublishStore = Ext.create('CGP.cmssetting.store.CmsPublishStore');          
	// 提交和重置按钮
	var tbar = Ext.create('Ext.toolbar.Toolbar', {
		items: [{
			itemId: 'btnSave',
			text: i18n.getKey('Save'),
			iconCls: 'icon_save',
			handler: modify,
			style: {
				marginLeft: '15px'
			}
		}, {
			itemId: 'btnReset',
			text: i18n.getKey('reset'),
			iconCls: 'icon_reset',
			handler: reset
		}, {
			itemId: 'btnAdd',
			text: i18n.getKey('add'),
			iconCls: 'icon_add',
			handler: function() {
						Ext.MessageBox.prompt('CmsSetting','请输入要添加的CmsSetting标签名称',callBack,this,true);
						function callBack(id,msg){
							if(id=='ok'){
								newLabelTitle(msg);
							}else{
								
							}
						}
					}
		}/*, {
			itemId: 'btnRemove',
			text: i18n.getKey('remove'),
			iconCls: 'icon_remove',
			handler: function()  {
				       for(var i=0;i<Ext.ComponentQuery.query('[fieldLabel=removebutton]').length;i++){
				       	     if(Ext.ComponentQuery.query('[fieldLabel=removebutton]')[i].isHidden()==true){
				       	     	   Ext.ComponentQuery.query('[fieldLabel=removebutton]')[i].setVisible(true)
				       	     }else{
				       	     	   Ext.ComponentQuery.query('[fieldLabel=removebutton]')[i].setVisible(false)
				       	     }
				       }
				}
		}*/]
	});
	// 下面两个方法是按钮触发的保存和重置方法
	function modify() {
		var values = Ext.Object.getValues(page.getValues());//CmsSettingStore.data.items[0].data.key
		var fields = page.getForm().getFields().items;
		Ext.ModelManager.getModel('CGP.cmssetting.model.CmsSettingModel').getProxy().url = adminPath + 'api/'+websiteId+'/cmsSetting';
		for(var i = 0; i < fields.length; i++) {
			var field = fields[i];
			index = CmsSettingStore.findBy(function(record, id) {   
			    return record.data.key==field.key;   
			});
			//在store中没有itemId
			if(index<0) {
				CmsSettingStore.add({
					title: field.fieldLabel,
					websiteId: websiteId,
					key: field.key,
					value: values[i].toString()
				})
			} else {
				  var record = CmsSettingStore.getAt(index);
				if(field.getValue() != record.get('value').toString()) {
					record.set('value', field.getValue().toString());
					record.save();
					record.commit();
				}else{}
			}
		}
		CmsSettingStore.sync();
		Ext.MessageBox.alert('提示', '保存成功！');
	};

	function reset() {
		var values = [];
		for(var i = 0; i < (CmsSettingStore.getCount()); i++) {
			var conf = CmsSettingStore.getAt(i);
			id = conf.get('id');
			value = conf.get('value');
			values.push({
				id: id,
				value: value
			});
		}
		page.getForm().setValues(values);
	}

	var mask;
	var page = Ext.create('Ext.form.Panel', {
		header: false,
		height: 400,
		width: 500,
		autoScroll: true,
		region: 'center',
		frame: false,
		defaults: {
			allowBlank: false,
			blankText: 'this value is required',
			style: {
				marginLeft: '20px',
				marginTop: '5px'
			},
			msgTarget: 'side'
		},
		tbar: tbar,
		layout: {
			type: 'table',
			columns: 1
		},
		items: [],
		listeners: {
			render: function(panel) {
				mask = panel.setLoading(true);
			}
		}
	});

	new Ext.container.Viewport({
		layout: 'border',
		//renderTo: 'jie',
		items: [page]
	});
//store中已经存在的
	CmsSettingStore.load({
		callback: function(records, options, success) {
			mask.hide();
			if(!Ext.isEmpty(records)){
			for(var j = 0; j < records.length; j++) {
				var fieldtext = new Ext.container.Container({
                titel:'12',
                height:45,
                width:600,
                layout:{
                    type:'table',
                    columns:5
                  },
                frame : true,
                items : [{
						fieldLabel: records[j].get('title'),
						key:records[j].get('key'),
						width: 350,
						editable: false,
						xtype: 'combo',
						records:records[j],
						websiteId: records[j].get('websiteId'),
						value: parseInt(records[j].get('value')),
						id: records[j].get('key'),
						name: records[j].get('id'),
						itemId: records[j].get('key'),
						store2: records,
						store: CmsPublishStore,
						valueField: 'id',
						colspan:3,
						displayField: 'name'
						},{
                        width:15,
                        colspan:1,
                        border:0
                      },{
                      	xtype:'button',
                      	fieldLabel: 'removebutton',
                        width:80,
                        colspan:1,
                        tag: 'img',
						text: i18n.getKey('remove'),
						iconCls: 'icon_remove',
						//hidden:true,
						handler : function (e) {
	                           Ext.MessageBox.confirm('删除','您确定要删除该条？',callBack);
									function callBack(id){
										if(id=='yes'){
											var currentcontainer= e.up();
											var a=[];
											currentComboRecords=e.prev().prev().records;
									        CmsSettingStore.remove(currentComboRecords);
									       // CmsSettingStore.removeAt(1);
											 CmsSettingStore.sync();
										}else{}
								}
	                      }
                   }]
                })				
			page.add(fieldtext);
			}
			}else{}
		}
	});
//添加store中没有的
     function newLabelTitle(msg) {//item.initialConfig.items[0].key
	    var newLabelTitle=msg;
	     //var length=page.getForm().length;
	      var CmsSettingStorelength=CmsSettingStore.data.length;
	      var keys=[];
	     page.items.each(function(item,index,length){ 
	     	        var itemslength=item.initialConfig.items;
	     	        	 keys.push(itemslength[0].key)
        });
        if(Ext.isEmpty(keys)){
        	var keys2=0;
        }else{
        	var keys2= keys.pop().slice(17);
        }
            
          var lastkey=parseInt(keys2)+1;
	     if(!Ext.isEmpty(newLabelTitle)){
				var fieldtext = new Ext.container.Container({
                titel:'12',
                height:45,
                width:600,
                layout:{
                    type:'table',
                    columns:5
                  },
                frame : true,
                items : [{
							fieldLabel: newLabelTitle,
							key:"PUBLISH_STRATEGY_"+lastkey,
							width: 350,
							editable: false,
							xtype: 'combo',
							id: "PUBLISH_STRATEGY_"+lastkey,
							value:'',
							name: newLabelTitle,
							itemId: "PUBLISH_STRATEGY_"+lastkey,
							store: CmsPublishStore,
							valueField: 'id',
							displayField: 'name',
							listeners: { //监听   
							render: function(combo) { //渲染   
								combo.getStore().on("load", function(s, r, o) {
									combo.setValue(r[0].get('id')); //第一个值   
								});
							  }
						   }
						},{
	                        width:15,
	                        colspan:1,
	                        border:0
	                        //xtype:'hidden',
                        },{
	                      	xtype:'button',
	                      	fieldLabel: 'removebutton',
	                        width:80,
	                        colspan:1,
							text: i18n.getKey('remove'),
							iconCls: 'icon_remove',
							handler : function (e) {
	                           Ext.MessageBox.confirm('删除','您确定要删除该条？',callBack);
									function callBack(id){
										if(id=='yes'){
											var currentcontainer= e.up();
											  page.remove(currentcontainer)
										}else{}
								}
	                        }
                        }]
                })				
			page.add(fieldtext);		
	      }else{}
       }

});