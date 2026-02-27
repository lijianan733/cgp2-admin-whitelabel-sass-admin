/**
 * Created by nan on 2021/1/13
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.SpecialPreProcessConfigGrid', {
    extend: "Ext.grid.Panel",
    alias: 'widget.specialpreprocessconfiggrid',
    formItems: null,//新建和修改的表单中的具体内容
    saveHandler: null,
    formConfig: null,//编辑弹窗的中form表单的配置
    defaults: {
        width: 150
    },
    columns: [],
    clazz: null,
    initComponent: function () {
        var me = this;
        me.columns = [{
            xtype: 'actioncolumn',
            itemId: 'actioncolumn',
            width: 60,
            hidden: me.isReadOnly,
            sortable: false,
            tdCls: 'vertical-middle',
            resizable: false,
            menuDisabled: true,
            items: [
                {
                    iconCls: 'icon_edit icon_margin',
                    itemId: 'actionedit',
                    tooltip: 'Edit',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        var grid = view.ownerCt;
                        return grid.isReadOnly;
                    },
                    handler: function (view, rowIndex, colIndex, icon, event, record) {
                        var grid = view.ownerCt;
                        var builderConfigTab = grid.ownerCt.builderConfigTab;
                        builderConfigTab.editMaterialViewTypePreProcessConfig(grid.ownerCt.designId, record.getId(), 'edit', grid.clazz);
                    }
                },
                {
                    iconCls: 'icon_remove icon_margin',
                    itemId: 'actionremove',
                    tooltip: 'Remove',
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        var grid = view.ownerCt;
                        return grid.isReadOnly;
                    },
                    handler: me.deleteHandler || function (view, rowIndex, colIndex) {
                        var grid = view.ownerCt;
                        Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            var selected = grid.getSelectionModel().getSelection();
                            if (selector == 'yes') {
                                view.loadMask.show();
                                var store = view.getStore();
                                store.removeAt(rowIndex);
                                store.sync({
                                    callback: function (o, m) {
                                        view.loadMask.hide();
                                        if (o.proxy.reader.rawData['success'] === true) {
                                            Ext.ux.util.prompt(i18n.getKey('deleteSuccess'), i18n.getKey('prompt'));
                                            grid.store.load();
                                        } else {
                                            Ext.ux.util.prompt(o.proxy.reader.rawData.data.message);
                                            store.reload({
                                                callback: function () {
                                                    grid.getSelectionModel().select(selected);
                                                }
                                            });

                                        }
                                    }
                                });
                            }
                        });
                    }
                },
            ]
        }, {
            text: i18n.getKey('id'),
            dataIndex: '_id',
            itemId: '_id'
        }, {
            text: i18n.getKey('description'),
            dataIndex: 'description',
            itemId: 'description',
            width: 200,
        }, {
            text: i18n.getKey('目标MVT'),
            dataIndex: 'targetMaterialViewType',
            itemId: 'targetMaterialViewType',
            width: 250,
            renderer: function (value, metadata, record) {
                return value.description + '(' + value._id + ')';
            }
        }, {
            text: i18n.getKey('是否初始时运行'),
            dataIndex: 'runWhenInit',
            itemId: 'runWhenInit',
            width: 150,
            renderer: function (value, metadata, record) {
                return value ? 'true' : 'false'
            }
        }].concat(me.columns);
        me.bbar = {//底端的分页栏
            xtype: 'pagingtoolbar',
            store: me.store,
            style: {
                border: 1,
                borderTopWidth: '1px !important'
            },
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        };
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }
})