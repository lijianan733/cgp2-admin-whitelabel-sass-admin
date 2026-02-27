/**
 * Created by miao on 2021/8/26.
 */
// Ext.application({
//     requires: [
//         'Ext.container.Viewport',
//         // 'CGP.pagecontentschema.view.Layers'
//     ],
//     name: 'CGP.resource',
//     appFolder: '../../../../app',
//     models: ['FixSizeDisplayObjectConfig'],
//     views: [],
//     controllers: [
//         'FixSizeDisplayObjectConfig'
//     ],
//     launch: function () {
//         Ext.widget({
//             block: 'resource/app/view/compositeDisplayObject/fixSizeDisplayObject',
//             xtype: 'uxeditpage',
//             accessControl: true,
//             gridPage: 'main.html',
//             formCfg: {
//                 model: 'CGP.resource.model.FixSizeDisplayObjectConfig',
//                 remoteCfg: false,
//                 layout: {
//                     layout: 'table',
//                     columns: 1,
//                     tdAttrs: {
//                         style: {
//                             'padding-right': '120px'
//                         }
//                     }
//                 },
//                 items: [
//                     {
//                         name: '_id',
//                         xtype: 'numberfield',
//                         fieldLabel: i18n.getKey('id'),
//                         itemId: '_id',
//                         hidden: true
//                     },
//                     {
//                         name: 'description',
//                         xtype: 'textfield',
//                         fieldLabel: i18n.getKey('description'),
//                         itemId: 'description',
//                         allowBlank: false
//                     },
//                     {
//                         name: 'clazz',
//                         xtype: 'textfield',
//                         fieldLabel: i18n.getKey('clazz'),
//                         itemId: 'clazz',
//                         hidden: true,
//                         value: 'com.qpp.cgp.domain.pcresource.compositedisplayobject.FixSizeDisplayObjectConfig'
//                     },
//                     {
//                         name: 'width',
//                         xtype: 'numberfield',
//                         fieldLabel: i18n.getKey('width'),
//                         itemId: 'width',
//                         allowBlank: false
//                     },
//                     {
//                         name: 'height',
//                         xtype: 'numberfield',
//                         fieldLabel: i18n.getKey('height'),
//                         itemId: 'height',
//                         allowBlank: false
//                     },
//                     {
//                         margin: '0 0 0 50',
//                         xtype: 'displayfield',
//                         labelStyle: 'font-weight: bold',
//                         value: i18n.getKey('element') + i18n.getKey('config'),
//                         itemId: 'information',
//                         fieldStyle: 'color:black;font-weight: bold'
//                     },
//                     // {
//                     //     xtype: 'layers',
//                     //     itemId: 'itemsConfig',
//                     //     name: 'items',
//                     //     header: false,
//                     //     width: '100%',
//                     //     height: 600,
//                     //     border: 1,
//                     //     LayerLeftTreePanelConfig: {
//                     //         rootType: 'container',
//                     //         diyTbar: {
//                     //             items: [
//                     //                 {
//                     //                     xtype: 'splitbutton',
//                     //                     text: i18n.getKey('add') + i18n.getKey('node'),
//                     //                     iconCls: 'icon_add',
//                     //                     itemId: 'addBtn',
//                     //                     menu: [
//                     //                         {
//                     //                             text: i18n.getKey('Container'),
//                     //                             handler: function (btn) {
//                     //                                 var splitbutton = btn.ownerCt.ownerButton;
//                     //                                 var treePanel = splitbutton.ownerCt.ownerCt;
//                     //                                 var rootNode = treePanel.getRootNode();
//                     //                                 treePanel.ownerCt.el.mask('加载中...');
//                     //                                 treePanel.ownerCt.updateLayout();
//                     //                                 setTimeout(function () {
//                     //                                     treePanel.controller.addDisplayObjectWin(null, 'Container', treePanel, rootNode);
//                     //                                     treePanel.ownerCt.el.unmask();
//                     //                                 }, 100);
//                     //                             }
//                     //                         },
//                     //                         {
//                     //                             text: i18n.getKey('DisplayObject'),
//                     //                             handler: function (btn) {
//                     //                                 var splitbutton = btn.ownerCt.ownerButton;
//                     //                                 var treePanel = splitbutton.ownerCt.ownerCt;
//                     //                                 var rootNode = treePanel.getRootNode();
//                     //                                 treePanel.controller.selectDisplayObjectType(treePanel, rootNode);
//                     //                             }
//                     //                         }
//                     //                     ]
//                     //                 },
//                     //                 {
//                     //                     xtype: 'button',
//                     //                     text: i18n.getKey('expandAll'),
//                     //                     iconCls: 'icon_expandAll',
//                     //                     count: 0,
//                     //                     handler: function (btn) {
//                     //                         var treePanel = btn.ownerCt.ownerCt;
//                     //                         if (btn.count % 2 == 0) {
//                     //                             treePanel.expandAll();
//                     //                             btn.setText(i18n.getKey('collapseAll'));
//                     //                             btn.setIconCls('icon_collapseAll');
//                     //
//                     //                         } else {
//                     //                             treePanel.collapseAll();
//                     //                             btn.setText(i18n.getKey('expandAll'));
//                     //                             btn.setIconCls('icon_expandAll');
//                     //                         }
//                     //                         btn.count++;
//                     //                     }
//                     //                 },
//                     //                 {
//                     //                     xtype: 'button',
//                     //                     text: i18n.getKey('从PCS中导入') + i18n.getKey('node'),
//                     //                     iconCls: 'icon_import',
//                     //                     itemId: 'importBtn',
//                     //                     handler: function (btn) {
//                     //                         var treePanel = btn.ownerCt.ownerCt;
//                     //                         var itemTemplatePanel = treePanel.ownerCt.ownerCt;
//                     //                         itemTemplatePanel.importNode();
//                     //                     }
//                     //                 },
//                     //                 '->',
//                     //                 {
//                     //                     xtype: 'button',
//                     //                     componentCls: 'btnOnlyIcon',
//                     //                     iconCls: 'icon_help',
//                     //                     fieldStyle: {
//                     //                         color: 'red'
//                     //                     },
//                     //                     handler: function (btn) {
//                     //                         alert('可拖拽改变树中节点位置');
//                     //                     },
//                     //                     tooltip: '可拖拽改变树中节点位置'
//                     //                 }
//                     //             ]
//                     //         },
//                     //         setValue: function (data) {
//                     //             var me = this;
//                     //             //转换数据结
//                     //             var rootNode = me.store.getRootNode();
//                     //             rootNode.removeAll()
//                     //             JSReplaceKeyName(data, 'items', 'children');
//                     //             //如果是container类型，必须有items
//                     //             JSObjectEachItem(data, function (data, i) {
//                     //                 if (data.clazz == 'Container') {
//                     //                     if (data.items) {
//                     //                     } else {
//                     //                         data.items = [];
//                     //                     }
//                     //                 }
//                     //             })
//                     //             rootNode.appendChild(data);
//                     //             me.expandAll();
//                     //
//                     //
//                     //         },
//                     //     },
//                     //     isValid: function () {
//                     //         var me = this;
//                     //         var data = me.getValue();
//                     //         if (data.layers.length == 0) {
//                     //             return false;
//                     //         } else {
//                     //             return true;
//                     //         }
//                     //     },
//                     //     diyGetValue: function () {
//                     //         var me = this;
//                     //         return (me.getValue())?.layers;
//                     //     },
//                     //     diySetValue: function (data) {
//                     //         var me = this;
//                     //         me.setValue({layers: data});
//                     //     }
//                     // }
//                 ]
//             },
//             listeners: {
//                 afterload: function (page) {
//
//                 }
//             }
//         });
//     }
// });

Ext.define('CGP.resource.view.compositeDisplayObject.fixSizeDisplayObject.Edit', {
    extend: 'Ext.form.Panel',
    alias: 'widget.fixdcedit',
    requires: ['CGP.pagecontentschema.view.Layers'],
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        margin: '5'
    },
    initComponent: function () {
        var me = this, id = JSGetQueryString('id');

        me.tbar = [
            {
                itemId: 'btnSaveFixDC',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
            },
            {
                xtype: 'button',
                itemId: "copyComposite",
                text: i18n.getKey('copy'),
                iconCls: 'icon_copy',
                disabled: id == null,
            }
        ];
        me.items = [
            // {
            //     name: '_id',
            //     xtype: 'numberfield',
            //     fieldLabel: i18n.getKey('id'),
            //     itemId: '_id',
            //     hidden: true
            // },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                allowBlank: false
            },
            {
                name: 'clazz',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.pcresource.compositedisplayobject.FixSizeDisplayObjectConfig'
            },
            {
                name: 'width',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('width'),
                itemId: 'width',
                allowBlank: false
            },
            {
                name: 'height',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('height'),
                itemId: 'height',
                allowBlank: false
            },
            {
                margin: '0 0 0 50',
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                value: i18n.getKey('element') + i18n.getKey('config'),
                itemId: 'information',
                fieldStyle: 'color:black;font-weight: bold'
            },
            {
                xtype: 'layers',
                itemId: 'itemConfig',
                name: 'items',
                title: i18n.getKey('element') + i18n.getKey('config'),
                header: false,
                width: '100%',
                height: 600,
                border: 1,
                LayerLeftTreePanelConfig: {
                    rootType: 'container',
                    diyTbar: {
                        items: [
                            {
                                xtype: 'button',
                                text: i18n.getKey('DisplayObject'),
                                iconCls: 'icon_add',
                                itemId: 'addDOBtn',
                                handler: function (btn) {
                                    var treePanel = btn.ownerCt.ownerCt;
                                    var rootNode = treePanel.getRootNode();
                                    treePanel.controller.selectDisplayObjectType(treePanel, rootNode);

                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('expandAll'),
                                iconCls: 'icon_expandAll',
                                count: 0,
                                handler: function (btn) {
                                    var treePanel = btn.ownerCt.ownerCt;
                                    if (btn.count % 2 == 0) {
                                        treePanel.expandAll();
                                        btn.setText(i18n.getKey('collapseAll'));
                                        btn.setIconCls('icon_collapseAll');

                                    } else {
                                        treePanel.collapseAll();
                                        btn.setText(i18n.getKey('expandAll'));
                                        btn.setIconCls('icon_expandAll');
                                    }
                                    btn.count++;
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('从PCS中导入') + i18n.getKey('node'),
                                iconCls: 'icon_import',
                                itemId: 'importBtn',
                                handler: function (btn) {
                                    var treePanel = btn.ownerCt.ownerCt;
                                    var itemTemplatePanel = treePanel.ownerCt.ownerCt;
                                    itemTemplatePanel.importNode();
                                }
                            },
                            '->',
                            {
                                xtype: 'button',
                                componentCls: 'btnOnlyIcon',
                                iconCls: 'icon_help',
                                fieldStyle: {
                                    color: 'red'
                                },
                                handler: function (btn) {
                                    alert('可拖拽改变树中节点位置');
                                },
                                tooltip: '可拖拽改变树中节点位置'
                            }
                        ]
                    },
                    setValue: function (data) {
                        var me = this;
                        //转换数据结
                        var rootNode = me.store.getRootNode();
                        rootNode.removeAll()
                        JSReplaceKeyName(data, 'items', 'children');
                        //如果是container类型，必须有items
                        JSObjectEachItem(data, function (data, i) {
                            if (data.clazz == 'Container') {
                                if (data.items) {
                                } else {
                                    data.items = [];
                                }
                            }
                        })
                        rootNode.appendChild(data);
                        me.expandAll();
                    },
                },

                isValid: function () {
                    var me = this;
                    var data = me.getValue();
                    if (data.layers.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }

        ]
        me.callParent(arguments);
        if (id) {
            var dsModel = Ext.ModelManager.getModel("CGP.resource.model.FixSizeDisplayObjectConfig");
            dsModel.load(parseInt(id), {
                success: function (record, operation) {
                    me.setValue(record.data);
                }
            });
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype=='layers') {
                item.setValue(data[item.name]);
            } else {
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype=='layers') {
                data[item.name] = (item.getValue())?.layers;
            } else {
                data[item.name] = item.getValue();
            }
        });
        data['compositeDisplayObject']={_id: JSGetQueryString('dcId'),
            clazz:'com.qpp.cgp.domain.pcresource.compositedisplayobject.CompositeDisplayObject'
        };
        return data;
    }
});