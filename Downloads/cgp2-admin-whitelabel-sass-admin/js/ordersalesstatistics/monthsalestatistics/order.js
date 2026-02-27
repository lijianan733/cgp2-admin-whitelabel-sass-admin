Ext.onReady(function(){
    var store = Ext.create('Ext.data.JsonStore', {
        fields: ['month', 'time1', 'time2'],
        data: [
                {month: 1, time1: 56703000, time2: 38900000 },
                {month: 2, time1: 56703000, time2: 38900000 },
                {month: 3, time1: 12650000, time2: 21000000 },
                {month: 4, time1: 42100000, time2: 50410000 },
                {month: 5, time1: 25780000, time2: 23040000},
                {month: 6, time1: 38910000, time2: 56070000} ,
                {month: 7, time1: 24810000, time2: 26940000},
                {month: 8, time1: 12650000, time2: 21000000 },
                {month: 9, time1: 42100000, time2: 50410000 },
                {month: 10, time1: 25780000, time2: 23040000},
                {month: 11, time1: 38910000, time2: 56070000} ,
                {month: 12, time1: 24810000, time2: 26940000}
              ]
    });
	 var chart = Ext.create('Ext.chart.Chart',{
            animate: true,
            shadow: true,
            store: store,
            legend: {
                position: 'right'
            },
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['time1','time2'],
                title: false,
                grid: true,
                label: {
                    renderer: function(v) {
                        return String(v).replace(/(.)00000$/, '.$1M');
                    }
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['month'],
                title: false,
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
                yField: ['time1','time2'],
                stacked: false,
                tips: {
                    trackMouse: true,
                    width: 65,
                    height: 28,
                    renderer: function(storeItem, item) {
                        this.setTitle(String(item.value[1] / 1000000) + 'M');
                    }
                }
            }]
            });


    var panel1 = Ext.create('Ext.Viewport', {
//        width: 800,
//        height: 800,
        title: 'Stacked Bar Chart - Movies by Genre',
        renderTo: Ext.getBody(),
        layout: 'fit',
        items: chart
    });
});