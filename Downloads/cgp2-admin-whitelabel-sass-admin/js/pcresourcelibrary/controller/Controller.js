Ext.define('CGP.pcresourcelibrary.controller.Controller', {
    checkJsonData: function (data, tab) {
        var controller = this;
        var title = i18n.getKey('pcresourcelibrary');
        var winConfig = {
            height: 620,
            showValue: true,
            editable: true,
            readOnly: false,
            isHiddenRawDateForm: true,
            bbar: [
                '->',
                {
                    text: i18n.getKey('ok'),
                    itemId: 'okBtn',
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var newData = win.getValue();
                        var recordData = controller.saveRecord(newData, tab);
                        //保存json数据后刷新
                        if (recordData) {
                            win.close();
                            if (location.search.includes('id')) {//编辑

                            } else {
                                location.href = location.href + '?id=' + recordData._id;
                            }
                        }
                    }
                }, {
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }
            ]
        };
        JSShowJsonDataV2(data, title, null, winConfig);
    },
    saveRecord: function (data) {
        var me = this;
        var recordData = null;
        var method = "POST";
        var url = adminPath + 'api/pCResourceLibraries';
        if (!Ext.isEmpty(data._id)) {
            url += '/' + data._id;
            method = 'PUT';
        }
        JSAjaxRequest(url, method, false, data, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (method == 'POST') {
                    JSOpen({
                        id: 'pcresourcelibrary_edit',
                        url: path + "partials/pcresourcelibrary/edit.html?id=" + responseText.data._id + '&type=' + responseText.data.type,
                        title: i18n.getKey('edit') + i18n.getKey('pcResourceLibrary') + '(' + responseText.data._id + ')',
                        refresh: true
                    })
                }
            }
        })
    },
    savePCResourceItem: function (data, win) {
        var me = this;
        var recordData = null;
        var method = "POST";
        var url = adminPath + 'api/pcresourceItems';
        if (!Ext.isEmpty(data._id)) {
            url += '/' + data._id;
            method = 'PUT';
        }
        JSAjaxRequest(url, method, false, data, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                win.resourceItemGrid.store.load();
                win.close();
            }
        })
    },
    /**
     * 编辑分类
     * @constructor
     */
    EditCategory: function (record, treePanel, parentNode) {
        var controller = this;
        var createOrEdit = record ? 'edit' : 'create';
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey(createOrEdit) + i18n.getKey('category'),
            layout: 'fit',
            items: [
                {
                    xtype: 'errorstrickform',
                    defaults: {
                        margin: '5 25 10 25'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: '_id',
                            itemId: '_id',
                            hidden: true,
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            value: 'com.qpp.cgp.domain.pcresource.PCResourceCategory',
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'type',
                            itemId: 'type',
                            hidden: true,
                            value: treePanel.resourceType,
                            allowBlank: true
                        },
                        {
                            xtype: 'textfield',
                            name: 'parent',
                            itemId: 'parent',
                            hidden: true,
                            allowBlank: true,
                            value: parentNode ? parentNode.getId() : null,
                            diyGetValue: function () {
                                var parent = this.getValue();
                                if (parent && parent != 'root') {
                                    return {
                                        _id: parent,
                                        clazz: 'com.qpp.cgp.domain.pcresource.PCResourceCategory'
                                    }
                                } else {
                                    return null;
                                }
                            },
                            diySetValue: function (data) {
                                if (data) {
                                    this.setValue(data._id);
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'name',
                            itemId: 'name',
                            fieldLabel: i18n.getKey('name')
                        },
                        {
                            xtype: 'multilanguagefield',
                            name: 'displayName',
                            itemId: 'displayName',
                            fieldLabel: i18n.getKey('displayName')
                        }
                    ]
                }
            ],
            listeners: {
                afterrender: function () {
                    var win = this;
                    var form = win.items.items[0];
                    if (record) {
                        form.setValue(record.getData());
                    }
                }
            },
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var form = win.items.items[0];
                        if (form.isValid()) {
                            var data = form.getValue();
                            if (record) {
                                for (var i in data) {
                                    record.set(i, data[i]);
                                }
                                controller.saveCategory(record, treePanel);
                            } else {
                                var model = new CGP.pcresourcelibrary.model.PCResourceCategoryModel(data);
                                controller.saveCategory(model, treePanel, parentNode);
                            }
                            win.close();
                        }
                    }
                }
            }
        });
        win.show();

    },
    /**
     * 保存分类
     */
    saveCategory: function (record, treePanel, parentNode) {
        record.save({
            callback: function (node, option, success) {
                if (success) {
                    var modal = option.action;
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey(modal == 'create' ? 'addsuccessful' : 'modifySuccess'), function () {
                        if (modal == 'create') {
                            if (Ext.isEmpty(parentNode)) {
                                parentNode = treePanel.getRootNode();
                            }
                            var newNodeId = (modal == 'create' ? record.getId() : null);
                            treePanel.refreshTreeNode(parentNode, newNodeId);
                        }
                    })
                }
            }
        })

    },
    /**
     * 批量修改分类
     */
    batchUpdateCategory: function (recordIds, categoryId, grid) {
        var url = adminPath + 'api/pcresourceItems/category?ids=' + recordIds.toString() + '&categoryId=' + categoryId;
        var method = 'PUT';
        JSAjaxRequest(url, method, false, {}, null, function () {
            grid.store.load();
        })
    }
})
