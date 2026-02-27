/**
 * Created by nan on 2021/9/7
 */

Ext.define("CGP.pcresourcelibrary.view.CategoryGridCombo", {
    extend: 'Ext.ux.tree.UxTreeComboHasPaging',
    alias: 'widget.categorygridcombo',
    valueField: '_id',
    displayField: '_id',
    store: null,
    editable: false,
    matchFieldWidth: false,
    treeWidth: 400,
    valueType: 'idReference',
    multiselect: false,
    infoUrl: adminPath + 'api/pCResourceCategories/{_id}',
    isHiddenCheckSelected: true,
    resourceType: null,//资源类型的子类
    categoryId: null,//是否有指定分类
    defaultColumnConfig: {
        renderer: function (value, metadata, record) {
            return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
        }
    },
    //重写查询按钮的执行操作
    doSearch: function () {
        var treePanel = this.ownerCt.ownerCt;
        var requestParamValue = this.getValue();
        var store = treePanel.store;
        if (!Ext.isEmpty(requestParamValue)) {
            var oldUrl = store.proxy.url;
            store.proxy.url = adminPath + 'api/pCResourceCategories/' + requestParamValue
            store.load();
            store.proxy.url = oldUrl;
        }
    },
    //重写picker中重置按钮的执行操作
    doReset: function () {
        var treePanel = this.ownerCt.ownerCt;
        this.setValue(null);
        treePanel.store.load();
    },
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('CGP.pcresourcelibrary.store.PCResourceCategoryTreeStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'type',
                    type: 'string',
                    value: me.resourceType
                }])
            }
        });
        me.callParent();
    },
    diyGetValue: function () {
        return {
            _id: this.getValue() || this.categoryId,
            clazz: 'com.qpp.cgp.domain.pcresource.PCResourceCategory'
        }
    },
    diySetValue: function (data) {
        if (data) {
            this.setInitialValue([data._id])
        }
    },
})
