function controller(infoPanelId, treeId, store, websiteId, isMain, window) {

    var menu;
    var infoPanelId;
    var treeId;
    var controller = {};
    var attributePanel;
    var includeUrl = adminPath + 'api/admin/productCategory/{0}/attribute';
    var exclusiveUrl = adminPath + 'api/admin/productCategory/{0}/exclusiveAttribute'
    var addIds = [];


    selectTreeStore.proxy.extraParams.isMain = isMain;

    var selectTree = createSelectTree();

    function createSelectTree() {
        var selectTree = Ext.create('Ext.tree.Panel', {
            id: 'selectTree',
            width: 'auto',
            useArrows: true,
            rootVisible: false,
            store: selectTreeStore,
            autoScroll: true,
            columns: [{
                xtype: 'treecolumn',
                text: 'name',
                width: 400,
                sortable: true,
                dataIndex: 'name',
                locked: true
            }],

            selModel: {
                selType: 'cellmodel'
            },
            bbar: [{
                xtype: 'button',
                text: 'Ok',
                id: 'selectTreeOkButton',
                disabled: true,
                handler: function () {
                    var tree = Ext.getCmp(treeId);
                    var record = this.ownerCt.ownerCt.getSelectionModel().getSelection()[0];
                    var tree = Ext.getCmp(treeId);
                    var treeStore = tree.getStore();
                    var categoryId = Ext.Number.from(this.ownerCt.ownerCt.ownerCt.getComponent('categoryId').getValue());
                    console.log('categoryId:' + categoryId + '\n' + 'targetId:' + record.get('id'));


                    //获得将要被应用改变的product
                    if (isMain) {
                        Ext.Ajax.request({
                            url: adminPath + 'api/admin/productCategory/' + categoryId + '/product?access_token=' + Ext.util.Cookies.get('token'),
                            method: 'GET',
                            async: false,
                            success: function (response, options) {
                                var resp = Ext.JSON.decode(response.responseText);
                                if (resp.success) {


                                    if (resp.data.length == 0) {
                                        Ext.Ajax.request({
                                            url: adminPath + 'api/admin/productCategory/' + categoryId + '/move/' + record.get('id') + '?access_token=' + Ext.util.Cookies.get('token'),
                                            method: 'PUT',
                                            success: function (response, options) {
                                                var resp = Ext.JSON.decode(response.responseText);
                                                if (resp.success) {
                                                    treeStore.suspendAutoSync();
                                                    //修改成功  在树上进行同步
                                                    var targetNode = treeStore.getNodeById(record.get('id'));
                                                    var sourceNode = treeStore.getNodeById(categoryId);
                                                    var oldParent = sourceNode.parentNode;
                                                    oldParent.removeChild(sourceNode);
                                                    if (oldParent.childNodes.length == 0) {
                                                        oldParent.set('leaf', true);
                                                    }
                                                    targetNode.set('leaf', false);
                                                    targetNode.insertChild(0, sourceNode);
                                                    tree.expandAll();
                                                    Ext.Msg.alert('Info', 'Move Success');
                                                    treeStore.resumeAutoSync();
                                                    selectTree.ownerCt.close();
                                                } else {
                                                    Ext.Msg.alert('Info', resp.message);
                                                }
                                            },
                                            failure: function (response, options) {
                                                Ext.Msg.alert('Info', 'Server Error!');
                                            }
                                        });
                                    } else {

                                        var grid = new Ext.grid.Panel({
                                            store: new Ext.data.Store({
                                                fields: ['name', 'model'],
                                                data: resp.data
                                            }),
                                            columns: [{
                                                dataIndex: 'name',
                                                text: 'name'
                                            }, {
                                                dataIndex: 'model',
                                                text: 'model'
                                            }],
                                            bbar: [{
                                                xtype: 'button',
                                                text: 'Ok',
                                                handler: function () {
                                                    this.ownerCt.ownerCt.ownerCt.close();
                                                    Ext.Ajax.request({
                                                        url: adminPath + 'api/admin/productCategory/' + categoryId + '/move/' + record.get('id') + '?access_token=' + Ext.util.Cookies.get('token'),
                                                        method: 'PUT',
                                                        success: function (response, options) {
                                                            var resp = Ext.JSON.decode(response.responseText);
                                                            if (resp.success) {
                                                                treeStore.suspendAutoSync();
                                                                //修改成功  在树上进行同步
                                                                var targetNode = treeStore.getNodeById(record.get('id'));
                                                                var sourceNode = treeStore.getNodeById(categoryId);
                                                                var oldParent = sourceNode.parentNode;
                                                                oldParent.removeChild(sourceNode);
                                                                if (oldParent.childNodes.length == 0) {
                                                                    oldParent.set('leaf', true);
                                                                }
                                                                targetNode.set('leaf', false);
                                                                targetNode.insertChild(0, sourceNode);
                                                                tree.expandAll();
                                                                Ext.Msg.alert('Info', 'Move Success');
                                                                treeStore.resumeAutoSync();
                                                                selectTree.ownerCt.close();
                                                            } else {
                                                                Ext.Msg.alert('Info', resp.message);
                                                            }
                                                        },
                                                        failure: function (response, options) {
                                                            Ext.Msg.alert('Info', 'Server Error!');
                                                        }
                                                    });

                                                }
                                            }, {
                                                xtype: 'button',
                                                text: 'Cancel',
                                                itemId: 'cancelButton',
                                                handler: function () {
                                                    this.ownerCt.ownerCt.ownerCt.close();
                                                }

                                            }]
                                        });

                                        var window = new Ext.window.Window({
                                            title: 'effect products',
                                            width: 600,
                                            height: 800,
                                            layout: {
                                                type: 'hbox',
                                                align: 'stretch',
                                                padding: 5
                                            },
                                            defaults: {
                                                flex: 1
                                            },
                                            items: [grid]
                                        });
                                        window.show();
                                    }

                                } else {
                                    Ext.Msg.alert('Server Error!');
                                }
                            },
                            failure: function (response, options) {
                                Ext.Msg.alert('Server Error!');
                            }
                        });
                    } else {
                        Ext.Ajax.request({
                            url: adminPath + 'api/admin/productCategory/' + categoryId + '/move/' + record.get('id') + '?access_token=' + Ext.util.Cookies.get('token'),
                            method: 'PUT',
                            success: function (response, options) {
                                var resp = Ext.JSON.decode(response.responseText);
                                if (resp.success) {
                                    treeStore.suspendAutoSync();
                                    //修改成功  在树上进行同步
                                    var targetNode = treeStore.getNodeById(record.get('id'));
                                    var sourceNode = treeStore.getNodeById(categoryId);
                                    var oldParent = sourceNode.parentNode;
                                    oldParent.removeChild(sourceNode);
                                    if (oldParent.childNodes.length == 0) {
                                        oldParent.set('leaf', true);
                                    }
                                    targetNode.set('leaf', false);
                                    targetNode.insertChild(0, sourceNode);
                                    tree.expandAll();
                                    Ext.Msg.alert('Info', 'Move Success');
                                    treeStore.resumeAutoSync();
                                    selectTree.ownerCt.close();
                                } else {
                                    Ext.Msg.alert('Info', resp.message);
                                }
                            },
                            failure: function (response, options) {
                                Ext.Msg.alert('Info', 'Server Error!');
                            }
                        });
                    }

                }

            }, {
                xtype: 'button',
                text: 'Cancel',
                itemId: 'cancelButton',
                handler: function () {
                    this.ownerCt.ownerCt.ownerCt.close();
                }

            }],
            listeners: {
                'itemClick': function (view, record) {
                    Ext.getCmp('selectTreeOkButton').setDisabled(false);
                }
            }
        });
        selectTree.expandAll();
        selectTreeStore.relayEvents(Ext.getCmp('website'), ['select'], 'combo');
        selectTreeStore.on('comboselect', function (combo, record) {

            selectTreeStore.proxy.extraParams.website = record[0].get('id');
            selectTreeStore.load({
                callback: function () {
                    selectTree.expandAll();
                }
            });

        })
        return selectTree;
    }


    Ext.define('CGP.model.Attribute', {
        extend: 'Ext.data.Model',
        idProperty: 'id',
        fields: [{
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'sortOrder',
            type: 'int'
        }, 'code', 'name', {
            name: 'required',
            type: 'boolean'
        }, 'inputType', 'validationExp', {
            name: 'showInFrontend',
            type: 'boolean'
        }, {
            name: 'useInCategoryNavigation',
            type: 'boolean'
        }, {
            name: 'belongToParent',
            type: 'boolean'
        }, {
            name: 'value',
            type: 'string'
        }, {
            name: 'options',
            type: 'array'
        }]
    });
    //包含的attribute
    var includeStore = new Ext.data.Store({
        model: 'CGP.model.Attribute',
        remoteSort: false,
        pageSize: 25,
        proxy: {
            type: 'uxrest',
            url: adminPath + 'api/admin/productCategory/%d/attribute',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        remoteSort: false,
        sorters: [{
            property: 'sortOrder',
            direction: 'ASC'
        }]
    });
    //不包含的Attribute
    var exclusiveStore = new Ext.data.Store({
        model: 'CGP.model.Attribute',
        remoteSort: false,
        pageSize: 25,
        proxy: {
            type: 'uxrest',
            url: adminPath + 'api/admin/productCategory/%d/exclusiveAttribute',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        sorters: [{
            direction: 'ASC',
            property: 'sortOrder'
        }]
    });
    var selectTreeWindow = new Ext.window.Window({
        title: 'select a node',
        width: 600,
        height: 800,
        layout: {
            type: 'hbox',
            align: 'stretch',
            padding: 5
        },
        defaults: {
            flex: 1
        },
        autoDestroy: false,
        closeAction: 'hide',
        items: [selectTree, {
            xtype: 'hidden',
            itemId: 'categoryId',
            value: 1
        }]

    });

    function onAddChild() {
        var targetNode = Ext.getCmp(treeId).getSelectionModel().getSelection()[0];
        targetNode.set('leaf', false);
        targetNode.set('expanded', true);
        var defaultModel;

        defaultModel = new CGP.model.ProductCategory({
            name: 'new',
            isMain: isMain,
            sortOrder: 1,
            invisible: false,
            leaf: true,
            parentId: targetNode.get('id'),
            website: Ext.getCmp(websiteId).getValue()
        });

        defaultModel.save({
            parentNode: targetNode,
            success: function (rec, opt) {
                opt.parentNode.appendChild(rec);
                showFormPanel(rec);
            }
        });
    };

    function onDeleteProduct() {
        var targetNode = Ext.getCmp(treeId).getSelectionModel().getSelection()[0];
        var parentNode = targetNode.parentNode;
        targetNode.remove();
    }

    function moveNode(categoryId) {

        var tree = Ext.getCmp(treeId)
        var targetNode = Ext.getCmp(treeId).getSelectionModel().getSelection()[0];
        var categoryId = targetNode.get('id');
        selectTreeWindow.getComponent('categoryId').setValue(categoryId);
        //找到当前需要进行移动操作的节点  从树中移除
        var needMovedNode = selectTreeStore.getNodeById(categoryId);

        if (needMovedNode) {
            //如果它的父节点只有一个字节点 也不显示
            var parentNode = needMovedNode.parentNode;
            if (parentNode.childNodes.length == 1) {
                needMovedNode = needMovedNode.parentNode;

            }
            var parentNode = needMovedNode.parentNode;
            needMovedNode.remove();

            selectTreeWindow.on('hide', function () {
                    parentNode.insertChild(0, needMovedNode);
                },
                selectTreeWindow, {
                    single: true
                });
        }

        selectTreeWindow.setTitle('Select a category for:' + targetNode.get('name'));

        selectTreeWindow.show();

    }

    function createDescriptionTab(record) {


        return Ext.widget({
            xtype: 'uxform',
            title: i18n.getKey('prodCategoryDesc'),
            id: 'desc',
            columnCount: 1,
            model: 'CGP.model.ProductCategory',
            items: [{
                xtype: 'hidden',
                itemId: 'id',
                name: 'id',
                fieldLabel: i18n.getKey('id'),
                hidden: true,
                style: 'margin:10px'
            }, {
                xtype: 'numberfield',
                itemId: 'sortOrder',
                name: 'sortOrder',
                fieldLabel: i18n.getKey('sortOrder'),
                style: 'margin:10px'
            }, {
                xtype: 'textfield',
                itemId: 'name',
                name: 'name',
                fieldLabel: i18n.getKey('name'),
                style: 'margin:10px'
            }, {
                xtype: 'checkboxfield',
                itemId: 'invisible',
                name: 'invisible',
                fieldLabel: i18n.getKey('invisible'),
                style: 'margin:10px'
            }, {
                xtype: 'htmleditor',
                itemId: 'shortDescription',
                name: 'shortDescription',
                fieldLabel: i18n.getKey('shortDescription'),
                style: 'margin:10px',
                width: 800
            }, {
                xtype: 'htmleditor',
                itemId: 'description1',
                name: 'description1',
                fieldLabel: i18n.getKey('description') + '1',
                style: 'margin:10px',
                width: 800
            }, {
                xtype: 'htmleditor',
                itemId: 'description2',
                name: 'description2',
                fieldLabel: i18n.getKey('description') + '2',
                style: 'margin:10px',
                width: 800
            }, {
                xtype: 'htmleditor',
                itemId: 'description3',
                name: 'description3',
                fieldLabel: i18n.getKey('description') + '3',
                style: 'margin:10px',
                width: 800
            }]
        })
    }

    function createTemplateTab(record) {
        return Ext.widget({
            xtype: 'uxform',
            id: 'templateForm',
            columnCount: 1,
            title: i18n.getKey('prodCategoryTemp'),
            model: 'CGP.model.ProductCategory',
            items: [{
                xtype: 'textfield',
                itemId: 'pageTitle',
                name: 'pageTitle',
                fieldLabel: i18n.getKey('pageTitle'),
                style: 'margin:10px'
            }, {
                xtype: 'textfield',
                itemId: 'pageKeyWords',
                name: 'pageKeyWords',
                fieldLabel: i18n.getKey('pageKeyWords'),
                style: 'margin:10px'
            }, {
                xtype: 'textfield',
                itemId: 'pageDescription',
                name: 'pageDescription',
                fieldLabel: i18n.getKey('pageDescription'),
                style: 'margin:10px'
            }, {
                xtype: 'textfield',
                itemId: 'pageUrl',
                name: 'pageUrl',
                fieldLabel: i18n.getKey('pageUrl'),
                style: 'margin:10px'
            }]
        })

    }


    function createAttributePanel(record) {

        //批量增加属性到分类
        controller.batchAddAttribute = function (ids) {
            var atrributes;
            if (!ids)
                attributes = exclusiveTable.getSelectionModel().getSelection();
            else {
                if (Ext.isArray(ids)) {
                    attributes = [];
                    Ext.Array.each(ids, function (id) {
                        attributes.push(exclusiveTable.getStore().getById(id));
                    })

                }
            }
            if (Ext.isEmpty(attributes)) {
                return;
            }

            var newAttributes = [];
            Ext.Array.each(attributes, function (attribute) {
                newAttributes.push(new CGP.model.Attribute(attribute.data));
            })

            includeTable.getStore().loadData(newAttributes, true);
            exclusiveTable.getStore().remove(attributes);
        }


        //批量移除属性
        controller.batchRemoveAttribute = function () {
            var attributes = includeTable.getSelectionModel().getSelection();
            if (Ext.isEmpty(attributes)) {
                return;
            }
            var allowAttributes = [];
            var notAllow = [];
            Ext.Array.each(attributes, function (attribute) {
                if (!attribute.get('belongToParent')) {
                    allowAttributes.push(attribute);
                } else {
                    notAllow.push(attribute.get('name'));
                }
            });
            exclusiveTable.getStore().loadData(allowAttributes, true);
            includeTable.getStore().remove(allowAttributes);
            if (notAllow.length > 0)
                Ext.Msg.alert('Info', notAllow.join(',') + ' are extend from parent, can not remove from attribute list ')
        }

        controller.setAttributeDefaultValue = function (id) {
            var record = includeStore.getById(id);
            var items = [];
            var item;

            item = Qpp.CGP.util.createColumnByAttribute(record);

            items.push(item);
            var window = new Ext.window.Window({
                title: i18n.getKey('defaultValue'),
                layout: 'border',
                frame: false,
                width: 600,
                height: 400,
                items: [new Ext.form.Panel({
                    items: items,
                    region: 'center',
                    tbar: [{
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        handler: function () {
                            var item = this.ownerCt.ownerCt.items.items[0];
                            var value;
                            if (item.xtype == 'datefield') {
                                value = item.getSubmitValue();
                            } else {
                                value = item.getValue();
                                //可能为对象 或者 String
                                if (Ext.isObject(value)) {
                                    value = value[item.name];
                                    if (Ext.isArray(value)) {
                                        value = value.join(',');
                                    }
                                }
                            }
                            record.set('value', value);
                            record.commit();
                            this.ownerCt.ownerCt.ownerCt.close();
                        }
                    }]
                })]
            });

            window.show();
        }
        var includeTable = new Ext.grid.Panel({
            id: 'includeGrid',
            title: i18n.getKey('categoryAttributes'),
            multiSelect: true,
            selType: 'checkboxmodel',
            listeners: {
                edit: function (editor, context) {
                    context.grid.getStore().sort('sortOrder', 'ASC');
                }
            },
            plugins: [{
                ptype: 'rowediting',
                clicksToEdit: 2
            }],
            columns: [{
                text: i18n.getKey('operation'),
                renderer: function (value, metadata, record) {
                    return '<a href="#" onclick="controller.setAttributeDefaultValue(' + record.get('id') + ')">' + i18n.getKey('setValue') + '</a>';
                }
            }, {
                dataIndex: 'name',
                text: i18n.getKey('name')
            }, {
                dataIndex: 'showInFrontend',
                text: i18n.getKey('showInFrontend')
            }, {
                dataIndex: 'useInCategoryNavigation',
                text: i18n.getKey('useInCategoryNavigation')
            }, {
                dataIndex: 'value',
                text: i18n.getKey('value'),
                renderer: function (value, metadata, record) {
                    var options = record.get('options');
                    if (Ext.isEmpty(options)) {
                        return value;
                    }
                    if (!Ext.isEmpty(value)) {
                        var optionIds = value.split(',');
                        var value = [];
                        Ext.Array.each(optionIds, function (optionId) {
                            Ext.Array.each(options, function (option) {
                                if ((option.id + '') == optionId) {
                                    value.push(option.name);
                                    return false;
                                }
                            })
                        })
                        return value.join(',');
                    }
                }
            }, {
                dataIndex: 'sortOrder',
                text: i18n.getKey('sortOrder'),
                editor: {
                    xtype: 'numberfield',
                    allowBlack: false
                }
            }, {
                dataIndex: 'belongToParent',
                text: i18n.getKey('belongToParent')
            }],
            store: includeStore,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'selDD',
                    enableDrag: true,
                    enableDrop: true
                },
                listeners: {
                    beforedrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
                        var id = data.records[0].get('id');
                        addIds.push(id);
                    }
                }

            }
        });
        var exclusiveTable = new Ext.grid.Panel({
            id: 'exclusiveGrid',
            title: i18n.getKey('otherAttribute'),
            multiSelect: true,
            //            selType: 'checkboxmodel',
            selModel: new Ext.selection.CheckboxModel({
                checkOnly: false
            }),
            tbar: [{
                xtype: 'textfield',
                labelWidth: 40,
                fieldLabel: i18n.getKey('name'),
                itemId: 'nameSearch'
            }, {
                xtype: 'button',
                iconCls: 'icon_query',
                text: i18n.getKey('search'),
                handler: function () {
                    var me = this;
                    var name = me.ownerCt.getComponent('nameSearch').getValue();
                    var store = me.ownerCt.ownerCt.getStore();
                    if (!Ext.isEmpty(name)) {
                        store.filterBy(function (record, id) {

                            if (record.get('name').indexOf(name) > -1) {
                                return true;
                            }

                        }, store);

                    } else {
                        store.load({
                            scope: store,
                            callback: function (records, operation, success) {
                                if (success) {
                                    this.filterBy(function (record) {
                                        return includeStore.find('name', record.get('name')) == -1
                                    }, this);
                                }
                            }
                        });
                    }
                }
            }],
            columns: [{
                dataIndex: 'name',
                text: i18n.getKey('name')
            }, {
                dataIndex: 'showInFrontend',
                text: i18n.getKey('showInFrontend')
            }, {
                dataIndex: 'useInCategoryNavigation',
                text: i18n.getKey('useInCategoryNavigation')
            }],
            store: exclusiveStore,
            viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    ddGroup: 'selDD',
                    enableDrag: true,
                    enableDrop: true
                },
                listeners: {
                    //如果是父节点继承的属性   不允许删除
                    beforedrop: function (node, data, overModel, dropPosition, dropHandlers, eOpts) {
                        if (data.records[0].get('belongToParent')) {
                            Ext.Msg.alert('Info', 'This Attribte is extends from parent, can not remove from attribute list.')
                            dropHandlers.cancelDrop();
                            return;
                        }
                        //check is skuAttribute
                        if (data.records[0].get('options'), length == 0) {
                            return;
                        }
                        Ext.Ajax.request({
                            async: false,
                            url: adminPath + 'api/admin/productCategory/' + Ext.getCmp(treeId).getSelectionModel().getSelection()[0].get('id') + '/product/' + data.records[0].get('id') + '?access_token=' +
                                Ext.util.Cookies.get('token'),
                            method: 'GET',
                            success: function (response, options) {
                                var products = Ext.JSON.decode(response.responseText);
                                if (products.data.length == 0)
                                    return;
                                dropHandlers.cancelDrop();
                                var productPanel = new Ext.grid.Panel({
                                    region: 'center',
                                    store: new Ext.data.Store({
                                        fields: ['name', 'model'],
                                        data: products.data
                                    }),
                                    columns: [{
                                        dataIndex: 'name',
                                        text: 'name'
                                    }, {
                                        dataIndex: 'model',
                                        text: 'model'
                                    }]
                                });

                                var window = new Ext.window.Window({
                                    title: data.records[0].get('name') + ' is used as a sku attribtue in these products',
                                    width: 800,
                                    height: 600,
                                    layout: 'border',
                                    items: [productPanel],
                                    bbar: [{
                                        xtype: 'button',
                                        text: 'Close',
                                        handler: function () {
                                            this.ownerCt.ownerCt.close();
                                        }
                                    }]
                                })
                                window.show();

                            }
                        });
                    }
                }
            }
        });


        var buttonPanel = new Ext.panel.Panel({
            html: '<div style="position:relative;top:150px">' +
                '<button style="height: 30px;width:100%;margin-bottom:20px" onclick="controller.batchAddAttribute()">' +
                '<img src="../../ClientLibs/extjs/resources/themes/images/ux/arrow_left.png" style=" display: block;max-width:100% ;height: 30px;width:100%;"  />' +
                '</button>' +
                '<button style="height: 30px;width:100%" onclick="controller.batchRemoveAttribute()" >' +
                '<img src="../../ClientLibs/extjs/resources/themes/images/ux/arrow_right.png" style=" display: block;max-width:100% ;height: 30px;width:100%;" />' +
                '</button>' +
                '</div>',
            flex: 0.08
        });

        attributePanel = new Ext.panel.Panel({
            id: 'attributePanel',
            title: i18n.getKey('managerAttribute'),
            layout: {
                type: 'hbox',
                align: 'stretch',
                padding: 5
            },
            defaults: {
                flex: 1
            },
            items: [includeTable, buttonPanel, exclusiveTable]
        });
        return attributePanel;

    }


    function showFormPanel(record) {
        var infoPanel = Ext.getCmp(infoPanelId);
        if (infoPanel.items.length == 0) {
            infoPanel.add(createDescriptionTab(record));
            infoPanel.add(createTemplateTab(record));
            infoPanel.add(createAttributePanel(record));
            infoPanel.dockedItems.items[1].show();
        }
        //是分类   可以允许进行属性操作
        if (record.get('isMain')) {
            if (infoPanel.items.items.length == 2) {
                infoPanel.add(createAttributePanel());
            }
        } else {
            if (infoPanel.items.items.length == 3) {
                infoPanel.remove(attributePanel);
            }
        }
        infoPanel.items.each(function (form) {
            if (form.xtype == 'uxform')
                form.form.setValuesByModel(record);
        });

        includeStore.proxy.url = Ext.String.format(includeUrl, record.get('id'));
        includeStore.removeAll();
        includeStore.load();
        exclusiveStore.proxy.url = Ext.String.format(exclusiveUrl, record.get('id'));
        exclusiveStore.removeAll();
        exclusiveStore.load();

        infoPanel.setActiveTab(infoPanel.items.items[0]);
    }

    //查看该分类 或者 目录下的产品
    //跳转到产品页面进行查看
    //并且初始化网站和主分类和目录进行查询展示
    function checkProduct() {
        var targetNode = Ext.getCmp(treeId).getSelectionModel().getSelection()[0];
        var id = targetNode.get('id');
        var isMain = targetNode.get('isMain');
        var websiteId = targetNode.get('website');
        if (isMain) {
            JSOpen({
                id: 'productpage',
                url: path + 'partials/product/product.html?mainCategory=' + id + '&website=' + websiteId,
                title: 'Product'
            });
        } else {
            JSOpen({
                id: 'productpage',
                url: path + 'partials/product/product.html?subCategory=' + id + '&website=' + websiteId,
                title: 'Product'
            });
        }

    }


    controller.onItemRightClick = function (view, record, item, index, e, eOpts) {
        e.stopEvent();
        if (!menu) {
            menu = Ext.create('Ext.menu.Menu', {
                id: 'treeMenu',
                items: [{
                    text: i18n.getKey('addSub'),
                    itemId: 'addProduct',
                    handler: onAddChild
                }, {
                    text: i18n.getKey('delete'),
                    itemId: 'deleteProduct',
                    handler: onDeleteProduct
                }, {
                    text: i18n.getKey('checkProduct'),
                    itemId: 'checkProduct',
                    handler: checkProduct
                }, {
                    text: i18n.getKey('move') + '...',
                    handler: moveNode
                }]
            });
        }
        if (isMain && record.get('parentId') == -1) {
            menu.getComponent('deleteProduct').setVisible(false)
        } else {
            menu.getComponent('deleteProduct').setVisible(true);
        }

        menu.showAt(e.getXY());
    }

    controller.onAddParentNode = function () {

        var website = Ext.getCmp(websiteId).getValue();
        var defaultModel = new CGP.model.ProductCategory({
            name: 'new',
            sortOrder: 1,
            invisible: false,
            leaf: true,
            isMain: isMain,
            website: website
        });
        defaultModel.save({
            parentNode: Ext.getCmp(treeId).getRootNode(),
            success: function (rec, opt) {
                opt.parentNode.appendChild(rec);
                showFormPanel(rec);
            }
        });
    }

    controller.onItemClick = function (view, record, item, index, e, eOpts) {
        showFormPanel(record);
    }

    controller.save = function () {
        var data = {};


        //includeStore单独进行提交
        var attributes = [];
        includeStore.each(function (attribute) {
            var data = Ext.clone(attribute.data);
            data.options = [];
            attributes.push(data);
        });

        Ext.Ajax.request({
            method: 'PUT',
            url: includeStore.getProxy().url + '?access_token=' + Ext.util.Cookies.get('token'),
            jsonData: attributes,
            success: function (response, options) {
                var data = Ext.JSON.decode(response.responseText);

                if (data.success) {
                    Ext.Msg.alert('Info', 'Save Success!');
                } else {
                    if (data.message) {
                        Ext.Msg.alet('Info', data.message);
                    } else {
                        var records = data.data;
                        var productPanel = new Ext.grid.Panel({
                            region: 'center',
                            width: 600,
                            store: new Ext.data.Store({
                                fields: ['title', 'name', 'model'],
                                data: records,
                                groupField: 'title'
                            }),
                            columns: [{
                                dataIndex: 'name',
                                text: 'name'
                            }, {
                                dataIndex: 'model',
                                text: 'model'
                            }],
                            features: [{
                                id: 'group',
                                ftype: 'groupingsummary',
                                groupHeaderTpl: '{name}',
                                hideGroupedHeader: true,
                                enableGroupingMenu: false
                            }]
                        });

                        var window = new Ext.window.Window({
                            width: 800,
                            height: 600,
                            layout: 'border',
                            items: [productPanel]
                        })
                        window.show();
                        var recoverIds = [];
                        Ext.Array.each(records, function (record) {
                            recoverIds.push(record.id);
                        })
                        controller.batchAddAttribute(recoverIds);

                    }
                }
            }
        });


        Ext.getCmp(infoPanelId).items.each(function (form) {
            if (form.xtype == 'uxform')
                data = Ext.merge(data, form.form.getValuesByModel('CGP.model.ProductCategory'));
        });

        var currentNode = store.getNodeById(data.id);
        store.suspendAutoSync();
        Ext.Object.each(data, function (k, v) {
            currentNode.set(k, v);
        })
        store.sync({
            success: function (batch, options) {
                //                Ext.Msg.alert('Info', 'Save Success!');
            },
            failure: function (batch, options) {
                Ext.Msg.alert('Info', 'Save error!')
            }
        });
        store.resumeAutoSync();
    }

    window.controller = controller;
}