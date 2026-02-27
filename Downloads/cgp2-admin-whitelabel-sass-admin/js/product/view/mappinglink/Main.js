/**
 * Created by nan on 2019/12/12.
 */
Ext.onReady(function () {
    // 用于下面的资源
    // 初始化资源
    // 创建一个GridPage控件
    var productId = JSGetQueryString('productId');
    var controller = Ext.create('CGP.product.view.mappinglink.controller.Controller');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('mappingLink'),
        block: 'product/mappinglink',
        // 编辑页面
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function () {
                    JSOpen({
                        id: 'product/mappinglink_edit',
                        url: path + "partials/product/mappinglink/edit.html?productId=" + productId,
                        title: i18n.getKey('create') + '_' + i18n.getKey('mappingLink'),
                        refresh: true
                    });
                }
            },
        },
        gridCfg: {
            // store是指store.js
            store: Ext.create('CGP.product.view.mappinglink.store.MappingLinkStore'),
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                var recordId = record.getId();
                var productId = JSGetQueryString('productId');
                JSOpen({
                    id: 'product/mappinglink_edit',
                    url: path + 'partials/product/mappinglink/edit.html?id=' + recordId + '&productId=' + productId,
                    title: i18n.getKey('edit') + '_' + i18n.getKey('mappingLink') + '_' + record.getId(),
                    refresh: true
                });
            },
            columns: [
                {
                    sortable: false,
                    text: i18n.getKey('operation'),
                    width: 100,
                    autoSizeColumn: false,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, row, col, store, gridView) {
                       ;
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            style: 'padding:0',
                            default: {
                                width: 100
                            },
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            //检查链的合法性
                                            {
                                                text: i18n.getKey('检查mappingLink的合法性'),
                                                iconCls: 'icon_check',
                                                handler: function (btn) {
                                                    controller.checkUpMappingLink(record.getId(), gridView.ownerCt);
                                                }
                                            },
                                            //查看链图
                                            {
                                                text: i18n.getKey('查看mappingLink示意图'),
                                                iconCls: 'icon_check',
                                                handler: function (btn) {
                                                    btn.up('viewport').el.mask('加载中...');
                                                    setTimeout(function () {
                                                        var win = Ext.create('CGP.common.commoncomp.CheckMaterialBomPictureWindow', {
                                                            title: i18n.getKey('查看mappingLink示意图'),
                                                            modal: true,
                                                            materialId: record.getId(),
                                                            imgSeverUrl: adminPath + 'api/productAttributeMappingDiagrams/' + record.getId(),
                                                        });
                                                        btn.up('viewport').el.unmask();
                                                        win.show();
                                                    }, 100);
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    sortable: true
                }, {
                    text: i18n.getKey('linkName'),
                    dataIndex: 'linkName',
                    flex: 1,
                    sortable: true
                }]
        },
        // 查询输入框
        filterCfg: {
            items: [{
                id: 'productId',
                name: 'productId',
                xtype: 'numberfield',
                hideTrigger: true,
                hidden: true,
                allowDecimals: false,
                value: productId || null,
                fieldLabel: i18n.getKey('productId'),
                itemId: 'productId'
            }, {
                id: 'id',
                name: '_id',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            }, {
                id: 'linkName',
                name: 'linkName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('linkName'),
                itemId: 'linkName'
            }]
        },
        listeners: {
            afterrender: function () {
                var page = this;
                var productId = JSGetQueryString('productId');
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        }
    });
})
