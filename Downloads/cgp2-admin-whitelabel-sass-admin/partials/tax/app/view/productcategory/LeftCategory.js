/**
 * LeftCatetory
 * @Author: miao
 * @Date: 2021/11/6
 */
Ext.define("CGP.tax.view.productcategory.LeftCategory", {
    extend: "Ext.panel.Panel",
    alias: 'widget.leftcategory',
    layout: 'border',
    // border:0,
    taxId: null,
    initComponent: function () {
        var me = this;
        var searchBar = {
            xtype: 'panel',
            region: 'north',
            height: 100,
            padding: '5',
            layout: {
                type: 'vbox',
                align: 'right'
            },
            defaults: {
                margin: '5 10',
            },
            items: [
                {
                    xtype: 'trigger',
                    vtype: 'number',
                    minLength: 1,
                    minLengthText: '必须大于六个字符',
                    width: 280,
                    defaultValue: null,
                    itemId: 'categoryIdSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按Id查询分类',
                    onTrigger2Click: function () {//按钮操作
                        var that = this;
                        var grid = that.ownerCt.ownerCt.getComponent("categoryGrid");
                        var categoryId = that.getValue();
                        if (!Ext.isEmpty(categoryId)) {
                            that.ownerCt.getComponent("categoryNameSearch").reset();
                            var params = [];
                            params.push({
                                name: 'id',
                                type: 'number',
                                value: Number(categoryId)
                            });
                            me.searchCategory(grid.store, params);
                        }
                    },
                    onTrigger1Click: function () {//重置按钮操作
                        var that = this;
                        me.searchReset(that);
                    }
                },
                {
                    xtype: 'trigger',
                    width: 280,
                    defaultValue: null,
                    itemId: 'categoryNameSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按名称查询分类',
                    onTrigger1Click: function () {//重置按钮操作
                        var that = this;
                        me.searchReset(that);
                    },
                    onTrigger2Click: function () {//查询按钮操作
                        var that = this;
                        var grid = that.ownerCt.ownerCt.getComponent("categoryGrid");
                        var categoryName = that.getValue();
                        if (!Ext.isEmpty(categoryName)) {
                            that.ownerCt.getComponent("categoryIdSearch").reset();
                            var params = [];
                            params.push({
                                name: 'name',
                                type: 'string',
                                value: categoryName
                            });
                            me.searchCategory(grid.store, params);
                        }
                    }
                }
            ]
        };
        me.items = [
            searchBar,
            {
                xtype: 'categorygrid',
                itemId: 'categoryGrid',
                region: 'center',
                width: 300,
                padding: 5,
                taxId: me.taxId
            }
        ];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            data[item.name] = item.getValue()
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        for (var item of items) {
            item.setValue(data[item.name]);
        }
    },
    /**
     * 查询tag
     * @param treePanel
     * @param store
     * @param tagId
     */
    searchCategory: function (store, params) {
        if (Ext.isEmpty(params) || params.length < 1) {
            return false;
        }
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(params)
        };
        store.load({
            scope: this,
            callback: function (records, operation, success) {
                if (!success) {
                    Ext.Msg.alert('提示', '查询异常！');
                }
            }
        });
    },

    searchReset: function (comp) {
        if (comp.isValid()) {
            var grid = comp.ownerCt.ownerCt.getComponent("categoryGrid");
            var store = grid.store;
            comp?.reset();
            delete store.proxy.extraParams.filter;
            store.load();
        }
    }
});