/**
 * @Description:类目页发布的弹窗
 * @author nan
 * @date 2022/8/29
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.CMSTargetFieldSet'
])
Ext.define('CGP.cmslog.view.PublishNormalPageConfirmWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.publishnormalpageconfirmwin',
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
                    title: '<font color=green>' + i18n.getKey('待发普通页') + '</font>',
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
                                value: record.raw._id
                            },
                            {
                                title: i18n.getKey('html') + i18n.getKey('pageName'),
                                value: record.raw.pageName
                            },
                            {
                                title: i18n.getKey('pageTitle'),
                                value: record.raw.pageTitle
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
                    var CMSConfigIds = [];
                    var data = me.store.proxy.data;
                    for (var i = 0; i < data.length; i++) {
                        CMSConfigIds.push(data[i]._id)
                    }
                    return CMSConfigIds;
                }
            },
            {
                xtype: 'errorstrickform',
                width: '100%',
                border: false,
                defaults: {
                    margin: '5 25 5 25'
                },
                itemId: 'form',
                header: {
                    style: 'background-color:white;',
                    color: 'black',
                    title: '<font color=green>' + i18n.getKey('可选操作') + '</font>',
                    border: '0 0 0 0'
                },
                items: [
                    {
                        xtype: 'checkbox',
                        fieldLabel: i18n.getKey('是否通知用户'),
                        columns: 2,
                        labelWidth: 104,
                        name: 'needEmail',
                    },

                    {
                        xtype: 'hiddenfield',
                        name: 'publishType',
                        diyGetValue: function () {
                            return ['Normal']
                        }
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