Ext.Loader.syncRequire([
	'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function(){

	

	//这是图表chart的Store数据
	var store = Ext.data.StoreManager.lookup('ProductCategoryStore');
	// js的时间日期格式化函数
	Date.prototype.format = function(format){ 
		var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
		} 
		
		if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 
		
		for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
		} 
		return format; 
	} 
	
	
	//页面加载时加载Store数据，及发送的参数
	var sdate = new Date().format('yyyy-MM');
	store.load({
		params:{month: sdate}
	});
	
	Ext.create('CGP.common.store.OrderStatuses',{
		storeId:"orderStatusStore",
		autoLoad:true,
		allowNull: false
	});
	
	Ext.create('Ext.data.Store',{
	 	storeId: 'switchStore',
	 	fields: [{
	 	 	name: 'name',  type: 'string'
        },{
        	name: 'value', type : 'string'
        }],
	 	data : [
         	{name: 'Column Chart',    value: 'column'},
         	{name: 'Pie Chart', value: 'pie'}
     	]
	})
	
	//年份和月份的本地Store数据
	var yearStore = Ext.data.StoreManager.lookup('yearStore');
	var monthStore = Ext.data.StoreManager.lookup('monthStore');
	
	// 整个页面的viewPort 
	var orderSalesPage = Ext.create('Ext.container.Viewport',{
		renderTo : Ext.getBody(),
		height : '100%',
		items: [{
	        itemId : 'filter',
			region : 'north',
			xtype : 'uxfilter',
			searchActionHandler : loadSaleStore,
//			layout : {
//				type : 'table',
//				columns : 4
//			},
			items : [{
				xtype : 'combo',
				itemId : 'year',
				fieldLabel: i18n.getKey('year'),
				labelAlign :'right',
			    store: yearStore,
			    queryMode: 'local',
			    displayField: 'year',
			    valueField: 'year',
			    editable : false,
			    forceSelection : true,
			    value : new Date().format('yyyy')
			},{
				xtype : 'combo',
				itemId : 'month',
				fieldLabel: i18n.getKey('month'),
				labelAlign :'right',
			    store: monthStore,
			    queryMode: 'local',
			    displayField: 'month',
			    valueField: 'value',
			    editable : false,
			    forceSelection : true,
			    value : new Date().format('MM')
			},{
				
            	name: 'status',
                xtype: 'combo',
                itemId: 'status',
                editable:false,
                fieldLabel: i18n.getKey('status'),
                multiSelect: true,
                displayField: 'name',
                valueField: 'id',
                labelAlign: 'right',
                store: Ext.data.StoreManager.lookup('orderStatusStore'),
                queryMode: 'remote',
                matchFieldWidth: true
			},{
                name: 'mainCategory.website.id',
                xtype: 'websitecombo',
                labelAlign: 'right',
                itemId: 'website',
                listeners: {
                    select: function (combo, records) {
                        var record = records[0];
                        var mainCategory = combo.ownerCt.getComponent('mainCategory');
                        mainCategory.ids = [];
                        mainCategory.setValue('');
                        if (record.get('id') != null) {
                            mainProductCategoryStore.proxy.extraParams.website = record.get('id');
                            mainProductCategoryStore.load({
                                callback: function () {
                                    mainCategory.tree.expandAll();
                                }
                            });
                        }
                    }
                }

            },{
				xtype : 'combo',
				itemId: 'switch',
                editable:false,
                fieldLabel: i18n.getKey('SwitchChart'),
                multiSelect: false,
                displayField: 'name',
                valueField: 'value',
                labelAlign: 'right',
                store: Ext.data.StoreManager.lookup('switchStore'),
                queryMode: 'local',
                matchFieldWidth: true,
                value : 'column',
                listeners : {
                	change : function( component, newValue){
                		var chartcolumn = panel.getComponent("chartcolumn");
				        var chartpie = panel.getComponent('chartpie');
				       	if(newValue == 'column'){
				       		chartcolumn.show();
				       		chartpie.hide( );
				       	}
				       	else {
				       		chartcolumn.hide( );
				       		chartpie.show();
				       	}
                	}
                }
			}],
			listeners: {
	            afterrender: function (page) {
	                var website = page.getComponent("website");
	                var store = website.getStore();
	                store.on('load', function () {
	                    this.loadData([{
	                        name: 'All Website',
	                        id: null
	                    }], true);
	                    website.select(store.getAt(store.getCount() - 1));
	                });
	            }
			}
	    }]
	});
	
	var panel = Ext.create('Ext.panel.Panel',{
		title : i18n.getKey('MonthPCSS'),
//		width : 600 ,
		//autoScroll : true,
		height : document.documentElement.clientHeight - 150,
		region: 'center',
		layout : 'fit',
		items : [{
			xtype : 'chart',
			itemId: 'chartcolumn', 
			store : store,
			axes : [{
				type : 'Numeric',
				position : 'left',
//				minimum : 0,
//				maximun : 10000000,
				fields : ['money'],
				title : i18n.getKey('sales') + "(" + i18n.getKey('dollar')+")"
			},{
				type : 'category',
				position : 'bottom',
				fields : ['mainCategory'],
				title : i18n.getKey('productCategory'),
				label: {
                    rotate: {
                        degrees: 315
                    }
                }
			}],
			legend : { position : 'bottom'},
			series : [{
				type : 'column',
				axis : 'left',
				gutter: 40,
//	            style : {
//	            	width : 50
//	            },
				xField: 'mainCategory',
				yField : 'money',
				title : i18n.getKey('MonthPCSS'),
//				renderer: function(sprite, record, attr, index, store) {                    
////					console.log(arguments);
//					sprite.surface.width = 500;
//				    return Ext.apply(attr, {
//				        fill: '#00FF33',
//				        width: 50,
//				        'stroke-width' : 10,
//				        x: Math.max(attr.x, attr.x + (attr.width - 50) / 2)
//				    });
//				},
				label : {
					minMargin :10,
					field : ['money'],
					display : 'outside',
					font : ' 18px "Lusida Grande" ',
					renderer : function(v){
						var sale = v +'';
						var num = sale.indexOf('.') == -1 ? sale.length : sale.indexOf('.');
						var bb = num%3 > 0 ? Math.floor(num/3) + 1 :num/3;
						var string = sale;
						for(var i = 0 ;i < bb-1; i++){
							var LL = string.indexOf('.') == -1 ? string.length : string.indexOf('.');
							string = string.substr(0,LL-3*(i+1)-i) + ","+string.substr(LL-3*(i+1)-i);
						}
						return  "$" + string; 
					} 
				},
				highlight: true,
	            tips: {
	              trackMouse: true,
	              width: 140,
	              height: 28,
	              renderer: function(storeItem, item) {
	                this.setTitle(storeItem.get('money') + ': ' + storeItem.get('mainCategory') + ' $');
	              }
	            }
			}]
		},{
			xtype : 'chart',
			id : 'chartpie',
			store : store,
			hidden : true,
			animate : true,
			style : {
				marginTop :'50px',
				marginBottom : '100px'
			},
			legend : {
				position : 'bottom'
			},
			shadow : true,
			series : [{
				type :'pie',
				field :'money',
				showInLegend : true,
				colorSet : ['#ffff00','#669900','#ff6699','#66cccc','#6699ff'],
				label : {
					field : 'mainCategory',
					contrast : true,
					color : '#ffff00',
					renderer : function(v){
						return '[' +v+ ']';
					},
					display : 'middle', //'rotate'
					font :'18px "Lucida Grande"'
				},
				highlight: {
					segment : {
						margin: 10
					}
				},
				tips :{
					trackMouse : true,
                    width : 140,
                    height : 51,
					renderer :function(storeItem){
							var total = 0;
						  store.each(function(rec) {
                            total += rec.get('money');
                          });
                      this.setTitle(storeItem.get('mainCategory') + '<br> $'+storeItem.get('money') + '<br>'
                      + Math.round(storeItem.get('money') / total * 100)
                          + '%');
					}
				}
			}]
		}]
	});
	orderSalesPage.add(panel);
	
	function loadSaleStore(){
		
		var year = orderSalesPage.getComponent('filter').getComponent('year').getValue();
		var month = orderSalesPage.getComponent('filter').getComponent('month').getValue();
		var date = year+'-'+ month;
		var status = [];
		status = orderSalesPage.getComponent('filter').getComponent('status').getSubmitValue();
		console.log(status);
		
		var website = null;
		website = orderSalesPage.getComponent('filter').getComponent('website').getSubmitValue();
		
		
		if(date != null){
			panel.getComponent('chartcolumn').store.load({
				
				params:{month: date,statusId : status,websiteId: website}
			});
		}
	};
	

});