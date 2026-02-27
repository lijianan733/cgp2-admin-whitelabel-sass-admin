/**
 * @Description:
 * @author nan
 * @date 2022/5/12
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.FeatureBlock',
    'CGP.cmsconfig.store.CmsConfigStore',
    'CGP.cmslog.view.CMSTargetFieldSet'
])
Ext.define('CGP.cmslog.view.PublishProductConfirmWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.publishproductcomfirmwin',
    modal: true,
    constrain: true,
    maximizable: true,
    layout: 'vbox',
    title: i18n.getKey('发布选中产品的最新配置版本CMS配置'),
    width: 800,
    maxHeight: 800,
    controller: Ext.create('CGP.cmslog.controller.Controller'),
    selectedData: null,//待发布的配置
    bbar: {
        xtype: 'bottomtoolbar',
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.getComponent('form');
                if (form.isValid()) {
                    var data = win.controller.getPublishConfig(form);
                    win.controller.publish(data);
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'componentgrid',
                itemId: 'selectedRecordGrid',
                bodyStyle: {
                    borderColor: 'silver',
                },
                flex: 1,
                maxHeight: 350,
                header: {
                    style: 'background-color:white;',
                    color: 'black',
                    title: '<font color=green>' + i18n.getKey('待发布产品') + '</font>',
                    border: '0 0 0 0'
                },
                store: Ext.create('Ext.data.Store', {
                    xtype: 'store',
                    fields: [
                        'name',
                        {
                            name: 'relationOptions',
                            type: 'array'
                        }
                    ],
                    proxy: {
                        type: 'pagingmemory'
                    },
                    data: me.selectedData
                }),
                autoScroll: true,
                componentViewCfg: {
                    multiSelect: false,
                    tableAlign: 'center',
                    actionBarCfg: {
                        hidden: true,
                    },//编辑和删除的区域配置
                    renderer: function (record, view) {
                        var me = this;
                        var rowIndex = record.index;
                        var store = record.store;
                        var page = store.currentPage;
                        if (page > 1) {
                            rowIndex += (page - 1) * store.pageSize;
                        }
                        rowIndex = rowIndex + 1;
                        var productImages = record.raw.productImages;
                        //取小图展示
                        var imageUrl = imageServer + productImages[0]?.small?.name;
                        var preViewUrl = imageUrl + '?width=100&height=100';
                        var displayStr = record.raw.productListDTO.name + '(' + record.raw.productListDTO.id + ')';
                        return {
                            xtype: "panel",
                            width: 175,
                            height: 150,
                            margin: 5,
                            border: 1,
                            itemId: 'container_' + rowIndex,
                            record: record,
                            view: view,
                            autoScroll: true,
                            index: rowIndex,
                            borderColor: 'red',
                            fieldLabel: i18n.getKey('name'),
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            bodyStyle: {
                                borderColor: 'silver',
                            },
                            items: [
                                {
                                    xtype: 'imagecomponent',
                                    src: preViewUrl,
                                    autoEl: 'div',
                                    style: 'cursor: pointer',
                                    width: 100,
                                    height: 100,
                                },
                                {
                                    xtype: 'displayfield',
                                    value: displayStr,
                                    width: 170,
                                    fieldStyle: {
                                        textAlign: 'center'
                                    }
                                }
                            ]
                        };
                    }
                },
                tbarCfg: {
                    hidden: true,
                },
                filterCfg: {
                    hidden: true,
                },
                diyGetValue: function () {
                    var me = this;
                    var productIds = [];
                    var data = me.store.proxy.data;
                    for (var i = 0; i < data.length; i++) {
                        productIds.push(data[i].productListDTO.id)
                    }
                    return productIds;
                }
            },
            {
                xtype: 'errorstrickform',
                header: {
                    style: 'background-color:white;',
                    color: 'black',
                    title: '<font color=green>' + i18n.getKey('可选操作') + '</font>',
                    border: '0 0 0 0'
                },
                width: '100%',
                bodyStyle: {
                    borderColor: 'silver'
                },
                border: false,
                defaults: {
                    margin: '5 25 5 25'
                },
                isValidForItems: true,
                itemId: 'form',
                items: [
                    {
                        xtype: 'checkbox',
                        fieldLabel: i18n.getKey('是否') + i18n.getKey('同时发布产品所属类目'),
                        columns: 2,
                        name: 'publishType',
                        vertical: true,
                        labelWidth: 104,
                        items: [
                            {
                                boxLabel: i18n.getKey('ProductDetail'),
                                name: 'value',
                                inputValue: 'ProductDetail'
                            },
                            {
                                boxLabel: i18n.getKey('ProductCategory'),
                                name: 'value',
                                inputValue: 'ProductCategory',
                                checked: true
                            }
                        ],
                        checked: true,
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getValue();
                            if (data == true) {
                                return ['ProductDetail', 'ProductCategory'];
                            } else {
                                return ['ProductDetail'];
                            }
                        }
                    },
                    {
                        xtype: 'checkboxgroup',
                        fieldLabel: i18n.getKey('productMode'),
                        columns: 2,
                        name: 'statusOfProduct',
                        vertical: true,
                        fieldBodyCls: 'background-color:silver',
                        items: [
                            {
                                boxLabel: i18n.getKey('测试'),
                                name: 'value',
                                inputValue: 'TEST',
                                checked: true
                            },
                            {
                                boxLabel: i18n.getKey('正式'),
                                name: 'value',
                                inputValue: 'RELEASE',
                                checked: true
                            }
                        ],
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var data = field.diyGetValue();
                                var selectedRecordGrid = field.ownerCt.ownerCt.getComponent('selectedRecordGrid');
                                selectedRecordGrid.store.rawData = selectedRecordGrid.store.rawData || Ext.clone(selectedRecordGrid.store.proxy.data);
                                selectedRecordGrid.store.proxy.data = selectedRecordGrid.store.rawData.filter(function (item) {
                                    var mode = item.productListDTO.mode;
                                    return Ext.Array.contains(data, mode);
                                });
                                selectedRecordGrid.store.load();
                                ;
                            }
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getValue().value;
                            if (data) {
                                Ext.isArray(data) ? null : (data = [data])
                                return data;
                            } else {
                                return [];
                            }

                        }
                    },
                    {
                        xtype: 'checkbox',
                        fieldLabel: i18n.getKey('是否通知用户'),
                        columns: 2,
                        labelWidth: 104,
                        name: 'needEmail',
                    },
                    //
                    //发布参数
                    {
                        xtype: 'cms_target_fieldset',
                        name: 'otherConfig',
                        itemId: 'otherConfig',
                    },
                ]
            }
        ];
        me.callParent();
    }
})