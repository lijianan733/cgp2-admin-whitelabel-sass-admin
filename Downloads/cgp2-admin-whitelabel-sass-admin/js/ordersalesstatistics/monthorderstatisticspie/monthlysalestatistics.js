Ext.onReady(function () {
    // 为了第一次加载完页面后执行loadSaleStore（）方法来填充页面下的图表。
    // 只有当websiteStore和statusStore加载完后，页面才显示完整。 且只执行一次。
    // 下面两个变量是检测， 两个store是否加载完了。加载完了就执行loadSaleStore（）
    var testWebStore = false;
    var testStatusStore = false;
    var onlyfirst = true;


    Ext.create('CGP.common.store.OrderStatuses', {
        storeId: "orderStatusStore",
        autoLoad: true,
        allowNull: false,
    });


    /**
     *  创建 switchStore
     */
    Ext.create('Ext.data.Store', {
        storeId: 'switchStore',
        fields: [{
            name: 'name', type: 'string'
        }, {
            name: 'value', type: 'string'
        }],
        data: [
            {name: 'Column Chart', value: 'column'},
            {name: 'Line Chart', value: 'line'},
            {name: 'Pie Chart', value: 'pie'}
        ]
    })

    /**
     *  整个   订单销售月统计   页面的viewPort
     */
    var orderSalesPage = Ext.create('Ext.container.Viewport', {
        id: 'monthStatisticsChart',
        height: '100%',
        layout: 'border',
        items: [{
            itemId: 'filter',
            region: 'north',
            xtype: 'uxfilter',
            searchActionHandler: loadSaleStore,
            items: [{
                name: 'firstYear',
                xtype: 'combo',
                forceSelection: true,
                fieldLabel: i18n.getKey('firstYear'),
                store: Ext.data.StoreManager.lookup("yearStore"),
                queryMode: 'local',
                displayField: 'year',
                valueField: 'year',
                itemId: 'firstYear',
                listeners: {
                    afterrender: function (me) {
                        var date = new Date();
                        me.setValue(Ext.Date.dateFormat(date, "Y"));
                    }
                }
            }, {

                name: 'status',
                xtype: 'gridcombo',
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
                pickerAlign: 'bl',
                gridCfg: {
                    store: Ext.data.StoreManager.lookup('orderStatusStore'),
                    selModel: new Ext.selection.CheckboxModel({
                        checkOnly: true
                    }),
                    hideHeaders: true,
                    height: 200,
                    columns: [{
                        text: i18n.getKey('name'),
                        width: 130,
                        dataIndex: 'name'
                    }]
                },
                listeners: {
                    afterrender: function (combo) {
                        var store = combo.store;
                        store.on('load', function () {
                            this.insert(0, {
                                id: null,
                                name: 'All Status'
                            });
                            combo.setValue({id: null, name: store.getAt(0).get('name')});
                            // 为了第一次加载下面的图表。
                            if (onlyfirst) {
                                onlyfirst = false;
                                loadSaleStore();
                            }
                        });
                    }
                }
            }]
        }, {
            region: 'center',
            title: i18n.getKey('monthsalesitepercentage'),
            xtype: 'form',
            itemId: 'center',
            autoScroll: true,
            items: [{
                xtype: 'displayfield',
                fieldLabel: '图表介绍',
                labelWidth: 70,
                itemId: 'introduction',
                style: 'marginLeft : 50px',
                value: ""
            }, {
                xtype: 'displayfield',
                fieldLabel: '查询条件',
                labelWidth: 70,
                itemId: 'display',
                style: 'marginLeft : 50px',
                value: ""
            }]
        }]
    });

    /**
     * js date格式化 format方法
     *
     */
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

    /**
     *  点击 查询 触发
     *  第一 根据不同的图表,产生不同的model,
     *  再新建一个新store 插入查询条件。 再load（）
     *   注意（不同的图表返回的数据格式不同）
     *  在 load之后新建 图表， 删除其他的图表
     *  加入到center的 items子组建中
     */
    function loadSaleStore() {
        var filter = orderSalesPage.getComponent('filter');
        var firstYearField = filter.getComponent('firstYear').getValue();
        var statusField = filter.getComponent('status').getSubmitValue();
        statistics.columnChart.createPieChart(firstYearField, statusField);
    };

});