Ext.define('CGP.productcategory.view.productcategory.Tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.productcategorytree',
    mixins: ['Ext.ux.util.ResourceInit'],

    config: {
        autoScroll: true,
        rootVisible: false,
        useArrows: true,

        viewConfig: {
            stripeRows: true,
            plugins: {
                ptype: 'treeviewdragdrop',
                enableDrag: true,
                enableDrop: true
            }
        }
    },
    isMain: true,
    website: 1,


    initComponent: function () {
        var me = this;
        Ext.apply(Ext.form.field.VTypes, {
            number: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            numberText: '只能输入数值',
            numberMask: /^\d$/
        });
        me.title = i18n.getKey('productCategory');
        me.selector = Ext.widget({
            xtype: 'websiteselector',
            width: 240
        });
        me.searcher = Ext.widget('trigger', {
            vtype: 'number',
            minLength: 6,
            flex: 3,
            defaultValue: null,
            itemId: 'materialCategorySearch',
            trigger1Cls: 'x-form-clear-trigger',
            trigger2Cls: 'x-form-search-trigger',
            checkChangeBuffer: 600,//延迟600毫秒
            emptyText: '按Id查询类目',
            onTrigger2Click: function () {//按钮操作
                var me = this;
                var treePanel = me.ownerCt.ownerCt;
                var categoryId = me.getValue();
                var store = treePanel.store;
                var oldParams = store.params;
                if (!Ext.isEmpty(categoryId)) {
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
                    store.params = oldParams;
                    //store.proxy.url = oldUrl;
                }

            },
            onTrigger1Click: function () {//按钮操作
                var me = this;
                if (me.isValid()) {
                    var treePanel = me.ownerCt.ownerCt;
                    me.reset();
                    delete treePanel.store.params.filter;
                    delete treePanel.store.proxy.extraParams.filter;
                    delete treePanel.store.params.page;//去除单个查询中特别添加的过滤参数
                    treePanel.store.load({
                            params: treePanel.store.params
                        }
                    );
                }
            }
        });

        me.store = Ext.create('CGP.productcategory.store.ProductCategory', {
            params: {
                website: me.website,
                isMain: me.isMain,
                limit: 25
            }
        });


        me.dockedItems = {
            xtype: 'toolbar',
            dock: 'top',
            items: [me.selector]
        }
        var tbar = [];
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: me.store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
            emptyMsg: i18n.getKey('noData')
        });
        if (true) {  //!me.isMain
            tbar.push({
                text: i18n.getKey('addCategory'),
                iconCls: 'icon_add',
                action: 'addSubCategory'
            }, me.searcher);
            me.tbar = tbar;
        }

        Ext.apply(me, {
            columns: [
                {
                    xtype: 'treecolumn',
                    text: i18n.getKey('name') + '(' + i18n.getKey('productAmount') + ')',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'name',
                    locked: true,
                    renderer: function (value, metadata, record) {
                        if (record.get('productsInfo'))
                            return value + '-<font color="green">' + record.getId() + '</font>(' + record.get('productsInfo').total + ')';
                        else
                            return value + '-' + record.getId() + '(0)';
                    }
                }
            ]
        });
        this.callParent(arguments);

        me.websiteSelect();
        me.expandAll();
    },

    /**
     *绑定website选择事件到树上
     *当选择网站改变时 树重新加载
     */
    websiteSelect: function () {
        var me = this;
        var store = me.getStore();
        store.relayEvents(me.selector, ['select'], 'website');
        store.on('websiteselect', function (combo, record) {
            var selection;
            var selModel = me.getSelectionModel();
            //需要将Selection设为undenfied 才能正常刷新页面
            var selected = selModel.select(selection);
            me.website = record[0].get('id');
            store.params.website = me.website;
            store.load({
                params: {
                    website: me.website,
                    isMain: me.isMain
                },
                callback: function () {
                    me.expandAll();
                }
            });
        })
    }


})
