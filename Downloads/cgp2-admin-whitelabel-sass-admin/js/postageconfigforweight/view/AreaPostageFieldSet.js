/**
 * @Description:
 * @author nan
 * @date 2023/9/13
 */
Ext.Loader.syncRequire([
    'CGP.postageconfigforweight.view.AreaFieldSet'
])
Ext.define('CGP.postageconfigforweight.view.AreaPostageFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.area_postage_fieldset',
    legendItemConfig: {
        deleteBtn: {
            hidden: false,
            disabled: false
        }
    },
    width: 1200,
    extraButtons: {
        copyBtn: {
            xtype: 'button',
            iconCls: 'icon_copy',
            margin: '-2 0 0 5',
            tooltip: '复制配置',
            componentCls: 'btnOnlyIcon',
            itemId: 'copyBtn',
            handler: function (btn) {
                var uxfieldset = btn.ownerCt.ownerCt;
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('确定复制当前配置?'), function (selector) {
                    if (selector == 'yes') {
                        var data = uxfieldset.getValue();
                        var uxfieldContainer = uxfieldset.ownerCt;
                        var fieldset = uxfieldContainer.add({
                            xtype: 'area_postage_fieldset',
                            title: '区域规则',
                            initData: data,
                        });
                    }
                })
            }
        },
    },
    layout: {
        type: 'vbox'
    },
    collapsible: true,
    defaults: {
        width: '100%',
        margin: '5 25'
    },
    initData: null,
    diySetValue: function (data) {
        var me = this;
        me.initData = data;
        if (data) {
            me.setValue(data);
        }
    },
    diyGetValue: function () {
        var me = this;
        if (me.rendered == false) {
            return me.initData;
        } else {
            return me.getValue();
        }
    },
    buildAreaTitle: function (area) {
        var me = this;
        var data = area;
        var arr = [];
        data?.countryCode ? arr.push(data.countryCode) : null;
        data?.stateCode ? arr.push(data.stateCode) : null;
        data.city ? arr.push(data.city) : null;
        return (arr.join(' - '));
    },
    initComponent: function () {
        var me = this;
        if (me.initData) {
            var title = me.buildAreaTitle(me.initData.area);
            me.title = title;
        }
        me.callParent(arguments);
        if (me.initData) {
            me.on('afterrender', function () {
                me.diySetValue(me.initData);

            })
        }
    },
    items: [
        {
            xtype: "area_fieldset",
            layout: {
                type: 'hbox',
            },
            name: 'area',
            height: 60,
            itemId: 'area',
            defaults: {
                width: 350,
                margin: '5 0 5 0',
            },
            listeners: {
                afterrender: function () {
                    var areaFieldset = this;
                    var AreaPostageFieldSet = areaFieldset.ownerCt;
                    areaFieldset.items.items.map(function (item) {
                        item.on('change', function (field, newValue, oldValue) {
                            var data = areaFieldset.getValue();
                            var title = AreaPostageFieldSet.buildAreaTitle(data);
                            AreaPostageFieldSet.setTitle(title);
                        })
                    });
                }
            }
        },
        {
            xtype: 'gridfieldwithcrudv2',
            allowBlank: false,
            fieldLabel: i18n.getKey('重量计费规则'),
            name: 'weightBasedPostageRules',
            itemId: 'weightBasedPostageRules',
            minHeight: 100,
            margin: '15 25 50 25',
            labelAlign: 'top',
            gridConfig: {
                minHeight: 150,
                store: {
                    xtype: 'store',
                    fields: [
                        'startWeight', 'endWeight', 'firstWeight', 'firstFee',
                        'plusWeight', 'plusFee', 'extraFeeRate', 'amountPromotion', 'promotion'
                    ],
                    data: []
                },
                plugins: [{ptype: 'cellediting', clicksToEdit: 2}],
                columns: [
                    {
                        dataIndex: 'startWeight',
                        text: i18n.getKey('重量范围(g)'),
                        width: 350,
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, metaData, record) {
                            return record.get('startWeight') + ' ~ ' + record.get('endWeight');
                        }
                    }, {
                        dataIndex: 'firstWeight',
                        text: i18n.getKey('首重(g)'),
                        sortable: false,
                        menuDisabled: true,
                        editor: {
                            xtype: 'numberfield',
                            msgTarget: 'none',
                            hideTrigger: true,
                            width: '100%',
                            allowBlank: false,
                            allowExponential: true,
                            decimalPrecision: 2,
                            minValue: 0,
                        },
                    }, {
                        dataIndex: 'firstFee',
                        text: i18n.getKey('首重价格'),
                        sortable: false,
                        menuDisabled: true,
                        editor: {
                            xtype: 'numberfield',
                            msgTarget: 'none',
                            hideTrigger: true,
                            width: '100%',
                            allowBlank: false,
                            allowExponential: true,
                            decimalPrecision: 2,
                            minValue: 0,
                        },
                    }, {
                        dataIndex: 'plusWeight',
                        width: 200,
                        flex: 1,
                        sortable: false,
                        menuDisabled: true,
                        text: i18n.getKey('续重规则(g/费用)'),
                        renderer: function (value, metaData, record) {
                            if (value) {
                                return '每多' + record.get('plusWeight') + 'g;多付' + record.get('plusFee');
                            }
                        }
                    },/* {
                        dataIndex: 'extraFeeRate',
                        text: i18n.getKey('特殊费用比例'),
                    }, {
                        dataIndex: 'amountPromotion',
                        text: i18n.getKey('优惠指定金额')
                    }, {
                        dataIndex: 'promotion',
                        text: i18n.getKey('优惠指定折扣'),
                        flex: 1,
                    }*/],
            },
            winConfig: {
                formConfig: {
                    xtype: 'form',
                    width: 500,
                    minHeight: 220,
                    isValidForItems: false,
                    saveHandler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = form.ownerCt;
                        if (form.isValid()) {
                            var data = {};
                            data = form.getValue();
                            win.outGrid.store.proxy.data ? null : win.outGrid.store.proxy.data = [];
                            var arr = win.outGrid.store.proxy.data;
                            var lastRecord = arr[(win.record ? win.record.index : arr.length) - 1];
                            var nextRecord = arr[(win.record ? win.record.index : arr.length) + 1]
                            var isValidRange = form.validateRange(lastRecord, nextRecord, data);
                            var callback = function () {
                                if (win.createOrEdit == 'create') {
                                    win.outGrid.store.proxy.data.push(data);
                                } else {
                                    win.outGrid.store.proxy.data[win.record.index] = data;
                                }
                                //排序startWeight
                                win.outGrid.store.proxy.data = win.outGrid.store.proxy.data.sort(function (a, b) {
                                    return a.startWeight - b.startWeight;
                                });
                                win.outGrid.store.load();
                                win.close();
                            }
                            if (isValidRange == false) {
                                Ext.Msg.confirm(i18n.getKey('prompt'), '当前重量范围和其他记录冲突,是否确定继续添加或修改?', function (selector) {
                                    if (selector == 'yes') {
                                        callback();
                                    }
                                })
                            } else {
                                callback();
                            }
                        }
                    },
                    getValue: function () {
                        var me = this;
                        var data = me.form.getValues();
                        var extraRule = me.getComponent('extraRule');
                        if (extraRule.collapsed == true) {
                            delete data.plusWeight;
                            delete data.plusFee;
                        }
                        return data;
                    },
                    isValid: function () {
                        var me = this;
                        var isValid = true;
                        for (var i = 0; i < me.items.items.length; i++) {
                            var item = me.items.items[i];
                            if (item.isValid() == false) {
                                isValid = false;
                            }
                        }
                        return isValid;
                    },
                    setValue: function (data) {
                        var me = this;
                        return me.form.setValues(data);
                    },
                    //和上一条和下一条比较
                    validateRange: function (lastRecord, nextRecord, data) {
                        //对数据进行校验,判断是否有重叠区域,  结束<开始<开始， 结束<开始
                        var isValid = true;
                        if (lastRecord) {
                            if (data.startWeight > lastRecord.endWeight) {
                            } else {
                                isValid = false
                            }
                        }
                        if (nextRecord) {
                            if (data.startWeight < nextRecord.startWeight && data.endWeight < nextRecord.startWeight) {

                            } else {
                                isValid = false
                            }
                        }
                        return isValid;
                    },
                    layout: {
                        type: 'vbox',
                    },
                    defaults: {
                        xtype: 'numberfield',
                        msgTarget: 'none',
                        margin: '5 25',
                        hideTrigger: true,
                        width: '100%',
                        allowBlank: false,
                        allowExponential: false,
                        decimalPrecision: 2,
                        minValue: 0,
                    },
                    items: [
                        {
                            xtype: 'uxfieldcontainer',
                            fieldLabel: '重量范围(g)',
                            layout: {
                                type: 'hbox'
                            },
                            width: '100%',
                            labelAlign: 'left',
                            defaults: {
                                flex: 1,
                                allowBlank: false,
                            },
                            name: 'weightRange',
                            allowBlank: false,
                            itemId: 'weightRange',
                            tipInfo: '产品重量在该范围内都应用该计费规则',
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'startWeight',
                                    itemId: 'min',
                                    emptyText: '最小值',
                                    vtype: 'minAndMax',
                                    margin: '0 5 0 0',
                                    minValue: 0,
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'endWeight',
                                    itemId: 'max',
                                    margin: '0 5 0 0',
                                    emptyText: '最大值',
                                    vtype: 'minAndMax',
                                    minValue: 0,
                                },
                                {
                                    xtype: 'button',
                                    text: 'MAX',
                                    width: 45,
                                    flex: null,
                                    isValid: function () {
                                        var me = this;
                                        return true;
                                    },
                                    toolTip: '设置数量范围的最大值为浏览器允许的最大值',
                                    handler: function (btn) {
                                        var endWeight = btn.ownerCt.getComponent('max');
                                        endWeight.setValue(Number.MAX_VALUE);
                                    }
                                }
                            ]
                        },
                        {
                            fieldLabel: i18n.getKey('首重(g)'),
                            name: 'firstWeight',
                            itemId: 'firstWeight'
                        },
                        {
                            fieldLabel: i18n.getKey('首重费用'),
                            name: 'firstFee',
                            itemId: 'firstFee',
                            tipInfo: '如果整个区间都是一个价格,则将首重设置为一个超出最大范围的值',
                        },
                        {
                            xtype: 'uxfieldset',
                            title: '续重规则(g/费用)',
                            layout: {
                                type: 'hbox'
                            },
                            defaults: {
                                allowBlank: false,
                            },
                            allowBlank: false,
                            itemId: 'extraRule',
                            legendItemConfig: {
                                disabledBtn: {
                                    hidden: false,
                                    disabled: false,
                                    isUsable: false,//初始化时，是否是禁用
                                },
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    emptyText: i18n.getKey('续重重量'),
                                    flex: 1,
                                    minValue: 1,
                                    name: 'plusWeight',
                                    margin: '5 5 5 0',
                                    itemId: 'plusWeight',
                                    allowExponential: true,
                                },
                                {
                                    xtype: 'numberfield',
                                    flex: 1,
                                    minValue: 0,
                                    emptyText: '续重费用',
                                    name: 'plusFee',
                                    margin: '5 0 5 0',
                                    itemId: 'plusFee',
                                    allowExponential: true,
                                },
                            ]
                        },
                        /*  {
                              fieldLabel: i18n.getKey('特殊费用比例'),
                              name: 'extraFeeRate',
                              itemId: 'extraFeeRate'
                          },
                          {
                              fieldLabel: i18n.getKey('优惠指定金额'),
                              name: 'amountPromotion',
                              itemId: 'amountPromotion'
                          },
                          {
                              fieldLabel: i18n.getKey('优惠指定折扣'),
                              name: 'promotion',
                              itemId: 'promotion'
                          }*/
                    ],
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            var win = me.ownerCt;
                            if (Ext.isEmpty(win.record)) {
                                var data = win.outGrid.store.proxy.data;
                                if (data.length > 0) {
                                    var weightRange = me.getComponent('weightRange');
                                    var min = weightRange.getComponent('min');
                                    var max = weightRange.getComponent('max');
                                    var minValue = 0;
                                    var lastRecord = data[data.length - 1];
                                    min.setValue(Number(lastRecord.endWeight) + 0.01);
                                }
                            }
                        }
                    }
                }
            },
        },
    ]
}, function () {
    Ext.apply(Ext.form.field.VTypes, {
        minAndMax: function (val, field) {
            if (field.itemId == 'min') {
                var max = field.ownerCt.getComponent('max');
                if (Ext.isEmpty(max.getValue())) {
                    return true;
                }
                if (val < max.getValue()) {
                    max.clearInvalid()
                    return true;
                } else {
                    return false
                }
            } else {
                var min = field.ownerCt.getComponent('min');
                if (Ext.isEmpty(min.getValue())) {
                    return true;
                }
                if (val > min.getValue()) {
                    min.clearInvalid()
                    return true;
                } else {
                    return false
                }
            }
        },
        minAndMaxText: '最小值必须小于最大值;最大值必须大于最小值,'
    });
})
