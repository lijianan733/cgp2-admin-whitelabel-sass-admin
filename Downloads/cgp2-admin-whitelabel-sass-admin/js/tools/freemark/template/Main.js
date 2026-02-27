/**
 * Created by admin on 2021/1/14.
 */
Ext.onReady(function () {
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }

    var freemarkTools = window.parent.Ext.getCmp('freemarkTools');
    var controller = Ext.create('CGP.tools.freemark.template.controller.Controller');
    var selectmodel = getQueryString('selectmodel');
    var defaultVariateStore = Ext.create('CGP.tools.freemark.template.store.VariableKey', {
        storeId: 'defaultVariateStore',
        data: [
            {
                name: 'printQty',
                valueType: 'number',
                description: '打印数量'
            },
            {
                name: 'pageIndex',
                valueType: 'number',
                description: '当前页'
            },
            {
                name: 'pageTotal',
                valueType: 'number',
                description: '总页数'
            },
            {
                name: 'barCode',
                valueType: 'string',
                description: '条码'
            }
        ]
    })
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('freemarktemplate'),
        block: 'tools/freemark/template',
        editPage: 'edit.html',
        id: 'freemarkTemplate',
        //权限控制
        //accessControl: true,

        tbarCfg: {
            disabledButtons: selectmodel == 'SINGLE' ? ['create', 'delete'] : ['delete'],
            btnCreate: {
                //disabled: freemarkTools.isLock,
                handler: function () {
                    freemarkTools.addEditTab(null, 'variable');
                }
            }
        },
        gridCfg: {
            store: Ext.create("CGP.tools.freemark.template.store.FreemarkTemplate"),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            selModel: {
                selection: "rowmodel",
                mode: selectmodel == 'SINGLE' ? "SINGLE" : 'MULTI'
            },
            editAction: selectmodel != 'SINGLE',
            deleteAction: selectmodel != 'SINGLE',
            editActionHandler: showTabEdit,
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'gridcolumn',
                    itemId: '_id',
                    sortable: true
                },
                {
                    text: i18n.getKey('productId'),
                    dataIndex: 'contextSource',
                    xtype: 'gridcolumn',
                    itemId: 'productId',
                    width: 120,
                    renderer: function (value, metadata, record) {
                        var productId = value.productId
                        metadata.tdAttr = 'data-qtip="' + productId + '"';
                        return productId;
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    xtype: 'gridcolumn',
                    itemId: 'description',
                    width: 160,
                    sortable: true
                },
                {
                    text: i18n.getKey('variable'),
                    dataIndex: 'items',
                    xtype: 'componentcolumn',
                    itemId: 'items',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        if (value) {
                            var keys = [];
                            if (value && Array.isArray(value)) {
                                keys = controller.getVarKeys(value).map(function (item) {
                                    return item.name;
                                });
                            }
                            var strKey = keys.toString();
                            metadata.tdAttr = 'data-qtip="' + strKey + '"';
                            return {
                                xtype: 'displayfield',
                                value: strKey,
                                // listeners: {
                                //     render: function (display) {
                                //         var clickElement = document.getElementById('click-params');
                                //         clickElement.addEventListener('click', function () {
                                //             var wind=Ext.create("Ext.window.Window",{
                                //                 itemId: "pageParams",
                                //                 title: i18n.getKey('pageParams'),
                                //                 layout: 'fit',
                                //                 items: [
                                //                     Ext.create('CGP.pages.view.Params',{data:value})
                                //                 ]
                                //             });
                                //             wind.show();
                                //         },false);
                                //     }
                                // }
                            }
                        } else {
                            return "";
                        }
                    }
                }
            ]
        },
        // 搜索框
        filterCfg: {
            defaults: {
                isLike: false
            },
            items: [
                {
                    id: 'idSearchField',
                    name: '_id',
                    xtype: 'numberfield',
                    listeners: {
                        render: function (comp) {
                            var pageContentSchemaId = getQueryString('id');
                            if (pageContentSchemaId) {
                                comp.setValue(pageContentSchemaId);
                            }
                        }
                    },
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id'
                },
                {
                    xtype: 'numberfield',
                    itemId: 'productId',
                    name: 'contextSource.productId',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('productId')
                },
                {
                    xtype: 'textfield',
                    itemId: 'description',
                    name: 'description',
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('description')
                }
            ]
        },
        listeners: {
            afterload: function (p) {
                var button = Ext.widget({
                    xtype: 'button',
                    text: i18n.getKey('check') + i18n.getKey('defaultVariate'),
                    width: 150,
                    iconCls: 'icon_check',
                    handler: function () {
                        var wind = Ext.create("Ext.window.Window", {
                            itemId: "defalutVariate",
                            title: i18n.getKey('defalutVariate'),
                            layout: 'fit',
                            width: 600,
                            height: 400,
                            items: [
                                {
                                    xtype: 'grid',
                                    store: defaultVariateStore,
                                    columns: [
                                        {header: i18n.getKey('name'), dataIndex: 'name'},
                                        {header: i18n.getKey('type'), dataIndex: 'valueType'},
                                        {header: i18n.getKey('description'), dataIndex: 'description', flex: 1}
                                    ]
                                }
                            ]
                        });
                        wind.show();
                    }
                })
                p.toolbar.add(button);
            }
        }
    });

    function showTabEdit(gridview, recordIndex, cellIndex, fun, button, record) {
        var id = record.getId();
        freemarkTools.addEditTab(id, 'variable');
    }
});