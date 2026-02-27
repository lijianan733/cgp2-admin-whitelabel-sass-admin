Ext.define("CGP.resource.view.compositeDisplayObject.Edit", {
    extend: 'Ext.tab.Panel',
    alias: 'widget.compositedisplayedit',
    requires: [
        'CGP.pagecontentschema.view.Layers'],
    initComponent: function () {
        var me = this, id = JSGetQueryString('id');
        var ruleStore = Ext.create('Ext.data.Store', {
            storeId: 'ruleStore',
            fields: ['value', 'displayName'],
            data: [
                {
                    value: 'com.qpp.cgp.domain.pcresource.compositedisplayobject.GeometricFillRule',
                    displayName: 'GeometricFillRule'
                }
            ]
        });
        // me.tbar = [
        //     {
        //         itemId: 'btnSaveComposite',
        //         text: i18n.getKey('save'),
        //         iconCls: 'icon_save',
        //     },
        //     {
        //         xtype: 'button',
        //         itemId: "copyComposite",
        //         text: i18n.getKey('copy'),
        //         iconCls: 'icon_copy',
        //         disabled: id == null,
        //     }
        // ];
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                items: [
                    {
                        itemId: 'btnSaveComposite',
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
                ]
            },
            {
                xtype: 'panel',
                itemId: 'errorMsg',
                hidden: true,
                border: false,
                bodyStyle: 'background-color: #F3D6D6',
                dock: 'top'
            }];
        me.items = [
            {
                xtype: 'fillrule',
                itemId: 'fillRule',
                title: i18n.getKey('fillRule') + i18n.getKey('config')
            },
            // {
            //     xtype: 'displayobject',
            //     itemId: 'itemConfig',
            //     name: 'items',
            //     title: i18n.getKey('element') + i18n.getKey('config'),
            //     header: false,
            // }
            {
                xtype: 'layers',
                itemId: 'itemConfig',
                name: 'items',
                title: i18n.getKey('element') + i18n.getKey('config'),
                header: false,
                allowBlank: false,
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
                    var me = this, isValid = true;
                    var data = me.getValue();
                    me.errorInfo = {};
                    if (!me.allowBlank && data.layers.length == 0) {
                        me.errorInfo[i18n.getKey('element') + i18n.getKey('config')] = i18n.getKey('not be null!');
                        isValid = false;
                    } else {
                        for (var item of me.items.items) {
                            if (item.xtype == 'layercenterpanel' && !item.isValid()) {
                                isValid = false;
                            }
                        }
                    }
                    return isValid;
                }
            }
        ];
        me.callParent(arguments);
        me.msgPanel = me.getComponent('errorMsg');
        if (id) {
            var dsModel = Ext.ModelManager.getModel("CGP.resource.model.CompositeDisplayObject");
            dsModel.load(parseInt(id), {
                success: function (record, operation) {
                    me.setValue(record.data);
                }
            });
        }
    },
    // listeners:{
    //     afterrender:function(comp){
    //
    //     }
    // },
    isValid: function () {
        var me = this;
        var isValid = true, errors = {};
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.isValid() == false) {
                    var errorInfo = Ext.isFunction(item.getErrors) ? item.getErrors() : item.errorInfo;
                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                        errors = Ext.Object.merge(errors, errorInfo);
                    } else {
                        if (item.getFieldLabel) {
                            errors[item.getFieldLabel()] = errorInfo;
                        }
                    }
                    isValid = false;
                    me.showErrors(errors);
                }
            });
        }
        return isValid;
    },

    showErrors: function (errors) {
        var me = this;
        var html = me.getErrHtml(errors);
        me.msgPanel.update(html);
        me.msgPanel.show();
    },
    getErrHtml: function (errs) {
        var me = this;
        var html = "<ul style='color:#BA1717'>";

        function renderLi(arr) {
            var ret = "";
            for (var i = 0; i < arr.length; i++) {
                ret += "<span>" + arr[i] + "</span>";
            }
            return ret;
        };

        function findField(name) {
            return me.getFields().findBy(function (f) {
                return f.getName().match(new RegExp(name + '$'));
            });
        }

        if (Ext.isString(errs)) {
            Ext.Array.forEach(errs.split('|'), function (e) {
                if (!Ext.isEmpty(e)) {
                    var f = e.split(':');
                    if (f.length > 1) {
                        var t = f[0],
                            field = findField(t);
                        if (field) {
                            t = field.getFieldLabel();
                            field.setActiveError(f[1]);
                        }
                        html += "<li>" + t + ":<span>" + f[1] + "</span></li>";
                    } else
                        html += "<li><span>" + e + "</span></li>";
                }
            });
        } else {
            for (var v in errs) {
                if (!Ext.isEmpty(errs[v])) {
                    html += "<li>" + v + ":<span>" + renderLi(errs[v]) + "</span></li>";
                }
            }
        }
        html += "</ul>";
        return html;
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'fillrule') {
                item.diySetValue(data);
            } else {
                item.setValue(data[item.name])
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'fillrule') {
                data = Ext.merge(data, item.diyGetValue());
            } else {
                data[item.name] = (item.getValue())?.layers;
            }
        });
        return data;
    }
})