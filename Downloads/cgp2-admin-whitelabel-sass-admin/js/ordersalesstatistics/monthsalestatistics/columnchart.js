
Ext.namespace('statistics.columnChart');
	
statistics.columnChart.createColumnChart = function(firstYear,secondYear,website,status){
	var page = Ext.getCmp("monthStatisticsChart");
	var center =  page.getComponent('center');
	var fields1 = Ext.Date.parse(firstYear +"-01-01", "Y-m-d");
	var fields2 = Ext.Date.parse(secondYear +"-01-01", "Y-m-d");
	var fields = ['month', firstYear, secondYear];
	var chartfields = [firstYear,secondYear];
	if(secondYear == null){
		fields = ['month', firstYear];
		chartfields = [firstYear];
	}
	
	var store = Ext.create('Ext.data.JsonStore', {
		//storeId : 'monthColumnStore',
        fields: fields,
        proxy : {
			type : 'uxrest',
			url : adminPath + 'api/admin/orderstatistics/month',
			reader : {
				type: 'json',
				root: 'data'
			}
		},
		autoLoad : false,
		autoDestroy : true
    });
    
    var secondy = null;
    if(secondYear != null){
    	secondy = fields2.format("yyyy-MM-dd");
    }
    store.load({
		params:{firstYear: fields1.format("yyyy-MM-dd"),secondYear :secondy ,statusId : status ,websiteId : website}
	});
    
	if(Ext.getCmp('columnChart') != null){
		var oldChart = Ext.getCmp('columnChart');
		center.remove( oldChart, true );
	}
	var columnChart = Ext.create('Ext.chart.Chart',{
			id : 'columnChart',
			width : 1100,
			height : 600,
            animate: true,
            shadow: true,
            store: store,
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: chartfields,
				title : i18n.getKey('sales')+"("+i18n.getKey('dollar') + ")",
                grid: true
//                grid: {
////			        odd: {
////			            opacity: 1,
////			            fill: '#ddd',
////			            stroke: '#bbb',
////			            'stroke-width': 1
////			        }
////			    },
//                label: {
//                    renderer: function(v) {
//                        return String(v).replace(/(.)00000$/, '.$1M');
//                    }
//                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['month'],
                title : i18n.getKey('monthF')+"("+i18n.getKey('year')+"/"+i18n.getKey('month')+")",
                label: {
		            renderer: function(v){
		                return  String(v) +"月"; 
		            }
		        }
            }],
            series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'month',
                yField: chartfields,
                stacked: false,
                tips: {
                    trackMouse: true,
                    width: 100,
                    height: 30,
                    renderer: function(storeItem, item) {
                        //this.setTitle(String(item.value[1] / 1000000) + 'M');
                    	var sale = item.value[1] +'';
						var num = sale.indexOf('.') == -1 ? sale.length : sale.indexOf('.');
						var bb = num%3 > 0 ? Math.floor(num/3) + 1 :num/3;
						var string = sale;
						for(var i = 0 ;i < bb-1; i++){
							var LL = string.indexOf('.') == -1 ? string.length : string.indexOf('.');
							string = string.substr(0,LL-3*(i+1)-i) + ","+string.substr(LL-3*(i+1)-i);
						}
						//return  "$" + string; 
                    	this.setTitle("$" + string);
                    }
                },
                render: function(v){
                	return  v + "年";
                }
            }]
         });	
	var t = new Ext.Template([
	    '<div >', //style="line-height:50px;"
	        '<span >'+i18n.getKey('time')+'：{first},{second} &nbsp&nbsp '+i18n.getKey('website')+' : {website} &nbsp&nbsp '+i18n.getKey('orderStatus')+' : {status}</span>',
	    '</div>'
	]);
	var introductText = new Ext.Template([
		'<div>',
			'<span> {first}和{second}年每月订单金额对比</span>',
		'<div>'
	]);
	t.compile();
	introductText.compile();
	var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
	var websiteValue = websiteStore.getById(website).get('name');
	var statusStr =  editstatusstr(status);
	var htmlstr = t.apply({first: firstYear, second: secondYear, website: websiteValue, status: statusStr});
	
	center.getComponent('introduction').setValue(introductText.apply({first:firstYear,second:secondYear}));
	center.getComponent('display').setValue(htmlstr);
	center.add(columnChart);
}


	function editstatusstr(status){
		var statusStore = Ext.data.StoreManager.lookup('orderStatusStore');
		var str = '';
		for(var i = 0; i < status.length;i++){
			str = str + statusStore.getById(status[i]).get('name');
			if(i < status.length -1){
				str = str + ",";
			}
		}
		return  str;
	}

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
	
	






//			xtype : 'chart',
//			id : 'chartpie',
//			store : store,
//			itemId : 'chartpie',
//			hidden : true,
//			animate : true,
//			height : 450,
//			//width : 400,
//			//maxWidth : 500,
//			border: false, 
//			legend : {
//				position : 'bottom'
//			},
//			shadow : true,
//			series : [{
//				type :'pie',
//				field :'money',
//				showInLegend : true,
//				colorSet : ['#ffff00','#669900','#ff6699','#66cccc','#6699ff','#ff3300','#33ff33','#00ffff','#66ff99'],
//				label : {
//					field : 'month',
//					contrast : true,
//					color : '#ffff00',
//					renderer : function(v){
//						return '[' +v+ ']';
//					},
//					display : 'middle', //'rotate'
//					font :'18px "Lucida Grande"'
//				},
//				highlight: {
//					segment : {
//						margin: 10
//					}
//				},
//				tips :{
//					trackMouse : true,
//                    width : 140,
//                    height : 34,
//					renderer :function(storeItem){
//							var total = 0;
//						  store.each(function(rec) {
//                            total += rec.get('money');
//                          });
//                      this.setTitle(storeItem.get('month') + ': $'+storeItem.get('money') + '<br>'
//                      + Math.round(storeItem.get('money') / total * 100)
//                          + '%');
//					}
//				}
//			}]
//		}]
//	});
//	orderSalesPage.add(panel);
//	

//});