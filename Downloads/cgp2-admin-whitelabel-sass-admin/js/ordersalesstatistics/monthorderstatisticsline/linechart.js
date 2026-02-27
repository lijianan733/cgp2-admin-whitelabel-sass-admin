// 订单   月统计的  每个网站的折线图
Ext.namespace('statistics.columnChart');
	
statistics.columnChart.createLineChart = function(firstYear,status){
	var page = Ext.getCmp("monthStatisticsChart");
	var center =  page.getComponent('center');
	var fields1 = Ext.Date.parse(firstYear +"-01-01", "Y-m-d");
	var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
	var fields = ['month'];
	var chartfields = [];
	var series = [];
	websiteStore.each(function(record){
		var name =  record.get('name');
		if(name != null && record.get('id') != null){
			fields.push(name);
			chartfields.push(name);
			series.push({
                type: 'line',
                highlight: {
                    size: 7,
                    radius: 7
                },
                axis: 'left',
                smooth: true,
                xField: 'month',
                yField: name,
                markerConfig: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0
                },
                tips: {
				  trackMouse: true,
				  width: 140,
				  height: 28,
				  renderer: function(storeItem, item) {
				  		var sale = storeItem.get(record.get('name')) +'';
						var num = sale.indexOf('.') == -1 ? sale.length : sale.indexOf('.');
						var bb = num%3 > 0 ? Math.floor(num/3) + 1 :num/3;
						var string = sale;
						for(var i = 0 ;i < bb-1; i++){
							var LL = string.indexOf('.') == -1 ? string.length : string.indexOf('.');
							string = string.substr(0,LL-3*(i+1)-i) + ","+string.substr(LL-3*(i+1)-i);
						}
				    this.setTitle(storeItem.get('month') + '月 : $' + string);
				  }
				}
            });
		}
	}); 
	
	var store = Ext.create('Ext.data.JsonStore', {
        fields: fields,
        proxy : {
			type : 'uxrest',
			url : adminPath + 'api/admin/orderstatistics/monthline',
			reader : {
				type: 'json',
				root: 'data'
			}
		},
		autoLoad : false,
		autoDestroy : true
    });
    
    store.load({
		params:{firstYear: fields1.format("yyyy-MM-dd"),statusId : status}
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
                minimum: 0,
                position: 'left',
                fields: chartfields,
                title: i18n.getKey('sales')+"("+i18n.getKey('dollar') + ")",
                minorTickSteps: 1,
                grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 0.5
                    }
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['month'],
                title: i18n.getKey('monthF')+"("+i18n.getKey('year')+"/"+i18n.getKey('month')+")",
                label : {
                	renderer:function(v){
	                    if(Number(v)%2 == 0){
	                    	return v;
	                    }else{
	                        return  '';
	                    }
	                }
                }
            }],
            series: series
         });
     var t = new Ext.Template([
	    '<div >', //style="line-height:50px;"
	        '<span >'+i18n.getKey('time')+'：{first} &nbsp&nbsp '+i18n.getKey('website')+' : {website} &nbsp&nbsp '+i18n.getKey('orderStatus')+' : {status}</span>',
	    '</div>'
	]);
	var introductText = new Ext.Template([
		'<div>',
			'<span> {first}年本系统每个网站的订单金额趋势图</span>',
		'<div>'
	]);
	t.compile();
	introductText.compile();
	var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
	var statusStr =  editstatusstr(status);
	var htmlstr = t.apply({first: firstYear,  website: "all website", status: statusStr});
	
	center.getComponent('display').setValue(htmlstr);
	center.getComponent('introduction').setValue(introductText.apply({first:firstYear}));
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