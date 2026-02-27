Ext.onReady(function () {



    var yzOrderImportMappingUrl = path + 'partials/config/' + 'yzorderimportmapping' + '.html' + window.location.search;
    var tbOrderImportMappingUrl = path + 'partials/config/' + 'tborderimportmapping' + '.html' + window.location.search;
    var msOrderImportMappingUrl = path + 'partials/config/' + 'msorderimportmapping' + '.html' + window.location.search;

    var tabPanel = Ext.create('Ext.panel.Panel', {
        id: 'orderImportMapping',
        region: 'center',
        layout:{
        	type:'hbox',
        	align:'stretch'
        },
        items: [createTree(),centerPanel()]
    });
    
//用viewport进行布局
    new Ext.container.Viewport({
         layout: 'fit',
         renderTo: 'jie',
         items: [tabPanel]
    });
    
//右侧panel
	function centerPanel(){
			var tab= Ext.create('Ext.panel.Panel', { 
			    flex:4, 
			    itemId: 'orderImportMapping',
                layout: 'fit'
			});
			return  tab;
	};
    
//左侧threePanel
	function createTree() {
        var me = this;
        var tree = Ext.create('Ext.tree.Panel', { 
            flex: 1,
            rootVisible: false,                                          //2.根节点隐藏
            title: i18n.getKey('order import mapping'),                      //3.多语言中多字母字符串的引入
            root:{
            	 expanded:true,
            	 children:[
            	        {
            	         id: 'yzOrderImportMapping',
                         text: i18n.getKey('YZ Order Import Mapping'),
            	         leaf:true
            	        },     
            	        {id: 'tbOrderImportMapping',
                         text: i18n.getKey('TB Order Import Mapping'),
            	         leaf:true},
                     {
                         id: 'msOrderImportMapping',
                         text: i18n.getKey('MS Order Import Mapping'),
                         leaf: true
                     }
            ]},
            
            listeners: { 
            	//设置打开默认页面
            	afterrender:function(){
				          var record = this.getStore().getNodeById('yzOrderImportMapping');
				          this.getSelectionModel().select(record);
				          var id = record.get('id');
					 	  if(id=='yzOrderImportMapping'){
                            	tabPanel.getComponent('orderImportMapping').removeAll();
                            	tabPanel.getComponent('orderImportMapping').add({
                                    layout:'fit',
                                    title: i18n.getKey('YZ Order Import Mapping'),
                                    html:'<iframe id="tabs_iframe_' + id + '" ' +
                                        'src="' + yzOrderImportMappingUrl+ '" width="100%" height="100%"' +
                                        ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                                        '</iframe>',
                                    closeable:true
                                })
                            }
				        },
				//leaf点击监听
            	itemclick: function (view, record, item, index, e, eOpts) {       //4.选项的单击事件 单击选项时触发。record---属于选项的记录，item-----选项元素，index选项索引，e----事件对象，eOpts------选择对象传递给Ext.util.Observable.addListener。
                        if (record.get('leaf')) { //叶子节点
                            var id = record.get('id');
                            if(id=='yzOrderImportMapping'){
                            	tabPanel.getComponent('orderImportMapping').removeAll();
                            	tabPanel.getComponent('orderImportMapping').add({
                                    layout:'fit',
                                    title: i18n.getKey('YZ Order Import Mapping'),
                                    html:'<iframe id="tabs_iframe_' + id + '" ' +
                                        'src="' + yzOrderImportMappingUrl+ '" width="100%" height="100%"' +
                                        ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                                        '</iframe>',
                                    closeable:true
                                })
                            }else if(id == "tbOrderImportMapping"){
                            	tabPanel.getComponent('orderImportMapping').removeAll();
                            	tabPanel.getComponent('orderImportMapping').add({
                                    layout:'fit',
                                    title: i18n.getKey('TB Order Import Mapping'),
                                    html:'<iframe id="tabs_iframe_' + id + '" ' +
                                        'src="' + tbOrderImportMappingUrl+ '" width="100%" height="100%"' +
                                        ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                                        '</iframe>',
                                    closeable:true
                                })
                            }else if(id == "msOrderImportMapping"){
                                {
                                    tabPanel.getComponent('orderImportMapping').removeAll();
                                    tabPanel.getComponent('orderImportMapping').add({
                                        layout:'fit',
                                        title: i18n.getKey('MS Order Import Mapping'),
                                        html:'<iframe id="tabs_iframe_' + id + '" ' +
                                            'src="' + msOrderImportMappingUrl+ '" width="100%" height="100%"' +
                                            ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();">' +
                                            '</iframe>',
                                        closeable:true
                                    })
                                }
                            }
                        }
                    }
        
                    }
        });
        return tree;
    };

});
