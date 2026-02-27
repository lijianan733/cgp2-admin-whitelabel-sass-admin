	
statistics.columnChart.createPieChart = function(firstYear,status){
	var defaultMonth = 8;
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
			series.push();
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
    
    var pieStore = Ext.create('Ext.data.JsonStore',{
		fields : ['name','value'],
		data : [{name: 'ps',value : 500},{name: 'CGP',value : 900}]
	});
	
	function dealStore(store,month){
			for(var i = 0 ;i < store.getCount(); i++){
				if(store.getAt(i).get('month') == month){
					var model = store.getAt(i);
					var data = [];
					websiteStore.each(function(record){
						var name = record.get('name');
						if(model.get(name) != null &&model.get(name) != 0 && record.get('id') != null){
						data.push({name : name ,value : model.get(name)});
						}
					});
					pieStore.loadData(data);
					if(data.length == 0 ){
						var chart = Ext.getCmp('columnChart');
						chart.getComponent('chart').hide();
						chart.getComponent('nodata').show();
					}else {
						var chart = Ext.getCmp('columnChart');
						chart.getComponent('chart').show();
						chart.getComponent('nodata').hide();
					}
				}
			}
	}
	
    store.load({
		params:{firstYear: fields1.format("yyyy-MM-dd"),statusId : status},
		callback: function(records, operation, success) {
			dealStore(this,defaultMonth);
		}
	});
	
	if(Ext.getCmp('columnChart') != null){
		var oldChart = Ext.getCmp('columnChart');
		center.remove( oldChart, true );
	}
	var piePage = Ext.create("Ext.panel.Panel",{
		border : true,
		id : 'columnChart',
		width : 800,
		height : 600,
		style : 'marginLeft : 50px',
		bbar: [{
            text: i18n.getKey('lastmonth'),  //'上一月',
            handler: function(comp) {
               var numberField = comp.ownerCt.getComponent('currentMonth');
               var value = numberField.getValue();
               if(value > 1){
               		numberField.setValue(value - 1);
               }
            }
        },{
        	xtype : 'numberfield',
        	itemId : 'currentMonth',
        	fieldLabel: i18n.getKey('currentmonth'), //'当前月份 ',
        	labelAlign : 'right',
        	allowDecimals : false,
        	maxValue : 12,
        	minValue : 1,
        	labelWidth : 100,
        	value : defaultMonth,
        	listeners : {
        		change : function(theComp,newValue, oldValue){
        			if(1 <= newValue <= 12){
        				dealStore(store,newValue);
        			}
        		}
        	}
        	
        },{
            text: i18n.getKey('nextmonth'), //'下一月',
            handler: function(comp) {
               var numberField = comp.ownerCt.getComponent('currentMonth');
               var value = numberField.getValue();
               if(value < 12){
               		numberField.setValue(value + 1);
               }
            }
        }, {
            enableToggle: true,
            pressed: false,
            text: i18n.getKey('ringpie'),  //'环形饼图',
            toggleHandler: function(btn, pressed) {
            	var chart = btn.ownerCt.ownerCt.getComponent('chart');
                chart.series.first().donut = pressed ? 30 : false;
                chart.refresh();
            }
        }],
		items : [{
			xtype : 'chart',
			itemId : 'chart',
			width : 800,
			height : 600,
            animate: false,
            shadow: false,
            store: pieStore,
            insetPadding: 60,
            theme: 'Base:Category2', //Base:gradients
            legend: {
                position: 'right'
            },
            series: [{
                type: 'pie',
                field: 'value',
                showInLegend: true,
                tips: {
                  trackMouse: true,
                  width: 160,
                  height: 28,
                  renderer: function(storeItem, item) {
                    //calculate percentage.
                    var total = 0;
                    pieStore.each(function(rec) {
                        total += rec.get('value');
                    });
                    this.setTitle(storeItem.get('name') + ': ' + Math.round(storeItem.get('value') / total * 10000)/100 + '%');
                  }
                },
                highlight : false,
//                highlight: {
//                  segment: {
//                    margin: 0  //margin: 20
//                  }
//                },
                label: {
                    field: 'name',
                    display: 'rotate',
                    color :'#000',
                    //contrast: true,
                    font: '18px Arial'
                }
            }]
		},{
			xtype : 'displayfield',
			itemId: 'nodata',
			value : i18n.getKey('nodata'),
			hidden : true
		}]
	});
	
     var t = new Ext.Template([
	    '<div >', //style="line-height:50px;"
	        '<span >'+i18n.getKey('time')+'：{first} &nbsp&nbsp '+i18n.getKey('website')+' : {website} &nbsp&nbsp '+i18n.getKey('orderStatus')+' : {status}</span>',
	    '</div>'
	]);
	var introductText = new Ext.Template([
		'<div>',
			'<span> 年度每月销售额每个网站占据比例</span>',
		'<div>'
	]);
	
	t.compile();
	introductText.compile();
	
	var websiteStore = Ext.data.StoreManager.lookup('websiteStore');
	var websiteValue = websiteStore.getById(null).get('name');
	var statusStr =  editstatusstr(status);
	var htmlstr = t.apply({first: firstYear,  website: websiteValue, status: statusStr});
	
	center.getComponent('display').setValue(htmlstr);
	center.getComponent('introduction').setValue(introductText.apply());
	center.add(piePage);
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