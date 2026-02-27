/**
 * Created by nan on 2021/1/20
 * 背景图的误差范围
 */
Ext.define('CGP.buildercommonresource.view.BgSizeDefferenceGrid', {
    extend: 'Ext.ux.grid.GridWithCRUD',
    alias: 'widget.bgsizedefferencegrid',
    width: 600,
    winTitle: i18n.getKey('allowableDeviation') + i18n.getKey('config'),
    height: 500,
    itemId: 'testDateGrid',
    winConfig: {
        formConfig: {
            items: [
                {
                    name: 'isEqualTo',
                    itemId: 'isEqualTo',
                    xtype: 'checkbox',
                    fieldLabel: i18n.getKey('能否等于最大误差值')
                },
                {
                    name: 'difference',
                    itemId: 'difference',
                    xtype: 'numberfield',
                    allowDecimals: true,
                    fieldLabel: i18n.getKey('adeviation')
                },
                {
                    xtype: 'combo',
                    name: 'unit',
                    fieldLabel: i18n.getKey('unit'),
                    itemId: 'unit',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'cm',
                                display: i18n.getKey('cm')
                            },
                            {
                                value: 'mm',
                                display: i18n.getKey('mm')
                            },
                            {
                                value: 'in',
                                display: i18n.getKey('in')
                            }
                        ]
                    }),
                    listeners: {
                        'afterrender': function () {
                            var combo = this;
                            var win = combo.ownerCt.ownerCt;
                            if (win.record) {
                                combo.setFieldStyle('background-color: silver');
                                combo.setReadOnly(true);
                            }
                        },
                        expand: function () {
                            var combo = this;
                           ;
                            //排除掉已经添加的数据
                            var outGridStore = combo.ownerCt.ownerCt.outGrid.store;
                            var excludeStr = outGridStore.data.keys;
                            combo.store.filter([
                                {
                                    filterFn: function (item) {
                                        if (Ext.Array.contains(excludeStr, item.get('value'))) {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                }
                            ]);
                        }
                    },
                    editable: false,
                    valueField: 'value',
                    displayField: 'display'
                },
                {
                    name: 'decimalPrecision',
                    itemId: 'decimalPrecision',
                    xtype: 'numberfield',
                    minValue: 0,
                    fieldLabel: i18n.getKey('accuracy') + '(小数点后位数)'
                },
                {
                    name: 'clazz',
                    itemId: 'clazz',
                    xtype: 'textfield',
                    hidden: true,
                    value: 'com.qpp.cgp.domain.common.resource.BackgroundSizeDifferenceConfig'
                },
            ],
        }
    },
    columns: [
        {
            dataIndex: 'difference',
            text: i18n.getKey('误差值'),
        },
        {
            dataIndex: 'unit',
            width: 150,
            text: i18n.getKey('unit'),
            renderer: function (value) {
                var mapping = {
                    'cm': i18n.getKey('cm'),
                    'mm': i18n.getKey('mm'),
                    'in': i18n.getKey('in'),
                }
                return mapping[value];
            }
        },
        {
            dataIndex: 'isEqualTo',
            width: 150,
            text: i18n.getKey('能否等于最大误差值'),
        },
        {
            dataIndex: 'decimalPrecision',
            flex: 1,
            text: i18n.getKey('精确到小数点后几位'),
        }
    ],
    saveHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        var dataArr = [];
        if (form.isValid()) {
            var data = {};
            form.items.items.forEach(function (item) {
                if (item.disabled == false) {
                    data[item.getName()] = item.getValue();
                }
            });
            console.log(data);
            win.outGrid.store.data.items.forEach(function (item) {
                dataArr.push(item.getData());
            });
            if (win.createOrEdit == 'create') {
                dataArr.push(data);
            } else {
                var index = win.record.index;
                dataArr[index] = data;
            }
            var controller = Ext.create('CGP.buildercommonresource.controller.Controller');
            controller.saveBGSizeDifference({
                bgSizeDifference: dataArr
            }, win.outGrid);
            win.close();
        }
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: [
                'unit',//单位
                'difference',//误差值
                'isEqualTo',//是否等于误差值
                'decimalPrecision',//小数点后几位，拿来比较,
                'clazz'
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/commonbuilderresourceconfigs/V2/bgSizeDifference',
                reader: {
                    idProperty: 'unit',
                    type: 'json',
                    root: 'data'
                }
            },
        });
        me.bbar = {//底端的分页栏
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息s
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        };
        me.callParent();
    }
})