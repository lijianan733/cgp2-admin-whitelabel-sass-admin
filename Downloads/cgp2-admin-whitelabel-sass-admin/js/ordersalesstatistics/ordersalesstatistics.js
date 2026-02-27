Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.onReady(function () {


    var store = Ext.data.StoreManager.lookup('orderStatisticsStore');

    // js date格式化 format方法
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }


    var date = new Date();
    var sdate = new Date(date.format('yyyy')).format('yyyy-MM-dd');
    store.load({
        params: {'startDate': sdate}
    });

    Ext.create('CGP.common.store.OrderStatuses', {
        storeId: "orderStatusStore",
        autoLoad: true,
        allowNull: false
    });

    Ext.create('Ext.data.Store', {
        storeId: 'switchStore',
        fields: [{
            name: 'name', type: 'string'
        }, {
            name: 'value', type: 'string'
        }],
        data: [
            {name: 'Column Chart', value: 'column'},
            {name: 'Pie Chart', value: 'pie'}
        ]
    })

    // 整个页面的viewPort
    var orderSalesPage = Ext.create('Ext.container.Viewport', {
        renderTo: Ext.getBody(),
        height: '100%',
        items: [{
            itemId: 'filter',
            region: 'north',
            xtype: 'uxfilter',
            searchActionHandler: loadSaleStore,

            items: [{
                name: 'startDate',
                xtype: 'datefield',
                fieldLabel: i18n.getKey('starttime'),
                labelAlign: 'right',
                format: 'Y-m-d',
                itemId: 'startDate'
            }, {
                name: 'endDate',
                xtype: 'datefield',
                labelAlign: 'right',
                format: 'Y-m-d',
                fieldLabel: i18n.getKey('endtime'),
                itemId: 'endDate'
            }, {
                name: 'website',
                itemId: 'websiteCombo',
                xtype: 'websitecombo',
                hidden: true,
            }, {

                name: 'status',
                xtype: 'combo',
                itemId: 'status',
                editable: false,
                fieldLabel: i18n.getKey('status'),
                multiSelect: true,
                displayField: 'name',
                valueField: 'id',
                labelAlign: 'right',
                store: Ext.data.StoreManager.lookup('orderStatusStore'),
                queryMode: 'remote',
                matchFieldWidth: true,
                listeners: {
                    afterrender: function (combo) {
                        var store = combo.getStore();
                        store.on('load', function () {
                            this.insert(0, {
                                id: null,
                                name: 'All Status'
                            });
                            combo.select(store.getAt(0));
                        });
                    }
                }


            }, {
                xtype: 'combo',
                itemId: 'switch',
                editable: false,
                fieldLabel: i18n.getKey('SwitchChart'),
                multiSelect: false,
                displayField: 'name',
                valueField: 'value',
                labelAlign: 'right',
                store: Ext.data.StoreManager.lookup('switchStore'),
                queryMode: 'local',
                matchFieldWidth: true,
                value: 'column',
                listeners: {
                    change: function (component, newValue) {
                        var chartcolumn = panel.getComponent("chartcolumn");
                        var chartpie = panel.getComponent('chartpie');
                        if (newValue == 'column') {
                            chartcolumn.show();
                            chartpie.hide();
                        } else {
                            chartcolumn.hide();
                            chartpie.show();
                        }
                    }
                }
            }]
        }]
    });

    var panel = Ext.create('Ext.panel.Panel', {
        title: i18n.getKey('orderMSS'),
//		width : 600 ,
        region: 'center',
        //layout : 'fit',
        autoScroll: true,
        bodyStyle: {"background-color": "fafafa"},
        items: [{
            xtype: 'chart',
            itemId: 'chartcolumn',
            minWidth: 800,
            maxWidth: 800,

//			width :1000,
//			margin: '150 auto',
            //maxWidth :600,
            height: document.documentElement.clientHeight - 150,
            columnWidth: '50',
            store: store,
            axes: [{
                type: 'Numeric',
                position: 'left',

//				maximun : 10000000,
                fields: ['money'],
                title: i18n.getKey('sales') + "(" + i18n.getKey('dollar') + ")",
                grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 1
                    }
                }
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['month'],
                title: i18n.getKey('monthF') + "(" + i18n.getKey('year') + "/" + i18n.getKey('month') + ")",
                grid: true,
                width: 200,
                length: 200,
                label: {
                    rotate: {
                        degrees: 0
                    }
                }
            }],
            legend: {position: 'bottom'},
            series: [{
                type: 'column',
                axis: 'left',
                xField: 'month',
                yField: 'money',
                highlight: true,
                style: {
                    //width:30,
                    opacity: 0.93
                },
                //gutter : 100,
                title: i18n.getKey('monthlysale'),
                label: {
                    field: ['money'],
                    display: 'outside',
                    font: ' 18px "Lusida Grande" ',
                    renderer: function (v) {
                        var sale = v + '';
                        var num = sale.indexOf('.') == -1 ? sale.length : sale.indexOf('.');
                        var bb = num % 3 > 0 ? Math.floor(num / 3) + 1 : num / 3;
                        var string = sale;
                        for (var i = 0; i < bb - 1; i++) {
                            var LL = string.indexOf('.') == -1 ? string.length : string.indexOf('.');
                            string = string.substr(0, LL - 3 * (i + 1) - i) + "," + string.substr(LL - 3 * (i + 1) - i);
                        }
                        return "$" + string;
                    }
                }

            }]
        }, {
            xtype: 'chart',
            id: 'chartpie',
            store: store,
            itemId: 'chartpie',
            hidden: true,
            animate: true,
            height: 450,
            //width : 400,
            //maxWidth : 500,
            border: false,
            legend: {
                position: 'bottom'
            },
            shadow: true,
            series: [{
                type: 'pie',
                field: 'money',
                showInLegend: true,
                colorSet: ['#ffff00', '#669900', '#ff6699', '#66cccc', '#6699ff', '#ff3300', '#33ff33', '#00ffff', '#66ff99'],
                label: {
                    field: 'month',
                    contrast: true,
                    color: '#ffff00',
                    renderer: function (v) {
                        return '[' + v + ']';
                    },
                    display: 'middle', //'rotate'
                    font: '18px "Lucida Grande"'
                },
                highlight: {
                    segment: {
                        margin: 10
                    }
                },
                tips: {
                    trackMouse: true,
                    width: 140,
                    height: 34,
                    renderer: function (storeItem) {
                        var total = 0;
                        store.each(function (rec) {
                            total += rec.get('money');
                        });
                        this.setTitle(storeItem.get('month') + ': $' + storeItem.get('money') + '<br>'
                            + Math.round(storeItem.get('money') / total * 100)
                            + '%');
                    }
                }
            }]
        }]
    });
    orderSalesPage.add(panel);

    var startDatefield = orderSalesPage.getComponent('filter').getComponent('startDate');
    var startStr = new Date().format('yyyy') + '-01-01';
    startDatefield.setValue(Ext.Date.parse(startStr, "Y-m-d"));
    orderSalesPage.getComponent('filter').getComponent('endDate').setValue(new Date);

    function loadSaleStore() {

        var startDate = orderSalesPage.getComponent('filter').getComponent('startDate').getValue();
        if (startDate != null) {
            startDate = startDate.format('yyyy-MM-dd');
        }
        var endDate = orderSalesPage.getComponent('filter').getComponent('endDate').getValue();
        if (endDate != null) {
            endDate = endDate.format('yyyy-MM-dd');
        } else {
            endDate = new Date();
            endDate = endDate.format('yyyy-MM-dd');
        }

        var time = Date.parse(endDate) - Date.parse(startDate);

        var status = [];
        status = orderSalesPage.getComponent('filter').getComponent('status').getSubmitValue();
        console.log(status);
        var website = null;
        website = orderSalesPage.getComponent('filter').getComponent('websiteCombo').getSubmitValue();


        if (startDate != null && time > 0) {
            panel.getComponent('chartcolumn').store.load({

                params: {firstYear: startDate, secondYear: endDate, statusId: status, websiteId: website}
            });
        }
    };


});