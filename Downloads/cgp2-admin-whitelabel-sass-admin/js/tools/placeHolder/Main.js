/**
 *
 */
Ext.define('CGP.tools.placeHolder.Main', {
    extend: 'Ext.panel.Panel',
    itemId: 'placeHolderForm',
    layout: {
        type: 'table',
        columns: 1
    },
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 1100
    },
    items: [
        {
            xtype: 'uxfieldset',
            itemId: 'svgSet',
            collapsible: false,
            header: false,
            padding: '10',
            defaultType: 'displayfield',
            style: {
                borderRadius: '8px'
            },
            legendItemConfig: {
                disabledBtn: {
                    hidden: true,
                    disabled: true,
                    isUsable: true,//初始化时，是否是禁用

                },
                deleteBtn: {
                    hidden: true,
                    disabled: true
                }
            },
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('SVG') + '</font>',
            // extraButtons: {
            //     addBtn: {
            //         xtype: 'button',
            //         itemId: 'add',
            //         iconCls: 'icon_add',
            //         tooltip: '添加',
            //         margin: '-2 0 0 5',
            //         componentCls: 'btnOnlyIcon',
            //         handler: function (btn) {
            //             var fieldSet = btn.ownerCt.ownerCt;
            //             var controller = Ext.create('CGP.jobconfig.view.impressiondistributeconfig.controller.Controller');
            //             var impressionData = fieldSet.ownerCt.ownerCt.impressionData;
            //             controller.selectSheet(fieldSet.ownerCt, fieldSet, impressionData);
            //         }
            //     }
            // },
            items: [
                {
                    xtype: 'textarea',
                    id: "txtSvg",
                    rows: 20,
                    cols: 150
                }
            ]
        },
        {
            xtype: 'uxfieldset',
            itemId: 'attributeSet',
            collapsible: true,
            padding: '10',
            defaultType: 'displayfield',
            style: {
                borderRadius: '8px'
            },
            legendItemConfig: {
                disabledBtn: {
                    hidden: true,
                    disabled: true,
                    isUsable: true,//初始化时，是否是禁用
                },
                deleteBtn: {
                    hidden: true,
                    disabled: true
                }
            },
            title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('属性操作') + '</font>',
            extraButtons: {
                addBtn: {
                    xtype: 'button',
                    itemId: 'add',
                    iconCls: 'icon_add',
                    tooltip: '添加',
                    margin: '-2 0 0 5',
                    componentCls: 'btnOnlyIcon',
                    handler: function (btn) {
                        // var fieldSet = btn.ownerCt.ownerCt;
                        // var controller = Ext.create('CGP.jobconfig.view.impressiondistributeconfig.controller.Controller');
                        // var impressionData = fieldSet.ownerCt.ownerCt.impressionData;
                        // controller.selectSheet(fieldSet.ownerCt, fieldSet, impressionData);
                    }
                }
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'combo',
                            name: "operateType",
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'display',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'display'],
                                data: [
                                    {"display": "add", "name": i18n.getKey('添加')},
                                    {"display": "delete", "name": i18n.getKey('删除')}
                                ]
                            })
                        },

                    ]
                },

            ]
        }
    ],
    initComponent: function () {
        var me = this;

        me.callParent();
    }
})