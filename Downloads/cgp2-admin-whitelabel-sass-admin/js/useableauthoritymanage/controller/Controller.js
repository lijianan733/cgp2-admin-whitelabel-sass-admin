/**
 * Created by nan on 2018/8/13.
 */
Ext.define('CGP.useableauthoritymanage.controller.Controller', {
    storeLoadedCount: 0,//记录已经加载了的store
    /**
     *
     * @param form
     * @param resetBtn
     * @param mask
     * @param recordId
     */
    saveFormValue: function (form, resetBtn, mask, recordId) {
        if (form.isValid() && Ext.encode(form.getValues()) != '{}') {
            mask.show();
            var formValues = form.getValues();
            var method = form.formCreateOrEdit == 'create' ? 'POST' : 'PUT';
            var isAtomAuthority = formValues.privileges ? false : true;
            var jsonData = null;
            var aim = null;
            if (isAtomAuthority) {
                jsonData = {
                    clazz: 'com.qpp.security.domain.privilege.AtomPrivilege',
                    idReference: 'AtomPrivilege',
                    operationId: formValues.operation,
                    resourceId: formValues.resource.toString(),
                    name: formValues.name,
                    description: formValues.description,
                    code: formValues.code
                };
                aim = 'api/security/privileges/createAtomPrivilege';
            } else {
                jsonData = {
                    clazz: 'com.qpp.security.domain.privilege.CombinationPrivilege',
                    idReference: 'CombinationPrivilege',
                    name: formValues.name,
                    description: formValues.description,
                    code: formValues.code,
                    privilegeIds: formValues.privileges

                };
                aim = 'api/security/privileges/createCombinationPrivilege';
            }
            var url = adminPath + aim;
            if (method == 'PUT') {
                url = adminPath + 'api/security/privileges/' + recordId;
            }
            Ext.Ajax.request({
                url: url,
                method: method,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: jsonData,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        mask.hide();
                        resetBtn.setDisabled(false);
                        form.formCreateOrEdit = 'edit';
                        form.recordId = responseMessage.data._id;
                        var navigation = form.ownerCt.getComponent('navigation');
                        navigation.dataStore.load();
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                    } else {
                        mask.hide();
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    mask.hide();
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
    },
    /**
     *这是grid视图使用的保存
     * @param form
     * @param resetBtn
     * @param mask
     * @param recordId
     */
    gridSaveFormValue: function (form, resetBtn, mask, recordId) {
        if (form.isValid()) {
            mask.show();
            var formValues = form.getValues();
            var method = form.formCreateOrEdit == 'create' ? 'POST' : 'PUT';
            var isAtomAuthority = formValues.privileges ? false : true;
            var jsonData = null;
            var aim = null;
            if (isAtomAuthority) {
                jsonData = {
                    clazz: 'com.qpp.security.domain.privilege.AtomPrivilege',
                    idReference: 'AtomPrivilege',
                    operationId: formValues.operation,
                    resourceId: formValues.resource.toString(),
                    name: formValues.name,
                    description: formValues.description,
                    code: formValues.code
                };
                aim = 'api/security/privileges/createAtomPrivilege';
            } else {
                jsonData = {
                    clazz: 'com.qpp.security.domain.privilege.CombinationPrivilege',
                    idReference: 'CombinationPrivilege',
                    name: formValues.name,
                    description: formValues.description,
                    code: formValues.code,
                    privilegeIds: formValues.privileges

                };
                aim = 'api/security/privileges/createCombinationPrivilege';
            }
            var url = adminPath + aim;
            if (method == 'PUT') {
                url = adminPath + 'api/security/privileges/' + recordId;
            }
            Ext.Ajax.request({
                url: url,
                method: method,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: jsonData,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        mask.hide();
                        resetBtn.setDisabled(false);
                        form.formCreateOrEdit = 'edit';
                        form.recordId = responseMessage.data._id;
                        var editPanel = top.Ext.getCmp("tabs").getComponent('useableAuthorityManage_edit');
                        editPanel.setTitle(i18n.getKey('edit') + '_' + i18n.getKey('useableAuthority'));
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('save') + i18n.getKey('success'));
                    } else {
                        mask.hide();
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    mask.hide();
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
        }
    },
    /**
     *
     * @param recordId
     * @param form
     * @param createOrEdit
     * @param mask
     */
    loadRecord: function (record, form, type) {
        var me = this;
        if (!record) {
            form.createOrEdit = 'create';
            form.formCreateOrEdit = 'create';
            if (type != 'atomPrivilege') {
                for (var i = 0; i < form.items.items.length; i++) {
                    var item = form.items.items[i];
                    if (item.getName() == 'privileges') {
                        item.show();
                        item.setDisabled(false);
                    } else if (item.getName() == 'operation' || item.getName() == 'resource') {
                        item.hide();
                        item.setDisabled(true);

                    } else {
                        item.show();
                        item.setDisabled(false);
                    }
                }
            } else {
                for (var i = 0; i < form.items.items.length; i++) {
                    var item = form.items.items[i];
                    if (item.getName() == 'privileges') {
                        item.hide();
                        item.setDisabled(true);
                    } else if (item.getName() == 'operation' || item.getName() == 'resource') {
                        item.show();
                        item.setDisabled(false);

                    } else {
                        item.show();
                        item.setDisabled(false);
                    }
                }
            }
            for (var i = 0; i < form.items.items.length; i++) {
                var field = form.items.items[i];
                if (field.getName() == 'privileges') {
                    field.selectedRecord.removeAll();
                    if (field._grid) {
                        field._grid.getSelectionModel().deselectAll();
                        field._grid.getStore
                    }
                } else {
                    field.reset();
                }
            }
            return;
        }
        form.createOrEdit = 'edit';
        form.formCreateOrEdit = 'edit';
        var recordId = form.recordId = record.getData()['_id'];
        var data = record.getData();
        if (data.privileges) {
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                if (item.getName() == 'privileges') {
                    item.show();
                    item.setDisabled(false);
                } else if (item.getName() == 'operation' || item.getName() == 'resource') {
                    item.hide();
                    item.setDisabled(true);

                } else {
                    item.show();
                    item.setDisabled(false);
                }
            }
        } else {
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                if (item.getName() == 'privileges') {
                    item.hide();
                    item.setDisabled(true);
                } else if (item.getName() == 'operation' || item.getName() == 'resource') {
                    item.show();
                    item.setDisabled(false);

                } else {
                    item.show();
                    item.setDisabled(false);
                }
            }
        }
        for (var o = 0; o < form.items.items.length; o++) {
            var field = form.items.items[o];
            var name = field.getName();
            if (name == 'operation') {
                field.setValue(data[name]._id);
            } else if (name == 'resource') {
                field.setSubmitValue(data[name]._id)
            }
            else if (name == 'privileges') {
                var array = [];
                if (!data[name]) {
                    continue;
                }
                data[name].forEach(function (item) {
                    array.push(item._id);
                });

                var fieldStore = field._grid.getStore();
                fieldStore.load(function (store, records) {
                    field.selectedRecord.removeAll();
                    field._grid.getSelectionModel().deselectAll();
                    var index = fieldStore.find('_id', recordId);
                    if (index > 0) {
                        fieldStore.removeAt(index);
                    }
                    for (var i = 0; i < fieldStore.getCount(); i++) {
                        var record = fieldStore.data.items[i];
                        //跳过原子权限
                        if (record.get('clazz') != 'com.qpp.security.domain.privilege.CombinationPrivilege') {
                            continue;
                        } else {//递归遍历权限组
                            var data = record.get('privileges');
                            var reusult = me.findUnAbleRule(data, recordId);
                            if (reusult == false) {
                                fieldStore.removeAt(i);
                            }
                        }
                    }
                    if (array.length > 0) {
                        field.setSubmitValue(array);
                    }
                })
            } else {
                field.setValue(data[name]);
            }
        }
    },
    /**
     *
     * @param recordId
     * @param form
     * @param createOrEdit
     * @param mask
     */
    gridLoadRecord: function (recordId, form, createOrEdit, mask) {
        if (createOrEdit == 'edit') {
            mask.show();
            var record = CGP.useableauthoritymanage.model.UseableAuthorityManageModel.load(recordId, {
                scope: this,
                failure: function (record, operation) {
                    mask.hide();
                },
                success: function (record, operation) {
                    var data = record.getData();
                    if (data.privileges) {
                        form.getComponent('privileges').show();
                        form.getComponent('privileges').setDisabled(false);
                        form.getComponent('operation').hide();
                        form.getComponent('operation').setDisabled(true);
                        form.getComponent('resource').hide();
                        form.getComponent('resource').setDisabled(true);
                    } else {
                        form.getComponent('privileges').hide();
                        form.getComponent('privileges').setDisabled(true);
                        form.getComponent('operation').show();
                        form.getComponent('operation').setDisabled(false);
                        form.getComponent('resource').show();
                        form.getComponent('resource').setDisabled(false);
                    }
                    for (var i = 0; i < form.items.items.length; i++) {
                        var field = form.items.items[i];
                        var name = field.getName();
                        if (name == 'operation') {
                            field.setValue(data[name]._id);
                        } else if (name == 'resource') {
                            field.setSubmitValue(data[name]._id)
                        }
                        else if (name == 'privileges' && data[name]) {
                            var array = [];
                            data[name].forEach(function (item) {
                                array.push(item._id);
                            });
                            field.setSubmitValue(array);
                        } else {
                            field.setValue(data[name]);
                        }
                    }
                    mask.hide();
                },
                callback: function (record, operation) {
                    mask.hide();
                }
            })
        }
    },
    /**
     *所有store加载完后执行
     */
    afterStoreLoad: function (recordId, form, createOrEdit, mask) {
        if (this.storeLoadedCount == 2) {
            this.gridLoadRecord(recordId, form, createOrEdit, mask)
        }
    },
    /**
     * 显示选择添加的权限类型
     */
    showSelctTypeWin: function (navigation) {
        var me = this;
        navigation.dataStore.load();
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('select') + i18n.getKey('permission') + i18n.getKey('type'),
            height: 150,
            width: 300,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'

                },
                items: [
                    {
                        xtype: 'combo',
                        itemId: 'selectType',
                        valueField: 'value',
                        displayField: 'type',
                        allowBlank: false,
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'type',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'value'
                                }
                            ],
                            data: [
                                {
                                    type: i18n.getKey('atomPrivilege'),
                                    value: 'atomPrivilege'
                                },
                                {
                                    type: i18n.getKey('combinationPrivilege'),
                                    value: 'combinationPrivilege'
                                }
                            ]
                        })
                    }
                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_agree',
                        handler: function (view) {
                            var form = view.ownerCt.ownerCt;
                            var type = form.getComponent('selectType').getValue();
                            if (form.isValid()) {
                                win.close();
                                var centerPanel = navigation.ownerCt.getComponent('centerPanel');
                                me.loadRecord(null, centerPanel, type);
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (view) {
                            win.close();

                        }
                    }
                ]
            }
        });
        win.show();
    },
    /**grid视图中
     * 显示选择添加的权限类型
     */
    showSelctTypeWin: function (navigation) {
        var me = this;
        navigation.dataStore.load();
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('select') + i18n.getKey('permission') + i18n.getKey('type'),
            height: 150,
            width: 300,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'

                },
                items: [
                    {
                        xtype: 'combo',
                        itemId: 'selectType',
                        valueField: 'value',
                        displayField: 'type',
                        allowBlank: false,
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'type',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'value'
                                }
                            ],
                            data: [
                                {
                                    type: i18n.getKey('atomPrivilege'),
                                    value: 'atomPrivilege'
                                },
                                {
                                    type: i18n.getKey('combinationPrivilege'),
                                    value: 'combinationPrivilege'
                                }
                            ]
                        })
                    }
                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_agree',
                        handler: function (view) {
                            var form = view.ownerCt.ownerCt;
                            var type = form.getComponent('selectType').getValue();
                            if (form.isValid()) {
                                win.close();
                                var centerPanel = navigation.ownerCt.getComponent('centerPanel');
                                me.loadRecord(null, centerPanel, type);
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (view) {
                            win.close();

                        }
                    }
                ]
            }
        });
        win.show();
    },
    /**
     * 右键点击节点时显示菜单操作
     * @param {Ext.tree.Panel} view 树结构
     * @param {Node} record 选中的节点
     * @param {Event} e 事件对象
     * @param {String} parentId 父节点ID
     * @param {Boolean} isLeaf 是否叶子节点
     * @param {String} treeType 物料视图类型
     */
    categoryEventMenu: function (view, record, e, parentId, isLeaf, treeType) {
        var me = this;
        var centerPanel = view.ownerCt.ownerCt.getComponent('centerPanel');
        var tree = view.ownerCt;
        var isShow = record.getDepth() == 1 ? true : false;
        e.stopEvent();
        if (!isShow) {
            return;
        }
        var menu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: i18n.getKey('delete'),
                    disabledCls: 'menu-item-display-none',
                    hidden: !isShow,
                    itemId: 'delete',
                    handler: function () {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (id) {
                            if (id == 'yes') {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/security/privileges/' + record.getData()['_id'],
                                    method: 'DELETE',
                                    headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    },
                                    success: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        if (responseMessage.success) {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                            view.ownerCt.dataStore.load();
                                            for (var i = 0; i < centerPanel.items.items.length; i++) {
                                                var item = centerPanel.items.items[i];
                                                item.reset();
                                                item.setDisabled(true);
                                            }
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    },
                                    failure: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                });
                            }
                        })
                    }
                }
            ]
        });
        menu.showAt(e.getXY());
    },
    /**
     * 权限导航处的查询处理
     * @param view
     */
    searchData: function (id, treePanel) {
        var rawUrl = treePanel.dataStore.getProxy().url;

        if (Ext.isEmpty(id)) {
        } else {
            treePanel.dataStore.getProxy().url = treePanel.dataStore.getProxy().url + '?filter=' +
                Ext.JSON.encode([
                        {"name": "_id", "value": id, "type": "string"}
                    ]
                );
            treePanel.dataStore.getProxy().url = encodeURI(treePanel.dataStore.getProxy().url);
        }

        treePanel.dataStore.load();
        treePanel.dataStore.getProxy().url = rawUrl;
    },
    findUnAbleRule: function (data, recordId) {
        var me = this;
        for (var j = 0; j < data.length; j++) {
            var item = data[j];
            if (item.clazz != 'com.qpp.security.domain.privilege.CombinationPrivilege') {

            } else {
                if (item._id == recordId) {
                    return false;
                }
                me.findUnAbleRule(item['privileges'], recordId);
            }
        }
    },
    JSJsonToTree: function (data, rootName) {
        var root = {
            text: rootName || 'context',
            leaf: false,
            children: [],
            depth: 1,
            id: 'root'
        };
        var createChildNode = function (data, returnRoot) {
            for (var i = 0; i < data.length; i++) {
                var itemId = JSGetUUID();
                var root = {};
                root = Ext.Object.merge({
                    type: 'object',
                    leaf: true,
                    icon: '../material/category.png',
                    depth: returnRoot.depth + 1,
                    partnerId: returnRoot.id,
                    id: itemId
                }, {
                    text: i,
                    _id: data[i]._id,
                    clazz: data[i].clazz,
                    code: data[i].code,
                    name: data[i].name,
                    description: data[i].description


                });
                if (data[i].clazz == 'com.qpp.security.domain.privilege.CombinationPrivilege') {
                    root.children = [];
                    root.leaf = false;
                    root.privileges = data[i].privileges
                    createChildNode(data[i].privileges, root);
                } else {
                    root.operation = data[i].operation;
                    root.resource = data[i].resource
                }
                returnRoot.children.push(root)
            }
            return returnRoot;
        }
        return createChildNode(data, root);
    },
    gridShowSelctTypeWin: function () {
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('select') + i18n.getKey('permission') + i18n.getKey('type'),
            height: 150,
            width: 300,
            modal: true,
            layout: 'fit',
            items: {
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'

                },
                items: [
                    {
                        xtype: 'combo',
                        itemId: 'selectType',
                        valueField: 'value',
                        displayField: 'type',
                        allowBlank: false,
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'type',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'value'
                                }
                            ],
                            data: [
                                {
                                    type: i18n.getKey('atomPrivilege'),
                                    value: 'atomPrivilege'
                                },
                                {
                                    type: i18n.getKey('combinationPrivilege'),
                                    value: 'combinationPrivilege'
                                }
                            ]
                        })
                    }
                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_agree',
                        handler: function (view) {
                            var type = view.ownerCt.ownerCt.getComponent('selectType').getValue();
                            if (!Ext.isEmpty(type)) {
                                win.close();
                                JSOpen({
                                    id: 'useableAuthorityManage_edit',
                                    url: path + 'partials/useableauthoritymanage/edit.html?type=' + type,
                                    title: i18n.getKey('create') + '_' + i18n.getKey('useableAuthority'),
                                    refresh: true
                                });
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (view) {
                            win.close();

                        }
                    }
                ]
            }
        });
        win.show();
    }
})
