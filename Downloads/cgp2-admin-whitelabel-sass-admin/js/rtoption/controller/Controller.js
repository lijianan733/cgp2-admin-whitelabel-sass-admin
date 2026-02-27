Ext.define("CGP.rtoption.controller.Controller", {

    /**
     * 添加标签窗口
     * @param tree
     * @param record
     */
    editTag: function (tree, record) {
        var operation = Ext.isEmpty(record) ? i18n.getKey('add') : i18n.getKey('edit')
        Ext.create('Ext.window.Window', {
            title: operation + i18n.getKey('tag'),
            layout: 'fit',
            modal: true,
            items: [
                {
                    xtype: 'form',
                    border: false,
                    height: 80,
                    header: false,
                    defaults: {
                        width: 350,
                        margin: '10 25 5 25'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            itemId: 'name',
                            fieldLabel: i18n.getKey('name'),
                            allowBlank: false,
                            msgTarget: 'side',
                            name: 'name',
                            maxLength: 50
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'description',
                            fieldLabel: i18n.getKey('description'),
                            name: 'description',
                            maxLength: 150
                        }
                    ],
                    listeners: {
                        afterrender: function (comp) {
                            if (record) {
                                var items = comp.items.items;
                                Ext.Array.each(items, function (item) {
                                    item.setValue(record.data[item.name]);
                                })
                            }
                        }
                    }
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    handler: function () {
                        var win = this.ownerCt.ownerCt;
                        var form = win.down('form');
                        if (!form.isValid()) {
                            return false;
                        }
                        var data = form.getForm().getValues(), method = 'POST', url = adminPath + 'api/rtOptionTags';
                        if (tree.getRootNode().findChild('name', data.name)) {
                            if (record?.data?.name != data.name) {
                                var msg = Ext.isEmpty(record?.data?.name) ? '不能添加同名tag！' : '不能修改为同名tag！'
                                Ext.Msg.alert(i18n.getKey('提示'), msg);
                                return false;
                            }
                        }
                        if (record && record.getId()) {
                            data.id = record.getId();
                            method = 'PUT';
                            url += '/' + record.getId();
                        }
                        data.clazz = "com.qpp.cgp.domain.attribute.RtOptionTag";
                        JSAjaxRequest()
                        var request = {
                            url: url,
                            method: method,
                            jsonData: data,
                            async: false,
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var resp = Ext.JSON.decode(res.responseText);
                                var data = resp.data;
                                if (resp.success) {
                                    var treeStore = tree.getStore(), index = 0;
                                    if (!Ext.isEmpty(record)) {
                                        index = treeStore.getRootNode().indexOfId(record.getId());
                                    }
                                    var rtOptionTagStore = Ext.data.StoreManager.lookup('RtOptionTag')
                                    rtOptionTagStore.loadPage(rtOptionTagStore.currentPage);
                                    tree.getSelectionModel().select(index);

                                    win.close();
                                    Ext.Msg.alert('提示', operation + '成功！');
                                } else {
                                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                                }
                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        };
                        tree.setLoading(true);
                        setTimeout(function () {
                            Ext.Ajax.request(request);
                            tree.setLoading(false)
                        }, 100);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ]

        }).show();
    },

    /**
     * 修改RtOption
     * @param gridStore
     * @param tagId
     * @param id
     */
    editRtOption: function (gridStore, tagId, id) {
        var me = this;
        return function callback(status) {
            if (status === 'yes') {
                me.editRtOptionWind(gridStore, tagId, id, me);
            }
        }
    },
    /**
     * rtOption编辑窗口
     * @param gridStore
     * @param tagId
     * @param id
     * @param scop
     */
    editRtOptionWind: function (gridStore, tagId, id, scop) {
        var me = scop;
        Ext.create('Ext.window.Window', {
            title: (Ext.isEmpty(id) ? i18n.getKey('add') : i18n.getKey('edit')) + i18n.getKey('rtOption'),
            layout: 'fit',
            modal: true,
            items: [
                Ext.create('CGP.rtoption.Edit', {
                    itemId: 'rtOptionForm',
                    header: false,
                    border: false,
                    optionId: id,
                    tagId: tagId
                })
            ],
            bbar: [
                '->',
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var from = win.getComponent('rtOptionForm');
                        if (from.isValid()) {
                            var data = from.getValue(), isExist = false;
                            for (var i = 0; i < gridStore.getCount(); i++) {
                                var item = gridStore.getAt(i);
                                if (item.get('id') != id && item.get('name') == data['name']) {
                                    isExist = true;
                                    break;
                                }
                            }
                            if (isExist) {
                                Ext.Msg.alert('提示', 'rtOption名称已存在不能重复添加！');
                                return false;
                            }
                            win.el.mask();
                            setTimeout(function () {
                                me.saveRtOption(win, data, gridStore, id);
                            }, 100);
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    handler: function () {
                        this.ownerCt.ownerCt.close();
                    }
                }
            ]
        }).show();
    },
    /**
     * 保存rtOption
     * @param wind
     * @param data
     * @param id
     */
    saveRtOption: function (wind, data, gridStore, id) {

        var method = 'POST', url = adminPath + 'api/rtoptions';
        if (id) {
            method = 'PUT';
            url += "/" + id;
            data.id = id;
        }
        var request = {
            url: url,
            method: method,
            jsonData: data,
            async: false,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var resp = Ext.JSON.decode(res.responseText);
                if (resp.success) {
                    Ext.Msg.alert('提示', id ? '修改成功！' : '添加成功！');
                    gridStore.loadPage(gridStore.currentPage);
                    wind.close();
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };

        Ext.Ajax.request(request);
    },
    /**
     * 刷新右侧列表
     * @param record
     * @param centerPanel
     * @param isLeaf
     * @param parentId
     * @param searchRtOptionId
     */
    refreshRtOptionGrid: function (record, centerPanel, seachId) {
        var data = {id: null, tagId: record.get('id'), name: record.get('text')};
        var isLeaf = record.get('leaf');
        if (isLeaf) {
            data.id = record.get('id');
            data.tagId = record.get('parentId');
        }
        centerPanel.refreshData(data, seachId);
    },

    /**
     * 显示右键菜单
     * @param view
     * @param record
     * @param e
     */
    categoryEventMenu: function (view, record, e) {
        var me = this;
        var tree = view.ownerCt;
        e.stopEvent();
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('modify') + i18n.getKey('name'),
                    disabledCls: 'menu-item-display-none',
                    itemId: 'modifyName',
                    handler: function () {
                        me.editTag(tree, record)
                    }
                },
                {
                    text: i18n.getKey('delete'),
                    disabledCls: 'menu-item-display-none',
                    hidden: record.get('leaf'),
                    itemId: 'delete',
                    handler: function (btn) {
                        var rtOptionStore = Ext.data.StoreManager.get('RtOption');
                        if (rtOptionStore.count() > 0) {
                            Ext.Msg.alert(i18n.getKey('info'), record.get('name') + i18n.getKey('tag') + '下有rtOption，该分类不能删除！');
                            return false;
                        }
                        me.deleteTage(tree, record)
                    }
                },
            ]
        });

        menu.showAt(e.getXY());

    },

    /**
     * 删除tag
     * @param tree
     * @param record
     */
    deleteTage: function (tree, record) {
        Ext.Msg.confirm('提示', '是否删除该tag？', callback);

        function callback(status) {
            if (status === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/rtOptionTags/' + record.getId(),
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var resp = Ext.JSON.decode(res.responseText);
                        var data = resp.data;
                        if (resp.success) {
                            Ext.Msg.alert(i18n.getKey('info'), "删除成功！");
                            tree.getRootNode().removeChild(record)
                        } else {
                            Ext.Msg.alert(i18n.getKey('requestFailed'), '请求错误：' + resp.data.message)
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },
    /**
     * 删除RtOption
     * @param id
     * @param gridStore
     */
    deleteRtOption: function (id, gridStore) {

        return function callback(status) {
            if (status === 'yes') {
                Ext.Ajax.request({
                    url: adminPath + 'api/rtoptions/' + id,
                    method: 'DELETE',
                    headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                    success: function (res) {
                        var resp = Ext.JSON.decode(res.responseText);
                        var data = resp.data;
                        if (resp.success) {
                            Ext.Msg.alert('提示', "删除成功！");
                            if (gridStore) {
                                gridStore.loadPage(gridStore.currentPage);
                            }
                        } else {
                            Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                        }
                    },
                    failure: function (resp) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                })
            }
        }
    },

    operateInspection: function (id, operate, callback) {
        Ext.Ajax.request({
            url: adminPath + 'api/rtAttributeDefs',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            params: {
                page: 1,
                limit: 10,
                filter: '[{"name": "options._id",  "value": "' + id + '", "type": "String" }]'
            },
            success: function (res) {
                var resp = Ext.JSON.decode(res.responseText);
                var data = resp.data?.content;
                if (resp.success) {
                    var attrs = '';
                    data.forEach(function (item) {
                        attrs += item.name + '<' + item._id + '>; ';
                    });
                    if (Ext.isEmpty(attrs)) {
                        Ext.Msg.confirm('提示', '是否' + operate + '该option？', callback);
                    } else {
                        Ext.Msg.confirm('提示', '该option被以下属性使用了确认要' + operate + '该option？\n' + attrs, callback);
                    }
                } else {
                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        })
    },

})