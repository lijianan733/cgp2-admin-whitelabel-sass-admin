/**
 * Created by nan on 2021/10/21.
 */
Ext.Loader.syncRequire([
    'CGP.areaamountrule.model.AreaAmountRuleModel',
    'CGP.areaamountrule.view.AreaFieldSet'
])
Ext.onReady(function () {
    var configStore = Ext.create('Ext.data.Store', {
        pageSize: 15,
        proxy: {
            type: 'pagingmemory'
        },
        fields: [
            {
                name: '_id',
                type: 'string'
            },
            {
                name: 'ratioOrLiteral',
                type: 'boolean'
            },
            {
                name: 'value',
                type: 'string'
            },
            {
                name: 'area',
                type: 'object'
            }],
        data: []
    });
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'areaamountrule',
        i18nblock: i18n.getKey('areaAmountRule'),
        gridPage: 'main.html',
        formCfg: {
            layout: {
                type: 'vbox'
            },
            fieldDefaults: {
                width: 450,
                allowBlank: false,
                labelAlign: 'left'
            },
            model: 'CGP.areaamountrule.model.AreaAmountRuleModel',
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('_id'),
                    allowBlank: true,
                    hidden: true,
                    itemId: '_id'
                },
                {
                    name: 'clazz',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('clazz'),
                    allowBlank: true,
                    hidden: true,
                    value: 'com.qpp.cgp.domain.adjust.ProductAdjustAmount',
                    itemId: 'clazz'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                    itemId: 'name'
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    allowBlank: true,
                    itemId: 'description'
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    itemId: 'areaAdjustAmounts',
                    name: 'areaAdjustAmounts',
                    fieldLabel: i18n.getKey('areaAmountRule'),
                    minHeight: 100,
                    maxHeight: 450,
                    width: 700,
                    gridConfig: {
                        store: configStore,
                        columns: [
                            {
                                dataIndex: 'area',
                                width: 220,
                                text: i18n.getKey('area'),
                                renderer: function (value, mateData, record) {
                                    return value.country.name + ' ' + (value.state ? value.state.name : "") + ' ' + (value.city ? value.city : '');
                                }
                            },
                            {
                                dataIndex: 'price',
                                flex: 1,
                                text: i18n.getKey('price'),
                                renderer: function (value, mateData, record) {
                                    var value = record.get('value');
                                    var ratioOrLiteral = record.get('ratioOrLiteral');
                                    var data = [];
                                    if (!ratioOrLiteral) {
                                        data = [
                                            {
                                                title: i18n.getKey('type'),
                                                value: '指定价格'
                                            },
                                            {
                                                title: i18n.getKey('price'),
                                                value: value
                                            }
                                        ]
                                    } else {
                                        data = [
                                            {
                                                title: i18n.getKey('type'),
                                                value: '原价倍率'
                                            },
                                            {
                                                title: i18n.getKey('倍率'),
                                                value: value
                                            }
                                        ]
                                    }
                                    return JSCreateHTMLTable(data)
                                }
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: configStore
                        }
                    },
                    valueSource: 'storeProxy',//’storeData‘,'storeProxy',规定getSubmitValue时，时从store.items还是从store.proxy.data中获取数据
                    winConfig: {
                        formConfig: {
                            saveHandler: function (btn) {
                                //修改,和新建时对数据进行校验，禁止地区有重复数据
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                if (form.isValid()) {
                                    var data = {};
                                    data = form.getValue();
                                    console.log(data);
                                    win.outGrid.store.proxy.data ? null : win.outGrid.store.proxy.data = [];
                                    var proxyData = win.outGrid.store.proxy.data;
                                    var area = data.area;
                                    var isExtra = false;
                                    for (var i = 0; i < proxyData.length; i++) {
                                        if (win.createOrEdit == 'edit') {//编辑时跳过当前自己这条配置
                                            if (win.record.index == i) {
                                                continue;
                                            }
                                        }
                                        if (proxyData[i].area.country.id == area.country.id) {//country不为空
                                            if (area.state && proxyData[i]?.area?.state?.id == area?.state?.id) {//state不为空
                                                if (area.city && proxyData[i].area.city == area.city) {//city不为空
                                                    isExtra = true;
                                                } else if (Ext.isEmpty(area.city) && Ext.isEmpty(proxyData[i].area.city)) {//city都为空
                                                    isExtra = true;
                                                }
                                            } else if (Ext.isEmpty(area.state) && Ext.isEmpty(proxyData[i].area.state)) {//state为空
                                                if (area.city && proxyData[i].area.city == area.city) {//city不为空
                                                    isExtra = true;
                                                } else if (Ext.isEmpty(area.city) && Ext.isEmpty(proxyData[i].area.city)) {//city都为空
                                                    isExtra = true;
                                                }
                                            }
                                        }
                                    }
                                    if (isExtra) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('已存在相同区域的配置'));
                                        return;
                                    }
                                    if (win.createOrEdit == 'create') {
                                        win.outGrid.store.proxy.data.push(data);
                                    } else {
                                        win.outGrid.store.proxy.data[win.record.index] = data;
                                    }
                                    win.outGrid.store.load();
                                    win.close();
                                }

                            },
                            items: [
                                {
                                    xtype: 'combo',
                                    name: 'ratioOrLiteral',
                                    fieldLabel: i18n.getKey('config') + i18n.getKey('type'),
                                    allowBlank: false,
                                    itemId: 'ratioOrLiteral',
                                    editable: false,
                                    valueField: 'value',
                                    displayField: 'display',
                                    value: true,
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: false,
                                                display: i18n.getKey('固定价格')
                                            }, {
                                                value: true,
                                                display: i18n.getKey('原价倍率')
                                            }
                                        ]
                                    },
                                    listeners: {
                                        change: function (combo, newValue, oldValue) {
                                            var form = combo.ownerCt;
                                            var ratio = form.getComponent('ratio');
                                            var literal = form.getComponent('literal');
                                            literal.setVisible(!newValue);
                                            literal.setDisabled(newValue);
                                            ratio.setVisible(newValue);
                                            ratio.setDisabled(!newValue);
                                        }
                                    }
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'literal',
                                    name: 'value',
                                    hideTrigger: true,
                                    allowBlank: false,
                                    fieldLabel: i18n.getKey('price')
                                },
                                {
                                    xtype: 'numberfield',
                                    itemId: 'ratio',
                                    name: 'value',
                                    hideTrigger: true,
                                    allowBlank: false,
                                    hidden: true,
                                    disabled: true,
                                    fieldLabel: i18n.getKey('倍率')
                                },
                                {
                                    xtype: 'area_fieldset',
                                    name: 'area',
                                    itemId: 'area',
                                    title: i18n.getKey('area'),
                                }
                            ]
                        }
                    }
                }
            ]
        },
    })
});
