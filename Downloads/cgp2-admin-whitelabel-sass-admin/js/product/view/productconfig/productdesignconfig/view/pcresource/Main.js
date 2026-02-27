/**
 * Created by nan on 2021/9/11
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.pcresource.store.PCResourceLibraryStore',
    'CGP.businesstype.store.BusinessTypeStore'
])
Ext.onReady(function () {
    var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcresource.store.PCResourceLibraryStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: 'productConfigDesign.id',
                type: 'number',
                value: JSGetQueryString('designId')
            }])
        }
    });
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var businessTypeStore = Ext.create('CGP.businesstype.store.BusinessTypeStore');
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('PCResource'),
        block: 'pcresource',
        editPage: 'edit.html',
        tbarCfg: {
            btnCreate: {
                handler: function (view) {
                    builderConfigTab.addNewTab({
                        id: 'designPCResourceLibrary_edit',
                        url: path + 'partials/product/productconfig/productdesignconfig/pcresource/edit.html?designId=' + JSGetQueryString('designId'),
                        title: i18n.getKey('create') + '_' + i18n.getKey('pcResourceLibrary'),
                        refresh: true
                    });
                }
            },
        },
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },
            editActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                builderConfigTab.addNewTab({
                    id: 'designPCResourceLibrary_edit',
                    url: path + 'partials/product/productconfig/productdesignconfig/pcresource/edit.html?id='
                        + record.getId() + '&designId=' + JSGetQueryString('designId'),
                    title: i18n.getKey('edit') + '_' + i18n.getKey('pcResourceLibrary') + '(' + record.getId() + ')',
                    refresh: true
                });
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: 'id',
                }, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    width: 200,
                    itemId: 'description',
                },  {
                    text: i18n.getKey('businessType'),
                    dataIndex: 'businessLib',
                    itemId: 'businessLib',
                    flex: 1,
                    xtype: 'componentcolumn',
                    renderer: function (value, mateData, record) {
                        return JSCreateHTMLTable([
                            {
                                title: i18n.getKey('id'),
                                value: value._id
                            },
                            {
                                title: i18n.getKey('name'),
                                value: value.name
                            },
                            {
                                title: i18n.getKey('resources') + i18n.getKey('type'),
                                value: value.type.split('.').pop()
                            }
                        ]);

                    }
                },
                {
                    text: i18n.getKey('pcResourceLibrary'),
                    dataIndex: 'library',
                    itemId: 'library',
                    flex: 1,
                    xtype: 'componentcolumn',
                    renderer: function (value, mateData, record) {
                        mateData.tdAttr = 'data-qtip="查看资源类型"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + value.name + '(' + value._id + ')</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        JSOpen({
                                            id: 'pcresourcelibrarypage',
                                            url: path + 'partials/pcresourcelibrary/main.html?_id=' + value._id,
                                            title: i18n.getKey('pcResourceLibrary'),
                                            refresh: true
                                        });
                                    });
                                }
                            }
                        };
                    }

                }
            ]
        },
        // 查询输入框
        filterCfg: {
            items: [{
                name: '_id',
                xtype: 'numberfield',
                hideTrigger: true,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            }, {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            }, {
                name: 'businessLib._id',
                xtype: 'combo',
                fieldLabel: i18n.getKey('businessType'),
                itemId: 'businessLib',
                editable: false,
                valueField: '_id',
                pageSize: 25,
                matchFieldWidth: false,
                displayField: 'name',
                store: businessTypeStore,
            },]
        }
    });
});
