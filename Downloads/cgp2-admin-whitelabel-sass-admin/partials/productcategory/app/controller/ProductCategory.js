Ext.define('CGP.productcategory.controller.ProductCategory', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'tree',
            selector: 'productcategorytree'
        },
        {
            ref: 'moveTree',
            selector: 'productcategorymovetree'
        },
        {
            ref: 'moveWindow',
            selector: 'productcategorymovewindow'
        },
        {
            ref: 'websiteSelector',
            selector: 'websiteselector'
        },
        {
            ref: 'effectProducts',
            selector: 'producteffect'
        },
        {
            ref: 'information',
            selector: 'productcategoryinfo'
        }
    ],


    views: [
        'productcategory.Tree',
        'productcategory.Menu',
        'productcategory.MoveTree',
        'productcategory.MoveWindow',
        'website.Selector',
        'product.Effect',
        'productcategory.Information'
    ],

    stores: [
        'ProductCategory',
        'Website'
    ],
    models: [
        'ProductCategory',
        'Website'
    ],
    constructor: function (config) {

        this.callParent(arguments);
    },

    init: function () {

        var me = this;

        me.control({
            'productcategorytree': {
                itemcontextmenu: me.showActionMenu,
                itemclick: me.showInfoPanel
            },
            'productcategorytree button[action=addSubCategory]': {
                click: me.addSubCategory
            },
            'productcategorymenu menuitem[action=add]': {
                click: me.addCategory
            },
            'productcategorymenu menuitem[action=delete]': {
                click: me.deleteCategory
            },
            'productcategorymenu menuitem[action=checkproduct]': {
                click: me.checkProduct
            },
            'productcategorymenu menuitem[action=move]': {
                click: me.moveCategory
            },
            'productcategorymovetree button[action=confirmmove]': {
                click: me.confirmMove
            },
            'productcategorymovetree': {
                itemclick: me.moveEnabled
            },
            'producteffect button[action=effectmove]': {
                click: me.confirmEffectMove
            }
        });

    },

    showActionMenu: function (view, record, item, index, e, eOpts) {
        this.showInfoPanel(view, record, item, index, e, eOpts);
        e.stopEvent();

        var menu = Ext.widget({
            xtype: 'productcategorymenu',
            record: record

        })

        menu.showAt(e.getXY());
    },
    moveEnabled: function () {
        var moveTree = this.getMoveTree();
        moveTree.getDockedItems()[0].getComponent('ok').setDisabled(false);
    },
    deleteCategory: function () {
        console.log('Delete');
        var tree = this.getTree();
        var targetNode = tree.getSelectionModel().getSelection()[0];
        var parentNode = targetNode.parentNode;
        Ext.Msg.confirm('提示', '确定删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                if (targetNode.data.productsInfo && targetNode.data.productsInfo.total > 0) {
                    Ext.Msg.alert('提示', '该类目拥有产品不允许删除！')
                } else {
                    targetNode.remove();
                }
            }
        }
    },
    checkProduct: function () {
        console.log('Check Product');

        var tree = this.getTree();
        var targetNode = tree.getSelectionModel().getSelection()[0];
        var id = targetNode.get('id');
        var isMain = targetNode.get('isMain');
        var websiteId = targetNode.get('website');
        if (tree.isMain) {
            JSOpen({
                id: 'productpage',
                url: path + 'partials/product/product.html?mainCategory=' + id + '&website=' + websiteId,
                title: i18n.getKey('product'),
                refresh: true
            });
        } else {
            JSOpen({
                id: 'productpage',
                url: path + 'partials/product/product.html?subCategory=' + id + '&website=' + websiteId,
                title: i18n.getKey('product'),
                refresh: true
            });
        }

    },

    initMoveWindow: function (isMain) {

        var me = this;

        if (this.getMoveWindow()) {
            return this.getMoveWindow();
        }

        var tree = this.getTree();
        var websiteSelector = this.getWebsiteSelector();

        var moveWindow = Ext.widget({
            xtype: 'productcategorymovewindow',
            isMain: isMain,
            website: websiteSelector.getValue()
        });

        var moveTree = this.getMoveTree();
        var selectTreeStore = moveTree.getStore();


        selectTreeStore.relayEvents(websiteSelector, ['select'], 'website');
        selectTreeStore.on('websiteselect', function (combo, record) {

            selectTreeStore.proxy.extraParams.website = record[0].get('id');
            selectTreeStore.load({
                callback: function () {
                    moveTree.expandAll();
                }
            });
        });

        selectTreeStore.on('load', function () { //找到当前需要进行移动操作的节点  从树中移除

            if (tree.getSelectionModel().getSelection().length == 0) {
                return;
            }

            var selected = tree.getSelectionModel().getSelection()[0];
            if (!selected) {
                return;
            }
            var categoryId = selected.get('id');
            var needMovedNode = moveTree.getStore().getNodeById(categoryId);

            if (needMovedNode) {
                moveWindow.setTitle(i18n.getKey('selectCategory') + ':' + needMovedNode.get('name'));
                //如果它的父节点只有一个子节点 也不显示
                var parentNode = needMovedNode.parentNode;
                if (parentNode.childNodes.length == 1) {
                    needMovedNode = needMovedNode.parentNode;

                }
                var parentNode = needMovedNode.parentNode;
                needMovedNode.remove();

                moveWindow.on('hide', function () {
                        parentNode.insertChild(0, needMovedNode);
                    },
                    moveWindow, {
                        single: true
                    });

            }


        })

        moveWindow.on('beforeshow', function () {
            var categoryId = tree.getSelectionModel().getSelection()[0].get('id');
            //找到当前需要进行移动操作的节点  从树中移除
            var needMovedNode = moveTree.getStore().getNodeById(categoryId);

            if (needMovedNode) {
                moveWindow.setTitle(i18n.getKey('selectCategory') + ':' + needMovedNode.get('name'));
                //如果它的父节点只有一个子节点 也不显示
                var parentNode = needMovedNode.parentNode;
                if (parentNode.childNodes.length == 1) {
                    needMovedNode = needMovedNode.parentNode;

                }
                var parentNode = needMovedNode.parentNode;
                needMovedNode.remove();

                moveWindow.on('hide', function () {
                        parentNode.insertChild(0, needMovedNode);
                    },
                    moveWindow, {
                        single: true
                    });

            }


            return true;
        });


        return moveWindow;
    },

    moveCategory: function () {
        console.log('Move');

        var tree = this.getTree();


        var moveWindow = this.getMoveWindow() || this.initMoveWindow(tree.isMain);
        var moveTree = this.getMoveTree();

        var selectTreeStore = moveTree.getStore();
        var targetNode = tree.getSelectionModel().getSelection()[0];
        var categoryId = targetNode.get('id');
        moveWindow.getComponent('categoryId').setValue(categoryId);
        moveWindow.show();

    },
    confirmMove: function () {
        {
            var tree = this.getTree();
            var moveTree = this.getMoveTree();
            var moveWindow = this.getMoveWindow();
            var record = moveTree.getSelectionModel().getSelection()[0];
            var treeStore = tree.getStore();
            var categoryId = Ext.Number.from(moveWindow.getComponent('categoryId').getValue());


            //获得将要被应用改变的product
            if (tree.isMain) {
                Ext.Ajax.request({
                    url: adminPath + 'api/admin/productCategory/' + categoryId + '/product?access_token=' + Ext.util.Cookies.get('token'),
                    method: 'GET',
                    async: false,
                    success: function (response, options) {
                        var resp = Ext.JSON.decode(response.responseText);
                        if (resp.success) {


                            if (resp.data.length == 0) {
                                Ext.Ajax.request({
                                    url: adminPath + 'api/productCategories/' + categoryId + '/move/' + record.get('id') + '?access_token=' + Ext.util.Cookies.get('token'),
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
                                            moveTree.ownerCt.close();
                                        } else {
                                            Ext.Msg.alert('Info', resp.data.message);
                                        }
                                    },
                                    failure: function (resp, options) {
                                        var response = Ext.JSON.decode(resp.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                    }
                                });
                            } else {

                                var grid = Ext.widget({
                                    xtype: 'producteffect',
                                    data: resp.data
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
                            Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                        }
                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            } else {
                Ext.Ajax.request({
                    url: adminPath + 'api/productCategories/' + categoryId + '/move/' + record.get('id') + '?access_token=' + Ext.util.Cookies.get('token'),
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
                            moveTree.ownerCt.close();
                        } else {
                            Ext.Msg.alert('Info', resp.data.message);
                        }
                    },
                    failure: function (resp, options) {
                        var response = Ext.JSON.decode(resp.responseText);
                        Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                    }
                });
            }

        }
    },
    confirmEffectMove: function () {

        var tree = this.getTree();
        var moveTree = this.getMoveTree();
        var moveWindow = this.getMoveWindow();
        var record = moveTree.getSelectionModel().getSelection()[0];
        var treeStore = tree.getStore();
        var categoryId = Ext.Number.from(moveWindow.getComponent('categoryId').getValue());
        var effectProducts = this.getEffectProducts();

        Ext.Ajax.request({
            url: adminPath + 'api/productCategories/' + categoryId + '/move/' + record.get('id') + '?access_token=' + Ext.util.Cookies.get('token'),
            method: 'PUT',
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {

                    effectProducts.ownerCt.close();

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
                    moveTree.ownerCt.close();

                } else {
                    Ext.Msg.alert('Info', resp.data.message);
                }
            },
            failure: function (resp, options) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    },

    //在根节点加产品类目
    addSubCategory: function () {
        var me = this;
        this.category(null, me.getTree());
    },

    category: function (parentNode, tree) {


        var miwindow = Ext.MessageBox.prompt(i18n.getKey('newCategory'), i18n.getKey('enterCategoryName'), function (even, value) {
            if (even == "ok") {
                var defaultModel = new CGP.productcategory.model.ProductCategory({
                    name: value,
                    sortOrder: 1,
                    invisible: false,
                    leaf: true,
                    isMain: tree.isMain,
                    website: tree.website,
                    parentId: (parentNode == null) ? null : parentNode.get("id")
                });

                defaultModel.save({
                    parentNode: (parentNode == null) ? tree.getRootNode() : parentNode,
                    success: function (rec, opt) {
                        opt.parentNode.appendChild(rec);
                    }
                });
            }
        });


    },
    //在产品类目加产品类目
    addCategory: function () {
        var tree = this.getTree();
        var targetNode = tree.getSelectionModel().getSelection()[0];
        targetNode.set('leaf', false);
        targetNode.set('expanded', true);
        this.category(targetNode, tree);
    },

    showInfoPanel: function (view, record, item, index, e, eOpts) {

        var me = this;
        var information = this.getInformation();
        if (information.recordId && information.recordId == record.get('id'))
            return;
        information.refreshData(record);
    }
})
