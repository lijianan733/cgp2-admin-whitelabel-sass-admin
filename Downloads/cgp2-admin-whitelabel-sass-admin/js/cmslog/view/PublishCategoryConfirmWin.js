/**
 * @Description:类目页发布的弹窗
 * @author nan
 * @date 2022/5/9
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.CMSTargetFieldSet'
])
Ext.define('CGP.cmslog.view.PublishCategoryConfirmWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.publishcategoryconfirmwin',
    modal: true,
    constrain: true,
    maximizable: true,
    layout: 'vbox',
    title: i18n.getKey('发布确认'),
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
                    title: '<font color=green>' + i18n.getKey('待发布类目页') + '</font>',
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
                    actionBarCfg: {
                        hidden: true,
                    },//编辑和删除的区域配置
                    editHandler: function (btn) {
                    },
                    deleteHandler: function (btn) {
                    },
                    renderer: function (record, view) {
                        var me = this;
                        var rowIndex = record.index;
                        var store = record.store;
                        var page = store.currentPage;
                        if (page > 1) {
                            rowIndex += (page - 1) * store.pageSize;
                        }
                        var displayData = [
                            {
                                title: i18n.getKey('id'),
                                value: record.raw.id
                            },
                            {
                                title: i18n.getKey('name'),
                                value: record.raw.name
                            },
                            {
                                title: i18n.getKey('type'),
                                value: record.raw.showAsProductCatalog ? '<font color="orange">产品类目</font>' : '<font color="green">营销类目</font>'
                            },

                        ];
                        rowIndex = rowIndex + 1;
                        return {
                            xtype: "panel",
                            width: 200,
                            height: 100,
                            border: 1,
                            margin: 5,
                            itemId: 'container_' + rowIndex,
                            record: record,
                            view: view,
                            index: rowIndex,
                            borderColor: 'red',
                            fieldLabel: i18n.getKey('name'),
                            layout: {
                                type: 'vbox',
                                pack: 'center',
                                align: 'center'
                            },
                            bodyStyle: {
                                borderColor: 'silver',
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    value: JSCreateHTMLTable(displayData),
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
                    var categoryId = [];
                    var data = me.store.proxy.data;
                    for (var i = 0; i < data.length; i++) {
                        categoryId.push(data[i].id)
                    }
                    return categoryId;
                }
            },
            {
                xtype: 'errorstrickform',
                width: '100%',
                border: false,
                defaults: {
                    margin: '5 25 5 25'
                },
                header: {
                    style: 'background-color:white;',
                    color: 'black',
                    title: '<font color=green>' + i18n.getKey('可选操作') + '</font>',
                    border: '0 0 0 0'
                },
                itemId: 'form',
                flex: 1,
                items: [
                    /*  {
                          xtype: 'checkbox',
                          fieldLabel: i18n.getKey('是否') + i18n.getKey('同时发布类目下所有产品'),
                          columns: 2,
                          name: 'publishType',
                          vertical: true,
                          labelWidth: 104,
                          diyGetValue: function () {
                              var me = this;
                              var data = me.getValue();
                              if (data == true) {
                                  return ['ProductDetail', 'ProductCategory'];
                              } else {
                                  return ['ProductCategory'];
                              }
                          },
                          listeners: {
                              change: function (field, newValue, oldValue) {
                                  var form = field.ownerCt;
                                  form.getComponent('statusOfProduct').setVisible(newValue == true)
                              }
                          }
                      },*/
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('发布模式'),
                        name: 'publishType',
                        valueField: 'value',
                        displayField: 'display',
                        width: 350,
                        labelWidth: 104,
                        value: 'ProductDetail',
                        editable: false,
                        store: {
                            xtype: 'store',
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                /*      //现在只能发布类目下产品
                                      {
                                          value: 'ProductDetail,ProductCategory',
                                          display: '同时发布类目和类目下的产品'
                                      },
                                      {
                                          value: 'ProductCategory',
                                          display: '只发布类目',
                                      },*/
                                {
                                    value: 'ProductDetail',
                                    display: '发类目下的产品'
                                }
                            ]
                        },
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getValue();
                            return data.split(',');
                        },
                        /*
                                                listeners: {
                                                    change: function (field, newValue, oldValue) {
                                                        var form = field.ownerCt;
                                                        if (newValue == 'ProductCategory') {
                                                            form.getComponent('statusOfProduct').setVisible(false);
                                                        } else {
                                                            form.getComponent('statusOfProduct').setVisible(true);
                                                        }
                                                    }
                                                }
                        */
                    },
                    {
                        xtype: 'checkboxgroup',
                        fieldLabel: i18n.getKey('同时发布的产品模式'),
                        columns: 2,
                        itemId: 'statusOfProduct',
                        name: 'statusOfProduct',
                        width: 350,
                        vertical: true,
                        items: [
                            {
                                boxLabel: i18n.getKey('测试'),
                                name: 'value',
                                width: 100,
                                checked: true,
                                inputValue: 'TEST',
                            },
                            {
                                boxLabel: i18n.getKey('正式'),
                                name: 'value',
                                width: 100,
                                checked: true,
                                inputValue: 'RELEASE',
                            }
                        ],
                        diyGetValue: function () {
                            var me = this;
                            var data = me.getValue().value;
                            if (data) {
                                Ext.isArray(data) ? null : (data = [data])
                                return data;
                            } else {
                                return;
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
                    {
                        xtype: 'cms_target_fieldset',
                        name: 'otherConfig',
                        itemId: 'otherConfig',
                    },
                ]
            }
        ]
        me.callParent();
    }
})