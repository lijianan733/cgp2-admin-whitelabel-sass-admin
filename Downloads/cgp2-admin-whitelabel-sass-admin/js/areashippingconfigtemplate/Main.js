/**
 *Created by shirley on 2021/8/28
 * */

Ext.Loader.syncRequire([
    'CGP.areashippingconfigtemplate.store.AreaShippingConfigTemplateStore',
    'CGP.shippingquotationtemplatemanage.store.CountriesStore'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.areashippingconfigtemplate.store.AreaShippingConfigTemplateStore');
    var countriesData = Ext.create('CGP.shippingquotationtemplatemanage.store.CountriesStore');
    // 创建一个GridPage控件
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('areaShippingConfigTemplate'),
        block: 'areashippingconfigtemplate',
        editPage: 'edit.html',
        // 查询输入框
        filterCfg: {
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    hideTrigger: true,
                    allowDecimals: false,
                    fieldLabel: i18n.getKey('id'),
                    isLike: false,
                    itemId: '_id'
                },
                //TODO 当前不支持该查询操作，待优化
                // {
                //     name: 'countryCode',
                //     xtype: 'gridcombo',
                //     fieldLabel: i18n.getKey('countryCode'),
                //     itemId: 'countryCode',
                //     editable: false,
                //     isLike: true,
                //     haveReset: true,
                //     // value: 'id',
                //     displayField: 'isoCode2',
                //     matchFieldWidth: false,
                //     autoScroll: true,
                //     //TODO 确认运费报价模板使用currency进行过滤的条件参数
                //     // 若currency过滤条件为对象，则需修改flter中的type类型
                //     //TODO 待完善
                //     getValue: function () {
                //         var me = this;
                //         if (!Ext.isEmpty(this.value[this.getRawValue()])) {
                //             var data = this.value[this.getRawValue()];
                //             var countryObj = {
                //                 id: data.id,
                //                 clazz: data.clazz
                //             }
                //             return countryObj;
                //         }
                //     },
                //     store: countriesData,
                //     filterCfg: {
                //         layout: {
                //             type: 'column'
                //         },
                //         defaults: {
                //             width: 170,
                //             isLike: false,
                //             padding: 2
                //         },
                //         items: [
                //             {
                //                 xtype: 'numberfield',
                //                 fieldLabel: i18n.getKey('id'),
                //                 name: 'id',
                //                 isLike: false,
                //                 itemId: 'id',
                //                 labelWidth: 40,
                //                 hideTrigger: true
                //             },
                //             {
                //                 xtype: 'textfield',
                //                 fieldLabel: i18n.getKey('name'),
                //                 name: 'name',
                //                 itemId: 'name',
                //                 labelWidth: 40
                //             },
                //             {
                //                 xtype: 'textfield',
                //                 fieldLabel: i18n.getKey('isoCode2'),
                //                 name: 'isoCode2',
                //                 itemId: 'isoCode2',
                //                 labelWidth: 40
                //             }
                //         ]
                //     },
                //     gridCfg: {
                //         height: 300,
                //         width: 400,
                //         viewConfig: {
                //             enableTextSelection: true
                //         },
                //         autoScroll: true,
                //         columns: [
                //             {
                //                 xtype: 'rownumberer',
                //                 width: 50
                //             },
                //             {
                //                 name: '_id',
                //                 text: i18n.getKey('id'),
                //                 width: 80,
                //                 dataIndex: 'id',
                //                 renderer: function (value, metaData) {
                //                     metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                //                     return value;
                //                 }
                //             },
                //             {
                //                 text: i18n.getKey('name'),
                //                 flex: 1,
                //                 dataIndex: 'name',
                //                 renderer: function (value, metaData, record, rowIndex) {
                //                     metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                //                     return value;
                //                 }
                //             },
                //             {
                //                 text: i18n.getKey('isoCode2'),
                //                 flex: 1,
                //                 dataIndex: 'isoCode2',
                //                 renderer: function (value, metaData, record, rowIndex) {
                //                     metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                //                     return value;
                //                 }
                //             },
                //             {
                //                 text: i18n.getKey('isoCode3'),
                //                 flex: 1,
                //                 dataIndex: 'isoCode3',
                //                 renderer: function (value, metaData, record, rowIndex) {
                //                     metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                //                     return value;
                //                 }
                //             }
                //         ],
                //         bbar: Ext.create('Ext.PagingToolbar', {
                //             store: countriesData,
                //         })
                //     }
                // }
            ]
        },
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true,
                    align: 'center',
                    padding: 0,
                    renderer: function (value, metaData, record, rowIndex) {
                        metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('country'),
                    dataIndex: 'areas',
                    xtype: 'gridcolumn',
                    itemId: 'areas',
                    width: 350,
                    sortable: true,
                    align: 'center',
                    renderer: function (value, metaData, record, rowIndex) {
                        var textValueArr = [];
                        value.forEach(function (value) {
                            var textValue = value['countryCode'];
                            if (!Ext.isEmpty(value['zoneCode'])) {
                                var textValue = textValue + '(' + value['zoneCode'] + ')';
                            }
                            ;
                            textValueArr.push(textValue);
                        });
                        metaData.tdAttr = 'data-qtip="' + "<div>" + textValueArr.join(',') + "</div>" + '"';
                        // TODO 判断字符长长度，显示“more”按钮添加弹框提示，待完善

                        return textValueArr.join(',');
                    }
                },
                {
                    text: i18n.getKey('areaQtyShippingConfigs'),
                    flex: 1,
                    align: 'center',
                    menuDisabled: true,
                    dataIndex: 'areaQtyShippingConfigs',
                    store: Ext.create('Ext.data.Store', {
                        fields: [{
                            name: 'firstQty',
                            type: 'int'
                        }, {
                            name: 'firstPrice',
                            type: 'double'
                        }, {
                            name: 'additionalQty',
                            type: 'int'
                        }, {
                            name: 'additionalPrice',
                            type: 'double'
                        }, {
                            name: 'abc',
                            type: 'double'
                        }, {
                            name: 'www',
                            type: 'double'
                        }],
                        proxy: {
                            type: 'memory',
                        }
                    }),
                    columns: [
                        {
                            text: i18n.getKey('firstQty'),
                            width: 120,
                            align: 'center',
                            style: {
                                padding: 0,
                            },
                            innerCls: 'areaQtyShippingConfigs-inner',
                            sortable: true,
                            menuDisabled: true,
                            renderer: function (value, metaData, record, rowIndex) {
                                var firstQtyArray = [];
                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                areaQtyShippingConfigsData.forEach(function (item) {
                                    var temp = '<div class="areaQtyShippingConfigs-td">' + item['firstQty'] + '</div>'
                                    firstQtyArray.push(temp);
                                });
                                return '<div class="areaQtyShippingConfigs-container">' + firstQtyArray.join('') + '</div>';
                            }
                        },
                        {
                            text: i18n.getKey('firstPrice'),
                            width: 120,
                            align: 'center',
                            sortable: true,
                            menuDisabled: true,
                            innerCls: 'areaQtyShippingConfigs-inner',
                            renderer: function (value, metaData, record, rowIndex) {
                                var firstQtyArray = [];
                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                areaQtyShippingConfigsData.forEach(function (item) {
                                    var temp = '<div class="areaQtyShippingConfigs-td">' + item['firstPrice'] + '</div>'
                                    firstQtyArray.push(temp);
                                });
                                return '<div class="areaQtyShippingConfigs-container">' + firstQtyArray.join('') + '</div>';
                            }
                        },
                        {
                            text: i18n.getKey('additionalQty'),
                            width: 120,
                            align: 'center',
                            padding: 0,
                            sortable: false,
                            menuDisabled: true,
                            innerCls: 'areaQtyShippingConfigs-inner',
                            renderer: function (value, metaData, record, rowIndex) {
                                var firstQtyArray = [];
                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                areaQtyShippingConfigsData.forEach(function (item) {
                                    var temp = '<div class="areaQtyShippingConfigs-td">' + item['additionalQty'] + '</div>'
                                    firstQtyArray.push(temp);
                                });
                                return '<div class="areaQtyShippingConfigs-container">' + firstQtyArray.join('') + '</div>';
                            }
                        },
                        {
                            text: i18n.getKey('additionalPrice'),
                            width: 120,
                            align: 'center',
                            flex: 1,
                            sortable: true,
                            menuDisabled: true,
                            innerCls: 'areaQtyShippingConfigs-inner',
                            renderer: function (value, metaData, record, rowIndex) {
                                var firstQtyArray = [];
                                var areaQtyShippingConfigsData = record.data.areaQtyShippingConfigs;
                                areaQtyShippingConfigsData.forEach(function (item) {
                                    var temp = '<div class="areaQtyShippingConfigs-td">' + item['additionalPrice'] + '</div>'
                                    firstQtyArray.push(temp);
                                });
                                return '<div class="areaQtyShippingConfigs-container">' + firstQtyArray.join('') + '</div>';
                            }
                        }]
                }
            ]
        },

    });
});

