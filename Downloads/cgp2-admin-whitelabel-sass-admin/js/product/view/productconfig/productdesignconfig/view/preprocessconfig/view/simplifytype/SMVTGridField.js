/**
 * Created by admin on 2021/05/27.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SMVTGridField", {
    extend: 'Ext.ux.form.GridField',
    alias: 'widget.mvtgridfield',
    minHeight: 260,
    store:null,
    //bodyStyle:'overflow-x:visible;overflow-y:auto;',

    initComponent: function () {
        var me = this;
        var designId = JSGetQueryString('designId');
        var productId = JSGetQueryString('productId');
        var productBomConfigId = JSGetQueryString('productBomConfigId');

        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        if(Ext.isEmpty(me.store)){
            me.store = Ext.create('Ext.data.Store', {
                storeId:'leftGridStore',
                model: 'CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SimplifySBOMMaterialViewType',
                sorters: '_id',
                pageSize:10,
                proxy : {
                    type : 'pagingmemory'
                }
            });
        }

        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.controller.Controller');
        me.gridConfig = {
            renderTo: JSGetUUID(),
            // multiSelect: true,
            // selType: 'checkboxmodel',
            store: me.store,
            minHeight: 260,
            //maxHeight: 360,
            width: 650,
            defaults: {
                width: 60
            },
            tbar: [
//                        '->',
                {
                    text: i18n.getKey('add'),
                    itemId: 'add',
                    iconCls: 'icon_add',
                    handler: function (el) {
                        var grid = el.ownerCt.ownerCt;
                        // controller.selectMVT(grid);

                        controller.showMVTWindow(designId, grid,me.store,true);
                    }
                }
            ],
            columns: [
                {xtype: 'rownumberer'},
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    width: 60,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                var store = view.getStore();
                                var index=store.pageSize*(store.currentPage-1)+rowIndex
                                Ext.Array.splice(store.proxy.data,index,1);
                                store.load();
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    xtype: 'componentcolumn',
                    renderer: function (value, matete, record) {
                        // var url= path + 'partials/product/productconfig/productdesignconfig', title='', tabId='';
                        return value;
                        // return {
                        //     xtype: 'displayfield',
                        //     value: '<a href="#")>' + record.getId() + '</a>',
                        //     sourceConfigId: record.getId(),
                        //     listeners: {
                        //         render: function (display) {
                        //             var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                        //             var ela = Ext.fly(a); //获取到a元素的element封装对象
                        //             ela.on("click", function () {
                        //
                        //                 builderConfigTab.manageMVT(url, title, tabId);
                        //             });
                        //         }
                        //     }
                        // };
                    }
                },
                {
                    text: i18n.getKey('name'),
                    flex: 1,
                    dataIndex: 'name',
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    itemId: 'clazz',
                    flex: 1,
                    renderer: function (value, metadata, record) {
                        return value.split('.').pop();
                    }
                }
            ],
            bbar: Ext.create('Ext.PagingToolbar', {
                store: me.store,
                disabledCls: 'x-tbar-loading',
                displayInfo: true, // 是否 ? 示， 分 ? 信息
                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息

            }),

        }
        me.callParent(arguments);
    },

});
