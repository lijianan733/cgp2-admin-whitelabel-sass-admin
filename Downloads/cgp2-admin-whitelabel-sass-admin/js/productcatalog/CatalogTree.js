Ext.Loader.syncRequire([
    'Ext.ux.toolbar.TreePagingToolbar'
]);
Ext.define("CGP.productcatalog.CatalogTree", {
    extend: "Ext.tree.Panel",
    mixins: ['Ext.ux.util.ResourceInit'],
    region: 'west',
    width: 420,
    collapsible: true,
    rootVisible: false,
    useArrows: true,
    viewConfig: {
        enableTextSelection: true,
        stripeRows: true,
        loadMask: true,
        markDirty: false,
    },
    autoScroll: true,
    children: null,
    title: i18n.getKey('product') + i18n.getKey('catalog'),
    itemId: 'productCatalog',
    selModel: {
        selType: 'rowmodel'
    },
    showAsProductCatalog: true,
    initComponent: function () {
        var me = this;
        var queryId = JSGetQueryString('id');
        var controller = Ext.create('CGP.productcatalog.controller.Controller');
        Ext.apply(Ext.form.field.VTypes, {
            number: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            numberText: '请输入正确的id',
            numberMask: /^\d$/
        });
        var treeResetHandler = function () {//按钮操作
            var me = this;
            var treePanel = me.ownerCt.ownerCt;
            me.setValue();
            delete treePanel.store.params.filter;
            delete treePanel.store.proxy.extraParams.filter;
            delete treePanel.store.params.page;//去除单个查询中特别添加的过滤参数
            treePanel.store.load({
                params: treePanel.store.params
            });
            if (me.itemId == 'productSearch') {
                treePanel.searchProductId = '';
            }
        };
        var commonListener = {
            afterrender: function () {
                var field = this;
                Ext.create('Ext.util.KeyNav', field.el, {
                    enter: function () {
                        field.onTrigger2Click();
                    }, scope: this
                });
            }
        };
        var store = Ext.create('CGP.productcatalog.store.ProductCatalogStore', {
            root: {
                id: '-1',
                name: ''
            },
            autoSync: false,
            clearOnLoad: false,
            params: {
                website: 11,
                isMain: false,
                filter: queryId ? ('[{"name": "id", "type": "number", "value":' + queryId + '}]') : '[{"name": "publishStatus", "type": "number", "value":1}]',
                showAsProductCatalog: me.showAsProductCatalog ?? true,
                limit: 25
            }
        });
        me.store = store;
        me.tbar = {
            xtype: 'toolbar',
            dock: 'top',
            height: 95,
            layout: {
                type: 'table',
                columns: 2
            },
            items: [
                {
                    xtype: 'trigger',
                    vtype: 'number',
                    minLength: 1,
                    width: 180,
                    defaultValue: null,
                    itemId: 'productCategorySearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按id查询类目',
                    value: queryId,
                    onTrigger2Click: function () {//查询按钮操作
                        var me = this;
                        if (me.isValid()) {
                            var treePanel = me.ownerCt.ownerCt;
                            var categoryId = me.getValue();
                            var store = treePanel.store;
                            var oldParams = store.params;
                            if (!Ext.isEmpty(categoryId)) {
                                store.clearOnLoad = true;
                                store.load({
                                    params: Ext.Object.merge(Ext.clone(store.params), {
                                        filter: Ext.JSON.encode([{
                                            name: 'id',
                                            type: 'number',
                                            value: categoryId
                                        }]),
                                        page: 1//过滤出来的第一页，如果不是第一页，数据没法返回
                                    })
                                });
                                store.clearOnLoad = false;
                                delete oldParams.filter;
                                store.params = oldParams;
                            }
                        }
                    },
                    onTrigger1Click: treeResetHandler,
                    listeners: commonListener
                },
                {
                    xtype: 'trigger',
                    minLength: 1,
                    width: 180,
                    defaultValue: null,
                    itemId: 'nameSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '名称查询类目',
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        if (me.isValid()) {
                            var treePanel = me.ownerCt.ownerCt;
                            var name = me.getValue();
                            var store = treePanel.store;
                            var oldParams = store.params;
                            if (!Ext.isEmpty(name)) {
                                store.clearOnLoad = true;
                                store.load({
                                    params: Ext.Object.merge(store.params, {
                                        filter: Ext.JSON.encode([{
                                            name: 'name',
                                            type: 'string',
                                            value: name
                                        }]),
                                        page: 1//过滤出来的第一页，如果不是第一页，数据没法返回
                                    })
                                });
                                store.clearOnLoad = false;
                                store.params = oldParams;
                            }
                        }
                    },
                    onTrigger1Click: treeResetHandler,
                    listeners: commonListener
                },
                {
                    xtype: 'combo',
                    minLength: 1,
                    width: 180,
                    value: 1,
                    itemId: 'statusSearch',
                    displayField: 'name',
                    valueField: 'value',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '状态查询类目',
                    value: '',
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {name: '启用', value: 1},
                            {name: '弃用', value: 2}, {
                                value: '',
                                name: i18n.getKey('allType')
                            },]
                    }),
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        if (me.isValid()) {
                            var treePanel = me.ownerCt.ownerCt;
                            var name = me.getValue();
                            var store = treePanel.store;
                            var oldParams = store.params;
                            if (!Ext.isEmpty(name)) {
                                store.clearOnLoad = true;
                                var params = Ext.Object.merge(store.params, {
                                    filter: Ext.JSON.encode([{
                                        name: 'publishStatus',
                                        type: 'number',
                                        value: name
                                    }]),
                                    page: 1//过滤出来的第一页，如果不是第一页，数据没法返回
                                });
                                store.loadPage(1,{
                                    params: params
                                });
                                delete params.page;
                                store.clearOnLoad = false;
                                store.params = params;
                            } else {
                                treeResetHandler.apply(me, arguments);
                            }
                        }
                    },
                    listeners: commonListener
                },
                {
                    xtype: 'trigger',
                    vtype: 'number',
                    width: 180,
                    defaultValue: null,
                    itemId: 'productSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    minLength: 6,
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按Id查询产品',
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var productId = me.getValue();
                        if (me.isValid()) {
                            if (productId) {
                                var treePanel = me.ownerCt.ownerCt;
                                var url = adminPath + 'api/product-of-catalog?' +
                                    'page=1&limit=25&' +
                                    'filter= [' +
                                    '{"name":"product._id","value":' + productId + ',"type":"number"},' +
                                    '{"name":"catalog.showAsProductCatalog","value":' + treePanel.showAsProductCatalog + ',"type":"boolean"}' +
                                    ']';
                                JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                                    if (success) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        if (responseMessage.success) {
                                            var data = responseMessage.data.content || [];
                                            //产品类目
                                            var categoryIds = [];
                                            data.map(function (item) {
                                                categoryIds.push(item.catalog.id);
                                            })
                                            treePanel.searchProductId = productId;
                                            if (!Ext.isEmpty(productId)) {
                                                var oldUrl = store.proxy.url;
                                                store.clearOnLoad = true;
                                                store.load({
                                                    params: {
                                                        filter: '[{"name":"includeIds","value":[' + categoryIds.toString() + '],"type":"number"}]'
                                                    },
                                                    page: 1,
                                                    callback: function () {
                                                        if (treePanel.showAsProductCatalog) {
                                                            treePanel.getSelectionModel().select(arguments[0][0]);
                                                        }
                                                    }
                                                });
                                                store.clearOnLoad = false;
                                                store.proxy.url = oldUrl;
                                            }
                                        }
                                    }
                                }, true);
                            }
                        }
                    },
                    onTrigger1Click: treeResetHandler,
                    listeners: commonListener
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('catalog'),
                    iconCls: 'icon_create',
                    //hidden:
                    handler: function () {
                        controller.addCategory(me, null, me.getRootNode());
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('publish') + i18n.getKey('catalog') + i18n.getKey('page'),
                    iconCls: 'server_go',
                    //hidden:
                    handler: function () {
                        JSOpen({
                            id: 'publishcatalogpage',
                            url: path + 'partials/cmsconfig/main.html?type=NormalPage',
                            title: i18n.getKey('normalPagePublishConfig'),
                            refresh: true
                        })
                    }
                }
            ]
        };
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name') + '(' + i18n.getKey('productAmount') + ')',
                flex: 1,
                tdCls: 'vertical-middle',
                dataIndex: 'name',
                renderer: function (value, metadata, record) {
                    if (record.get('productsInfo'))
                        return value + '-<font color="green">' + record.getId();// + '</font>(' + record.get('productsInfo').total + ')';
                    else
                        return value + '-' + record.getId();// + '(0)';
                }
            },
            {
                text: i18n.getKey('status'),
                width: 120,
                dataIndex: 'publishStatus',
                renderer: function (value, metadata, record) {
                    var fontText = {
                        text: value == 1 ? '启用' : '弃用',
                        color: value == 1 ? 'green' : 'red'
                    };
                    var str1 = record.get('publishStatus') == 1 ? '<font color="green" style="font-weight: bold">启用</font>' : '<font color="red" style="font-weight: bold">弃用</font>';
                    var str2 = record.get('isRelease') == true ? '<font color="green" style="font-weight: bold">Release</font>' : '<font color="orange" style="font-weight: bold">Stage</font>';
                    var arr = [
                        {title: '状态', value: str1},
                        {title: '模式', value: str2}
                    ];
                    return JSCreateHTMLTable(arr);
                }
            },
            {
                text: i18n.getKey('优先级'),
                width: 100,
                iconCls: null,
                expanderCls: null,
                dataIndex: 'sortOrder',
                renderer: function (value, metadata, record) {
                    if (value == 1) {
                        return value;
                    } else {
                        return value;
                    }
                }
            }
        ];
        me.bbar = {//底端的分页栏
            xtype: 'treepagingtoolbar',
            store: store,
        };
        me.listeners = {
            select: function (rowModel, record, index, eOpts) {
                var isLeaf = record.get('isLeaf');
                var parentId = record.get('parentId');
                var centerPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerPanel');
                var searchProductId = me.searchProductId;
                controller.refreshMaterialGrid(record.data, centerPanel, isLeaf, parentId, searchProductId);
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var parentId = record.get('parentId');
                var isLeaf = record.get('isLeaf');
                var treeType = 'categoryTree';
                controller.categoryEventMenu(view, record, e, parentId, isLeaf, treeType);
            }
        }
        me.callParent();

    }
});
