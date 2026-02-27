/**
 * @Description:
 * @author nan
 * @date 2022/5/12
 */
Ext.Loader.syncRequire(['CGP.cmslog.store.CategoryTreeStore']);
Ext.define('CGP.cmslog.view.CategoryTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.categorytree',
    autoScroll: true,
    rootVisible: false,
    useArrows: true,
    selModel: Ext.create("Ext.selection.CheckboxModel", {
        injectCheckbox: 0,//checkbox位于哪一列，默认值为0
        mode: "simple",//multi,simple,single；默认为多选multi
        checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
        allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
        enableKeyNav: true,//开启/关闭在网格内的键盘导航。
        showHeaderCheckbox: true//如果此项为false在复选框列头将不显示.
    }),
    isMain: true,
    header: false,
    website: 11,
    suppressSelectEvent: true,//是否挂起选择事件
    selectedRecords: null,
    filter: null,//过滤栏
    initComponent: function () {
        var me = this;
        me.selectedRecords = new Ext.util.MixedCollection();
        me.listeners = Ext.Object.merge({
            afterrender: function () {
                var treePanel = this;
                var mask = new Ext.LoadMask(treePanel, {
                    msg: "加载中..."
                });
                treePanel.store.on('beforeload', function (store) {
                    var p = store.getProxy();
                    mask.show();
                    treePanel.filter;
                    p.extraParams.filter = Ext.JSON.encode(treePanel.filter.getQuery());
                });
                treePanel.store.load({
                    callback: function () {
                        treePanel.expandAll();
                    }
                });
                treePanel.store.on('load', function (store) {
                    mask.hide();
                });
                treePanel.view.on('refresh', function (view) {
                    var store = view.ownerCt.store;
                    var selectRecords = view.ownerCt.selectedRecords;
                    var idProperty = store.proxy.reader.getIdProperty();
                    var records = [];
                    var rootNode = treePanel.getRootNode();
                    for (var i = 0; i < selectRecords.length; i++) {
                        var record = rootNode.findChild(idProperty, selectRecords.keys[i], true);
                        if (record) {
                            records.push(record);
                        }
                    }
                    view.ownerCt.getSelectionModel().select(records, false, treePanel.suppressSelectEvent);//不触发事件
                });
            },
            afteritemexpand: function () {
                var treePanel = this;
                var store = treePanel.store;
                var selectRecords = treePanel.selectedRecords;
                var idProperty = store.proxy.reader.getIdProperty();
                var records = [];
                var rootNode = treePanel.getRootNode();
                for (var i = 0; i < selectRecords.length; i++) {
                    var record = rootNode.findChild(idProperty, selectRecords.keys[i], true);
                    if (record) {
                        records.push(record);
                    }
                }
                treePanel.getSelectionModel().select(records, false, treePanel.suppressSelectEvent);//不触发事件
            }
        }, me.listeners);
        me.filter = me.tbar = Ext.create('Ext.ux.filter.Panel', {
            header: false,
            minHeight: 75,
            layout: {
                type: 'column',
                columns: 2
            },
            bodyStyle: {
                borderColor: 'silver'
            },
            defaults: {
                labelAlign: 'right',
                width: 250,
                margin: '10 25 0 25',
                labelWidth: 50
            },
            items: [
                {
                    name: '_id',
                    xtype: 'numberfield',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    xtype: 'numberfield',
                    name: 'publishStatus',
                    hidden: true,
                    itemId: 'publishStatus',
                    value: 1
                },
                {
                    name: 'publishStatus',
                    xtype: 'numberfield',
                    itemId: 'publishStatus',
                    hidden: true,
                    value: 1
                },
                {
                    xtype: 'booleancombo',
                    fieldLabel: i18n.getKey('id'),
                    name: 'showAsProductCatalog',
                    itemId: 'showAsProductCatalog',
                    displayField: 'display',
                    valueField: 'value',
                    value: true,
                    editable: false,
                    store: {
                        xtype: 'store',
                        fields: [{
                            name: 'value',
                            type: 'boolean'
                        }, {
                            name: 'display',
                            type: 'string'
                        }],
                        data: [
                            {
                                value: true,
                                display: '产品类目'
                            },
                            {
                                value: false,
                                display: '营销类目'
                            }
                        ],
                    },
                }
            ],
            searchActionHandler: function (btn) {
                var btn = this;
                var filterPanel = btn.ownerCt.ownerCt;
                var gridPanel = filterPanel.ownerCt;
                if (filterPanel.isValid()) {
                    gridPanel.getStore().load();
                }
            },
        });
        me.store = Ext.create('CGP.cmslog.store.CategoryTreeStore', {
            autoLoad: false,
            params: {
                website: 11,
                isMain: false,
                limit: 25
            }
        });
        me.on('select', function (selectModel, record) {
            this.selectedRecords.add(record.getId(), record);
        });
        me.on('deselect', function (selectModel, record) {
            this.selectedRecords.removeAtKey(record.getId());
        });
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: me.store,
            emptyMsg: i18n.getKey('noData')
        });
        me.columns = [{
            xtype: 'treecolumn',
            text: i18n.getKey('name') + '(' + i18n.getKey('productAmount') + ')',
            flex: 1,
            dataIndex: 'name',
            renderer: function (value, metadata, record) {
                return value + '-' + record.getId();
            }
        }];
        this.callParent(arguments);
    }
})
